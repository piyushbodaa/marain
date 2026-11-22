import { app, BrowserWindow, ipcMain, shell } from 'electron';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { exec, execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);
const execFileAsync = promisify(execFile);

const DEFAULT_WORKSPACE = path.join(os.homedir(), 'Zero2AI-Projects');
const MAX_OUTPUT_BYTES = 64 * 1024; // 64 KB output cap
const COMMAND_TIMEOUT_MS = 15_000;

const ALLOWED_COMMANDS = new Set([
  'pwd',
  'ls',
  'dir',
  'cat',
  'head',
  'tail',
  'echo',
  'printf',
  'mkdir',
  'touch',
  'cp',
  'mv',
  'grep',
  'find',
  'wc',
  'tree',
  'whoami',
  'uname',
  'date',
  'which',
  'node',
  'npm',
  'npx',
  'git',
  'claude',
  'ollama',
  'python3',
  'python',
  'sort',
  'uniq',
  'cut',
  'tr',
  'stat',
  'file',
  'diff',
  'cd',
]);

const FORBIDDEN_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /[`\r\n\0]/, reason: 'Multi-line commands or backtick subshells are not allowed.' },
  { pattern: /\$\(/, reason: 'Command substitution $(...) is blocked in the safe sandbox.' },
  { pattern: /[<>]\(/, reason: 'Process substitution is blocked in the safe sandbox.' },
  { pattern: /\b(sudo|su|doas|pkexec)\b/i, reason: 'Privilege escalation commands are blocked.' },
  { pattern: /\brm\b/i, reason: 'File deletion with rm is blocked in the safe beginner sandbox.' },
  {
    pattern: /\b(mkfs|dd|fdisk|parted|mount|umount|shutdown|reboot|poweroff|halt|systemctl|kill|killall|pkill|chmod|chown)\b/i,
    reason: 'System administration and destructive commands are blocked.',
  },
  {
    pattern: /\b(curl|wget|nc|ncat|netcat|ssh|scp|rsync|ftp|telnet|eval|exec|env|printenv)\b/i,
    reason: 'Network transfer, remote shell, and environment dump commands are blocked.',
  },
  {
    pattern: /(^|\s)\/(etc|root|boot|sys|proc|dev|usr|bin|sbin|var|lib)\b/,
    reason: 'Accessing system directories outside your workspace is blocked.',
  },
  {
    pattern: /~?\/\.(ssh|gnupg|aws|kube|docker|bashrc|zshrc|profile|netrc)\b/,
    reason: 'Accessing sensitive dotfiles is blocked.',
  },
  {
    pattern: />\s*\/|>\s*~/,
    reason: 'Redirecting output to absolute or home paths is blocked.',
  },
  {
    pattern: /\bgit\s+(push|clean|reset\s+--hard)\b/i,
    reason: 'Destructive or remote-pushing git operations are blocked in the sandbox.',
  },
  {
    pattern: /\.\.[/\\]\.\./,
    reason: 'Deep parent directory traversal (../..) is blocked.',
  },
];

function ensureWorkspaceDir(): string {
  try {
    fs.mkdirSync(DEFAULT_WORKSPACE, { recursive: true });
  } catch {
    // ignore if already exists or cannot create
  }
  return DEFAULT_WORKSPACE;
}

function sanitizeFolderName(name: string): string {
  const cleaned = String(name || '')
    .trim()
    .replace(/[/\\]+/g, '-')
    .replace(/\.\.+/g, '-')
    .replace(/[^a-zA-Z0-9._-\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);

  if (!cleaned || cleaned === '.' || cleaned === '..') {
    return 'my-ai-project';
  }
  return cleaned;
}

function isPathInside(parent: string, candidate: string): boolean {
  const resolvedParent = path.resolve(parent);
  const resolvedCandidate = path.resolve(candidate);
  return (
    resolvedCandidate === resolvedParent ||
    resolvedCandidate.startsWith(resolvedParent + path.sep)
  );
}

function resolveSafeWorkingDir(requestedCwd?: string): { ok: boolean; dir: string; error?: string } {
  const workspace = ensureWorkspaceDir();
  if (!requestedCwd || !requestedCwd.trim()) {
    return { ok: true, dir: workspace };
  }

  let raw = requestedCwd.trim();
  if (raw === '~') {
    raw = os.homedir();
  } else if (raw.startsWith('~/')) {
    raw = path.join(os.homedir(), raw.slice(2));
  }

  const resolved = path.isAbsolute(raw) ? path.resolve(raw) : path.resolve(workspace, raw);

  if (!isPathInside(workspace, resolved) && resolved !== os.homedir()) {
    return {
      ok: false,
      dir: workspace,
      error: `For safety, commands are restricted to ${workspace} (requested: ${resolved}).`,
    };
  }

  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) {
    return {
      ok: false,
      dir: workspace,
      error: `Directory not found: ${resolved}`,
    };
  }

  return { ok: true, dir: resolved };
}

function extractCommandSegments(command: string): string[] {
  // Split command on &&, ||, ;, | outside single/double quotes
  const segments: string[] = [];
  let current = '';
  let inSingle = false;
  let inDouble = false;

  for (let i = 0; i < command.length; i++) {
    const ch = command[i];
    const next = command[i + 1];

    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      current += ch;
    } else if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      current += ch;
    } else if (!inSingle && !inDouble) {
      if ((ch === '&' && next === '&') || (ch === '|' && next === '|')) {
        segments.push(current.trim());
        current = '';
        i++;
      } else if (ch === ';' || ch === '|') {
        segments.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    } else {
      current += ch;
    }
  }
  if (current.trim()) {
    segments.push(current.trim());
  }
  return segments;
}

function validateSafeCommand(command: string): { ok: boolean; error?: string } {
  const trimmed = command.trim();
  if (!trimmed) {
    return { ok: false, error: 'Please enter a command to run.' };
  }
  if (trimmed.length > 500) {
    return { ok: false, error: 'Command is too long (max 500 characters in safe sandbox).' };
  }

  for (const rule of FORBIDDEN_PATTERNS) {
    if (rule.pattern.test(trimmed)) {
      return { ok: false, error: `Blocked for safety: ${rule.reason}` };
    }
  }

  const segments = extractCommandSegments(trimmed);
  if (segments.length === 0) {
    return { ok: false, error: 'Please enter a valid command.' };
  }

  for (const seg of segments) {
    const firstToken = seg.split(/\s+/)[0]?.replace(/^["']|["']$/g, '') || '';
    if (!firstToken) continue;
    if (firstToken.includes('/')) {
      return {
        ok: false,
        error: `Blocked for safety: running direct paths ("${firstToken}") is not allowed. Use a standard tool name like node, git, ls, or pwd.`,
      };
    }
    if (!ALLOWED_COMMANDS.has(firstToken)) {
      return {
        ok: false,
        error: `Command "${firstToken}" is not in the beginner safe-sandbox allowlist. Try: pwd, ls, mkdir, cat, echo, node, npm, git, claude, or ollama.`,
      };
    }
  }

  return { ok: true };
}

function truncateOutput(text: string): string {
  if (Buffer.byteLength(text, 'utf8') <= MAX_OUTPUT_BYTES) {
    return text;
  }
  return text.slice(0, MAX_OUTPUT_BYTES) + '\n... [output truncated at 64 KB limit]';
}

async function checkToolInstalled(tool: string): Promise<boolean> {
  try {
    const cmd = process.platform === 'win32' ? 'where' : 'which';
    await execFileAsync(cmd, [tool], { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
}

interface ProviderCallRequest {
  provider: 'openai' | 'anthropic' | 'gemini' | 'ollama';
  apiKey?: string;
  baseUrl?: string;
  model: string;
  systemPrompt?: string;
  prompt: string;
}

async function handleProviderCall(req: ProviderCallRequest) {
  const start = Date.now();
  const provider = req.provider;
  const model = (req.model || '').trim();
  const prompt = (req.prompt || '').trim();
  const systemPrompt = req.systemPrompt?.trim();
  const apiKey = req.apiKey?.trim() || '';

  if (!prompt) {
    return { ok: false, latencyMs: 0, error: 'Prompt cannot be empty.' };
  }
  if (!model) {
    return { ok: false, latencyMs: 0, error: 'Please choose a model name first.' };
  }
  if (provider !== 'ollama' && !apiKey) {
    return {
      ok: false,
      latencyMs: 0,
      error: `No API key provided for ${provider}. Add your key in API & Mode Settings, or switch to Practice Mode.`,
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  try {
    let url = '';
    let headers: Record<string, string> = { 'Content-Type': 'application/json' };
    let body: Record<string, unknown> = {};

    if (provider === 'openai') {
      const base = (req.baseUrl || 'https://api.openai.com/v1').replace(/\/+$/, '');
      url = `${base}/chat/completions`;
      headers.Authorization = `Bearer ${apiKey}`;
      const messages: Array<{ role: string; content: string }> = [];
      if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
      messages.push({ role: 'user', content: prompt });
      body = { model, messages };
    } else if (provider === 'anthropic') {
      const base = (req.baseUrl || 'https://api.anthropic.com').replace(/\/+$/, '');
      url = `${base}/v1/messages`;
      headers['x-api-key'] = apiKey;
      headers['anthropic-version'] = '2023-06-01';
      body = {
        model,
        max_tokens: 2048,
        ...(systemPrompt ? { system: systemPrompt } : {}),
        messages: [{ role: 'user', content: prompt }],
      };
    } else if (provider === 'gemini') {
      const base = (req.baseUrl || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/+$/, '');
      url = `${base}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
      body = {
        ...(systemPrompt
          ? { system_instruction: { parts: [{ text: systemPrompt }] } }
          : {}),
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      };
    } else if (provider === 'ollama') {
      const base = (req.baseUrl || 'http://localhost:11434').replace(/\/+$/, '');
      url = `${base}/api/chat`;
      const messages: Array<{ role: string; content: string }> = [];
      if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
      messages.push({ role: 'user', content: prompt });
      body = { model, stream: false, messages };
    } else {
      return { ok: false, latencyMs: Date.now() - start, error: `Unsupported provider: ${String(provider)}` };
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const latencyMs = Date.now() - start;
    const rawStatus = response.status;
    const rawText = await response.text();

    let json: Record<string, any> | null = null;
    try {
      json = JSON.parse(rawText);
    } catch {
      json = null;
    }

    if (!response.ok) {
      const upstreamMsg =
        json?.error?.message ||
        json?.error ||
        json?.message ||
        rawText.slice(0, 240) ||
        `HTTP ${rawStatus}`;
      let friendly = `Provider returned HTTP ${rawStatus}: ${upstreamMsg}`;
      if (rawStatus === 401 || rawStatus === 403) {
        friendly = `Authentication failed (HTTP ${rawStatus}). Double-check that your ${provider} API key is active and pasted completely.`;
      } else if (rawStatus === 429) {
        friendly = `Rate limit or credit limit reached (HTTP 429). Check your ${provider} billing cap or wait a moment.`;
      } else if (rawStatus === 404) {
        friendly = `Model "${model}" was not found on ${provider} (HTTP 404). Try selecting another model in Settings.`;
      }
      return { ok: false, latencyMs, rawStatus, error: friendly };
    }

    let text = '';
    let inputTokens: number | undefined;
    let outputTokens: number | undefined;

    if (provider === 'openai') {
      text = json?.choices?.[0]?.message?.content ?? '';
      inputTokens = json?.usage?.prompt_tokens;
      outputTokens = json?.usage?.completion_tokens;
    } else if (provider === 'anthropic') {
      const blocks = Array.isArray(json?.content) ? json.content : [];
      text = blocks
        .filter((b: any) => b?.type === 'text')
        .map((b: any) => b.text)
        .join('\n');
      inputTokens = json?.usage?.input_tokens;
      outputTokens = json?.usage?.output_tokens;
    } else if (provider === 'gemini') {
      const parts = json?.candidates?.[0]?.content?.parts;
      text = Array.isArray(parts) ? parts.map((p: any) => p?.text ?? '').join('\n') : '';
      inputTokens = json?.usageMetadata?.promptTokenCount;
      outputTokens = json?.usageMetadata?.candidatesTokenCount;
    } else if (provider === 'ollama') {
      text = json?.message?.content ?? json?.response ?? '';
      inputTokens = json?.prompt_eval_count;
      outputTokens = json?.eval_count;
    }

    return {
      ok: true,
      text,
      inputTokens,
      outputTokens,
      latencyMs,
      rawStatus,
    };
  } catch (err: any) {
    const latencyMs = Date.now() - start;
    if (err?.name === 'AbortError') {
      return { ok: false, latencyMs, error: 'Request timed out after 30 seconds.' };
    }
    if (provider === 'ollama') {
      return {
        ok: false,
        latencyMs,
        error: `Could not connect to local Ollama at ${req.baseUrl || 'http://localhost:11434'}. Make sure Ollama is running (try "ollama serve").`,
      };
    }
    return {
      ok: false,
      latencyMs,
      error: `Network error calling ${provider}: ${err?.message || String(err)}`,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

function getProgressFilePath(): string {
  return path.join(app.getPath('userData'), 'progress.json');
}

function registerIpcHandlers() {
  ipcMain.handle(
    'zero2ai:exportProject',
    async (_event, folderName: string, files: Record<string, string>) => {
      try {
        const workspace = ensureWorkspaceDir();
        const safeFolder = sanitizeFolderName(folderName);
        const targetDir = path.resolve(workspace, safeFolder);

        if (!isPathInside(workspace, targetDir) || targetDir === workspace) {
          return { ok: false, path: '', error: 'Invalid project folder name.' };
        }

        if (!files || typeof files !== 'object' || Object.keys(files).length === 0) {
          return { ok: false, path: '', error: 'No files were provided to export.' };
        }

        fs.mkdirSync(targetDir, { recursive: true });

        for (const [rawRelPath, content] of Object.entries(files)) {
          const normalized = path.normalize(rawRelPath).replace(/^([/\\])+/, '');
          if (
            !normalized ||
            normalized.startsWith('..') ||
            path.isAbsolute(rawRelPath) ||
            normalized.includes(`..${path.sep}`)
          ) {
            return {
              ok: false,
              path: '',
              error: `Unsafe file path rejected: "${rawRelPath}"`,
            };
          }

          const destFile = path.resolve(targetDir, normalized);
          if (!isPathInside(targetDir, destFile) || destFile === targetDir) {
            return {
              ok: false,
              path: '',
              error: `Path traversal rejected for "${rawRelPath}"`,
            };
          }

          fs.mkdirSync(path.dirname(destFile), { recursive: true });
          fs.writeFileSync(destFile, typeof content === 'string' ? content : String(content), 'utf8');
        }

        return { ok: true, path: targetDir };
      } catch (err: any) {
        return {
          ok: false,
          path: '',
          error: err?.message || 'Failed to export project files.',
        };
      }
    }
  );

  ipcMain.handle('zero2ai:openPath', async (_event, targetPath: string) => {
    try {
      if (!targetPath || typeof targetPath !== 'string') {
        return { ok: false };
      }
      const resolved = path.resolve(targetPath);
      if (!fs.existsSync(resolved)) {
        return { ok: false };
      }
      const errMsg = await shell.openPath(resolved);
      return { ok: errMsg === '' };
    } catch {
      return { ok: false };
    }
  });

  ipcMain.handle('zero2ai:runSafeCommand', async (_event, command: string, cwd?: string) => {
    const dirCheck = resolveSafeWorkingDir(cwd);
    if (!dirCheck.ok) {
      return {
        ok: false,
        stdout: '',
        stderr: dirCheck.error || 'Invalid working directory.',
        exitCode: 1,
        cwd: dirCheck.dir,
      };
    }

    const workingDir = dirCheck.dir;
    const trimmed = String(command || '').trim();

    // Handle standalone "cd <dir>" cleanly so the sandbox terminal tracks working directory
    const cdMatch = trimmed.match(/^cd(?:\s+(.+))?$/);
    if (cdMatch) {
      const workspace = ensureWorkspaceDir();
      const targetArg = (cdMatch[1] || '').trim().replace(/^["']|["']$/g, '');
      const nextDir = !targetArg || targetArg === '~'
        ? workspace
        : path.resolve(workingDir, targetArg);

      if (!isPathInside(workspace, nextDir)) {
        return {
          ok: false,
          stdout: '',
          stderr: `Safe sandbox stays inside ${workspace}.`,
          exitCode: 1,
          cwd: workingDir,
        };
      }
      if (!fs.existsSync(nextDir) || !fs.statSync(nextDir).isDirectory()) {
        return {
          ok: false,
          stdout: '',
          stderr: `cd: no such directory: ${targetArg}`,
          exitCode: 1,
          cwd: workingDir,
        };
      }
      return {
        ok: true,
        stdout: '',
        stderr: '',
        exitCode: 0,
        cwd: nextDir,
      };
    }

    const validation = validateSafeCommand(trimmed);
    if (!validation.ok) {
      return {
        ok: false,
        stdout: '',
        stderr: validation.error || 'Command blocked by safety policy.',
        exitCode: 126,
        cwd: workingDir,
      };
    }

    try {
      const { stdout, stderr } = await execAsync(trimmed, {
        cwd: workingDir,
        timeout: COMMAND_TIMEOUT_MS,
        maxBuffer: MAX_OUTPUT_BYTES * 2,
        env: {
          PATH: process.env.PATH || '/usr/local/bin:/usr/bin:/bin',
          HOME: os.homedir(),
          LANG: process.env.LANG || 'en_US.UTF-8',
          TERM: 'xterm-256color',
        },
      });
      return {
        ok: true,
        stdout: truncateOutput(stdout || ''),
        stderr: truncateOutput(stderr || ''),
        exitCode: 0,
        cwd: workingDir,
      };
    } catch (err: any) {
      const exitCode = typeof err?.code === 'number' ? err.code : 1;
      const timedOut = Boolean(err?.killed && err?.signal === 'SIGTERM');
      return {
        ok: false,
        stdout: truncateOutput(err?.stdout || ''),
        stderr: truncateOutput(
          timedOut
            ? 'Command timed out after 15 seconds.'
            : err?.stderr || err?.message || 'Command failed.'
        ),
        exitCode,
        cwd: workingDir,
      };
    }
  });

  ipcMain.handle('zero2ai:testProviderCall', async (_event, req: ProviderCallRequest) => {
    return handleProviderCall(req);
  });

  ipcMain.handle('zero2ai:getEnvironmentInfo', async () => {
    const defaultWorkspace = ensureWorkspaceDir();
    const [node, git, claude, ollama] = await Promise.all([
      checkToolInstalled('node'),
      checkToolInstalled('git'),
      checkToolInstalled('claude'),
      checkToolInstalled('ollama'),
    ]);

    return {
      platform: process.platform,
      homeDir: os.homedir(),
      defaultWorkspace,
      installedTools: { node, git, claude, ollama },
    };
  });

  ipcMain.handle('zero2ai:loadProgress', async () => {
    try {
      const filePath = getProgressFilePath();
      if (!fs.existsSync(filePath)) {
        return null;
      }
      const raw = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  ipcMain.handle('zero2ai:saveProgress', async (_event, progress: unknown) => {
    try {
      const filePath = getProgressFilePath();
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      const tmpPath = `${filePath}.tmp`;
      fs.writeFileSync(tmpPath, JSON.stringify(progress, null, 2), 'utf8');
      fs.renameSync(tmpPath, filePath);
    } catch {
      // ignore write errors so renderer never crashes
    }
  });
}

let mainWindow: BrowserWindow | null = null;

function createMainWindow() {
  const iconPath = path.join(__dirname, '../build/icon.png');
  mainWindow = new BrowserWindow({
    width: 1380,
    height: 880,
    minWidth: 1024,
    minHeight: 680,
    title: 'Zero2AI Studio',
    backgroundColor: '#FAFAF7',
    autoHideMenuBar: true,
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  const devUrl = process.env.VITE_DEV_SERVER_URL;
  if (devUrl) {
    mainWindow.loadURL(devUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  ensureWorkspaceDir();
  registerIpcHandlers();
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
