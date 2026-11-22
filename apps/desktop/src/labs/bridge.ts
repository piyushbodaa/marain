import type {
  ApiConfig,
  EnvironmentInfo,
  ExportProjectResult,
  OpenPathResult,
  ProviderCallRequest,
  ProviderCallResponse,
  SafeCommandResult,
  Zero2AIBridgeAPI,
} from './types';

function getRawBridge(): Zero2AIBridgeAPI | undefined {
  if (typeof window === 'undefined') return undefined;
  return (window as unknown as { zero2ai?: Zero2AIBridgeAPI }).zero2ai;
}

export function isDesktopBridgeAvailable(): boolean {
  const api = getRawBridge();
  return Boolean(api && typeof api.exportProject === 'function');
}

export function isByokReady(apiConfig: ApiConfig): boolean {
  if (apiConfig.mode !== 'byok') return false;
  if (apiConfig.provider === 'ollama') return true;
  return apiConfig.apiKey.trim().length > 0;
}

export function sanitizeFolderName(name: string): string {
  const cleaned = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return cleaned || 'my-zero2ai-project';
}

function triggerBrowserDownload(filename: string, content: string, mime = 'text/html;charset=utf-8'): void {
  if (typeof document === 'undefined' || typeof URL === 'undefined') return;
  try {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  } catch {
    // Ignore download errors in headless environments
  }
}

export async function exportProject(
  folderName: string,
  files: Record<string, string>
): Promise<ExportProjectResult> {
  const safeName = sanitizeFolderName(folderName);
  const api = getRawBridge();

  if (api?.exportProject) {
    try {
      const res = await api.exportProject(safeName, files);
      return { ...res, simulated: false };
    } catch (err) {
      return {
        ok: false,
        path: '',
        error: err instanceof Error ? err.message : 'Failed to export project via desktop bridge.',
      };
    }
  }

  // Graceful web preview fallback: download standalone index.html if present, else a combined text bundle
  const primaryHtml = files['index.html'];
  if (primaryHtml) {
    // Inline styles.css and script.js / app.js for a single-file browser download that opens cleanly
    let bundled = primaryHtml;
    if (files['styles.css']) {
      bundled = bundled.replace(
        /<link[^>]*href=["'](?:\.\/)?styles\.css["'][^>]*>/i,
        `<style>\n${files['styles.css']}\n</style>`
      );
    }
    const jsEntry = files['script.js'] || files['app.js'];
    if (jsEntry) {
      bundled = bundled.replace(
        /<script[^>]*src=["'](?:\.\/)?(?:script|app)\.js["'][^>]*>\s*<\/script>/i,
        `<script>\n${jsEntry}\n</script>`
      );
    }
    triggerBrowserDownload(`${safeName}.html`, bundled, 'text/html;charset=utf-8');
  } else {
    const combined = Object.entries(files)
      .map(([file, text]) => `=== ${file} ===\n${text}\n`)
      .join('\n');
    triggerBrowserDownload(`${safeName}.txt`, combined, 'text/plain;charset=utf-8');
  }

  return {
    ok: true,
    path: `~/Zero2AI-Projects/${safeName} (downloaded as ${safeName}.html in browser preview)`,
    simulated: true,
  };
}

export async function openPath(targetPath: string): Promise<OpenPathResult> {
  const api = getRawBridge();
  if (api?.openPath) {
    try {
      return await api.openPath(targetPath);
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : 'Could not open folder.',
      };
    }
  }
  return {
    ok: false,
    error: 'Opening local folders is available inside the Zero2AI Linux Desktop app.',
  };
}

export async function getEnvironmentInfo(): Promise<EnvironmentInfo> {
  const api = getRawBridge();
  if (api?.getEnvironmentInfo) {
    try {
      const info = await api.getEnvironmentInfo();
      return { ...info, isDesktopApp: true };
    } catch {
      // Fall through to safe fallback
    }
  }
  return {
    platform: 'web-preview',
    homeDir: '/home/learner',
    defaultWorkspace: '~/Zero2AI-Projects',
    installedTools: {
      node: false,
      git: false,
      claude: false,
      ollama: false,
    },
    isDesktopApp: false,
  };
}

// Safe simulated Linux command fallback when running in web preview outside Electron
const simDirs = new Set<string>(['~/Zero2AI-Projects', '~/Zero2AI-Projects/demo-site']);

export async function runSafeCommand(
  command: string,
  cwd?: string
): Promise<SafeCommandResult> {
  const api = getRawBridge();
  if (api?.runSafeCommand) {
    try {
      const res = await api.runSafeCommand(command, cwd);
      return { ...res, simulated: false };
    } catch (err) {
      return {
        ok: false,
        stdout: '',
        stderr: err instanceof Error ? err.message : 'Command execution failed.',
        exitCode: 1,
        cwd: cwd || '~/Zero2AI-Projects',
      };
    }
  }

  const currentDir = cwd || '~/Zero2AI-Projects';
  const trimmed = command.trim();

  if (!trimmed) {
    return { ok: true, stdout: '', stderr: '', exitCode: 0, cwd: currentDir, simulated: true };
  }

  if (/\b(rm\s+-rf|sudo|mkfs|dd\s+if=|shutdown|reboot)\b/i.test(trimmed)) {
    return {
      ok: false,
      stdout: '',
      stderr: 'Blocked by Zero2AI safety sandbox: destructive system commands are not allowed.',
      exitCode: 126,
      cwd: currentDir,
      simulated: true,
    };
  }

  if (trimmed === 'pwd') {
    return {
      ok: true,
      stdout: currentDir.replace('~', '/home/learner'),
      stderr: '',
      exitCode: 0,
      cwd: currentDir,
      simulated: true,
    };
  }

  if (trimmed === 'ls' || trimmed === 'ls -la' || trimmed === 'ls -l') {
    const entries =
      currentDir === '~/Zero2AI-Projects'
        ? Array.from(simDirs)
            .filter((d) => d !== '~/Zero2AI-Projects')
            .map((d) => d.replace('~/Zero2AI-Projects/', '') + '/')
            .concat(['README.txt'])
        : ['index.html', 'styles.css', 'CLAUDE.md'];
    return {
      ok: true,
      stdout: entries.join('  '),
      stderr: '',
      exitCode: 0,
      cwd: currentDir,
      simulated: true,
    };
  }

  if (trimmed.startsWith('mkdir ')) {
    const target = trimmed.replace(/^mkdir\s+(-p\s+)?/, '').trim();
    const safeDir = sanitizeFolderName(target);
    simDirs.add(`~/Zero2AI-Projects/${safeDir}`);
    return {
      ok: true,
      stdout: `Created folder: ${safeDir}/`,
      stderr: '',
      exitCode: 0,
      cwd: currentDir,
      simulated: true,
    };
  }

  if (trimmed.startsWith('cd ')) {
    const dest = trimmed.slice(3).trim();
    if (dest === '..' || dest === '~' || dest === '~/Zero2AI-Projects') {
      return {
        ok: true,
        stdout: '',
        stderr: '',
        exitCode: 0,
        cwd: '~/Zero2AI-Projects',
        simulated: true,
      };
    }
    const candidate = `~/Zero2AI-Projects/${dest.replace(/\/$/, '')}`;
    if (simDirs.has(candidate)) {
      return { ok: true, stdout: '', stderr: '', exitCode: 0, cwd: candidate, simulated: true };
    }
    return {
      ok: false,
      stdout: '',
      stderr: `cd: no such directory: ${dest}`,
      exitCode: 1,
      cwd: currentDir,
      simulated: true,
    };
  }

  if (trimmed === 'node -v' || trimmed === 'node --version') {
    return {
      ok: true,
      stdout: 'v22.14.0 (simulated in browser preview — open Desktop app for real host shell)',
      stderr: '',
      exitCode: 0,
      cwd: currentDir,
      simulated: true,
    };
  }

  if (trimmed === 'git --version') {
    return {
      ok: true,
      stdout: 'git version 2.47.0 (simulated in browser preview)',
      stderr: '',
      exitCode: 0,
      cwd: currentDir,
      simulated: true,
    };
  }

  if (trimmed === 'claude --version') {
    return {
      ok: true,
      stdout: 'Install in real Linux terminal with: npm install -g @anthropic-ai/claude-code',
      stderr: '',
      exitCode: 0,
      cwd: currentDir,
      simulated: true,
    };
  }

  if (trimmed.startsWith('echo ')) {
    return {
      ok: true,
      stdout: trimmed.slice(5).replace(/^["']|["']$/g, ''),
      stderr: '',
      exitCode: 0,
      cwd: currentDir,
      simulated: true,
    };
  }

  return {
    ok: true,
    stdout: `[Browser Preview Sandbox] Ran: ${trimmed}\nTip: Launch the Zero2AI Linux Desktop app to execute real shell commands inside ~/Zero2AI-Projects.`,
    stderr: '',
    exitCode: 0,
    cwd: currentDir,
    simulated: true,
  };
}

export async function testProviderCall(
  req: ProviderCallRequest
): Promise<ProviderCallResponse> {
  const api = getRawBridge();
  if (api?.testProviderCall) {
    try {
      const res = await api.testProviderCall(req);
      return { ...res, simulated: false };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : 'Live provider request failed.',
        simulated: false,
      };
    }
  }

  // In browser preview, Ollama localhost can sometimes be reached directly
  if (req.provider === 'ollama') {
    const start = performance.now();
    try {
      const base = (req.baseUrl || 'http://localhost:11434').replace(/\/$/, '');
      const response = await fetch(`${base}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: req.model || 'llama3.2',
          system: req.systemPrompt,
          prompt: req.prompt,
          stream: false,
        }),
      });
      const latencyMs = Math.round(performance.now() - start);
      if (!response.ok) {
        return {
          ok: false,
          rawStatus: response.status,
          latencyMs,
          error: `Ollama responded with HTTP ${response.status}. Make sure Ollama is running locally.`,
        };
      }
      const data = (await response.json()) as {
        response?: string;
        prompt_eval_count?: number;
        eval_count?: number;
      };
      return {
        ok: true,
        text: data.response || '',
        inputTokens: data.prompt_eval_count || Math.ceil(req.prompt.length / 4),
        outputTokens: data.eval_count || Math.ceil((data.response || '').length / 4),
        latencyMs,
        rawStatus: response.status,
        simulated: false,
      };
    } catch {
      return {
        ok: false,
        error:
          'Could not reach local Ollama from browser preview. Start Ollama or run inside the Zero2AI Desktop app.',
      };
    }
  }

  return {
    ok: false,
    error:
      'Live cloud API calls run via the Electron Desktop main process (to keep your API key safe from browser CORS). Switch to Practice Mode or launch the Zero2AI Desktop app!',
  };
}

export function buildProviderCallRequest(
  apiConfig: ApiConfig,
  prompt: string,
  systemPrompt?: string
): ProviderCallRequest {
  const defaultModels: Record<ApiConfig['provider'], string> = {
    openai: 'gpt-4o-mini',
    anthropic: 'claude-3-5-sonnet-latest',
    gemini: 'gemini-2.5-flash',
    ollama: 'llama3.2',
  };

  return {
    provider: apiConfig.provider,
    apiKey: apiConfig.provider === 'ollama' ? undefined : apiConfig.apiKey.trim(),
    baseUrl: apiConfig.provider === 'ollama' ? apiConfig.ollamaUrl || 'http://localhost:11434' : undefined,
    model: apiConfig.model.trim() || defaultModels[apiConfig.provider],
    systemPrompt,
    prompt,
  };
}
