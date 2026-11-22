import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  Cpu,
  FileCode2,
  FolderOpen,
  GitBranch,
  Loader2,
  Play,
  RotateCcw,
  ShieldCheck,
  Terminal,
  Wrench,
} from 'lucide-react';
import type { EnvironmentInfo, LabProps } from './types';
import { getEnvironmentInfo, runSafeCommand } from './bridge';
import { LabHeader, MissionChecklist } from './LabShared';

interface TerminalLine {
  id: number;
  kind: 'input' | 'output' | 'system' | 'error' | 'diff_add' | 'diff_del' | 'success';
  text: string;
}

interface DojoStepDef {
  step: number;
  title: string;
  plainEnglish: string;
  hintCommands: string[];
}

const DOJO_STEPS: DojoStepDef[] = [
  {
    step: 1,
    title: 'Where am I? (pwd & ls)',
    plainEnglish:
      'Think of the terminal like a file explorer without icons. Type "pwd" (Print Working Directory) to see which folder you are in, and "ls" to list what is inside.',
    hintCommands: ['pwd', 'ls'],
  },
  {
    step: 2,
    title: 'Enter your project (cd my-site)',
    plainEnglish:
      'Use "cd" (Change Directory) to step inside your website folder before starting an AI coding agent.',
    hintCommands: ['cd my-site'],
  },
  {
    step: 3,
    title: 'Start Claude Code (claude)',
    plainEnglish:
      'Now run "claude" inside your project folder. Claude Code reads your folder safely and waits for plain-English instructions!',
    hintCommands: ['claude'],
  },
  {
    step: 4,
    title: 'Ask Claude to edit & Approve Diff',
    plainEnglish:
      'Ask Claude in plain English to edit index.html. Notice how Claude NEVER silently changes files — it shows a red/green diff and waits for you to type "y" or click Approve Diff!',
    hintCommands: ['add a hero banner to index.html'],
  },
  {
    step: 5,
    title: 'Manage memory & check Git (/compact & git status)',
    plainEnglish:
      'Long coding chats fill up the AI working desk. Run "/compact" to shrink memory usage, then run "git status" to see which files changed.',
    hintCommands: ['/compact', 'git status'],
  },
  {
    step: 6,
    title: 'Undo safely (git diff / git checkout)',
    plainEnglish:
      'Never fear breaking anything! Run "git diff" to inspect changes or "git checkout -- index.html" to rewind your file back to its original state.',
    hintCommands: ['git diff', 'git checkout -- index.html'],
  },
];

const INITIAL_HTML = `<!DOCTYPE html>
<html>
  <body>
    <h1>My First Site</h1>
    <p>Hello world!</p>
  </body>
</html>`;

const UPDATED_HTML = `<!DOCTYPE html>
<html>
  <body>
    <section class="hero">
      <h1>Welcome to Zero2AI</h1>
      <p>Built with my very first CLI coding agent!</p>
      <a href="#start" class="btn">Get Started</a>
    </section>
    <p>Hello world!</p>
  </body>
</html>`;

export const ClaudeCliLab: React.FC<LabProps> = ({
  onCompleteLab,
  completedLabs,
  apiConfig,
  onOpenSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'dojo' | 'sandbox'>('dojo');

  // --- GUIDED DOJO STATE ---
  const [cwd, setCwd] = useState<string>('~/Zero2AI-Projects');
  const [inClaude, setInClaude] = useState<boolean>(false);
  const [pendingDiff, setPendingDiff] = useState<boolean>(false);
  const [indexModified, setIndexModified] = useState<boolean>(false);
  const [contextPct, setContextPct] = useState<number>(68);
  const [inputValue, setInputValue] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 1,
      kind: 'system',
      text: 'Welcome to the Guided Safe Terminal Dojo! Nothing here can harm your computer.',
    },
    {
      id: 2,
      kind: 'system',
      text: 'Start with Mission 1: type "pwd" and "ls" below (or click the quick-hint chips!).',
    },
  ]);

  // Mission tracking for Dojo (all 6 steps)
  const [didPwd, setDidPwd] = useState<boolean>(false);
  const [didLs, setDidLs] = useState<boolean>(false);
  const [didCd, setDidCd] = useState<boolean>(false);
  const [didStartClaude, setDidStartClaude] = useState<boolean>(false);
  const [didApproveDiff, setDidApproveDiff] = useState<boolean>(false);
  const [didCompact, setDidCompact] = useState<boolean>(false);
  const [didGitStatus, setDidGitStatus] = useState<boolean>(false);
  const [didUndoOrDiff, setDidUndoOrDiff] = useState<boolean>(false);

  const lineIdRef = useRef<number>(10);
  const terminalContainerRef = useRef<HTMLDivElement | null>(null);

  // --- REAL LINUX SANDBOX STATE ---
  const [envInfo, setEnvInfo] = useState<EnvironmentInfo | null>(null);
  const [sandboxCwd, setSandboxCwd] = useState<string>('~/Zero2AI-Projects');
  const [sandboxInput, setSandboxInput] = useState<string>('');
  const [sandboxBusy, setSandboxBusy] = useState<boolean>(false);
  const [sandboxLog, setSandboxLog] = useState<TerminalLine[]>([
    {
      id: 1,
      kind: 'system',
      text: 'Real Linux Safe Sandbox ready. Runs safe whitelisted commands inside ~/Zero2AI-Projects.',
    },
  ]);

  useEffect(() => {
    let active = true;
    getEnvironmentInfo().then((info) => {
      if (active) {
        setEnvInfo(info);
        if (info.defaultWorkspace) {
          setSandboxCwd(info.defaultWorkspace);
        }
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [lines]);

  const appendLines = (newEntries: Array<Omit<TerminalLine, 'id'>>) => {
    setLines((prev) => [
      ...prev,
      ...newEntries.map((entry) => {
        lineIdRef.current += 1;
        return { ...entry, id: lineIdRef.current };
      }),
    ]);
  };

  const step1Done = didPwd && didLs;
  const step2Done = didCd;
  const step3Done = didStartClaude;
  const step4Done = didApproveDiff;
  const step5Done = didCompact && didGitStatus;
  const step6Done = didUndoOrDiff;

  const currentStepNum = !step1Done
    ? 1
    : !step2Done
      ? 2
      : !step3Done
        ? 3
        : !step4Done
          ? 4
          : !step5Done
            ? 5
            : !step6Done
              ? 6
              : 6;

  const currentStepDef = DOJO_STEPS[currentStepNum - 1];

  const handleApproveDiff = (approved: boolean) => {
    if (!pendingDiff) return;
    setPendingDiff(false);
    if (approved) {
      setIndexModified(true);
      setDidApproveDiff(true);
      setContextPct(68);
      appendLines([
        { kind: 'input', text: 'Apply this change? [y/n] y' },
        {
          kind: 'success',
          text: '✔ Updated index.html! Your hero banner is live in the virtual folder preview.',
        },
        {
          kind: 'system',
          text: 'Notice Claude context is now 68% full. Try Mission 5: type "/compact" then "git status"!',
        },
      ]);
    } else {
      appendLines([
        { kind: 'input', text: 'Apply this change? [y/n] n' },
        {
          kind: 'output',
          text: 'Skipped edit. index.html was NOT changed — that is how safe human approval is! Ask again whenever ready.',
        },
      ]);
    }
  };

  const executeDojoCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    setHistory((prev) => [cmd, ...prev.slice(0, 29)]);
    setHistoryIdx(-1);
    setInputValue('');

    // Handle pending diff confirmation via keyboard
    if (pendingDiff) {
      const lower = cmd.toLowerCase();
      if (lower === 'y' || lower === 'yes') {
        handleApproveDiff(true);
        return;
      }
      if (lower === 'n' || lower === 'no') {
        handleApproveDiff(false);
        return;
      }
      appendLines([
        { kind: 'input', text: `Apply this change? [y/n] ${cmd}` },
        { kind: 'error', text: 'Please type "y" to approve or "n" to cancel the pending diff.' },
      ]);
      return;
    }

    const promptPrefix = inClaude ? 'claude> ' : `learner@zero2ai:${cwd}$ `;
    appendLines([{ kind: 'input', text: `${promptPrefix}${cmd}` }]);

    const lower = cmd.toLowerCase();

    if (lower === 'clear') {
      setLines([]);
      return;
    }

    if (lower === 'help') {
      appendLines([
        {
          kind: 'output',
          text: 'Dojo commands: pwd, ls, cd my-site, claude, add a hero banner to index.html, /compact, git status, git diff, git checkout -- index.html, cat index.html, exit, clear',
        },
      ]);
      return;
    }

    if (lower === 'pwd') {
      setDidPwd(true);
      appendLines([
        {
          kind: 'output',
          text: cwd.replace('~', '/home/learner'),
        },
      ]);
      return;
    }

    if (lower === 'ls' || lower === 'ls -la') {
      setDidLs(true);
      const listing =
        cwd === '~/Zero2AI-Projects'
          ? 'my-site/   notes.txt'
          : 'CLAUDE.md   index.html   styles.css';
      appendLines([{ kind: 'output', text: listing }]);
      return;
    }

    if (lower === 'cd my-site' || lower === 'cd my-site/') {
      setCwd('~/Zero2AI-Projects/my-site');
      setDidCd(true);
      appendLines([
        {
          kind: 'success',
          text: 'Moved into ~/Zero2AI-Projects/my-site! Next: type "claude" to launch Claude Code here.',
        },
      ]);
      return;
    }

    if (lower === 'cd ..' || lower === 'cd ~') {
      setCwd('~/Zero2AI-Projects');
      setInClaude(false);
      appendLines([{ kind: 'output', text: 'Moved back to ~/Zero2AI-Projects.' }]);
      return;
    }

    if (lower === 'cat index.html') {
      appendLines([
        {
          kind: 'output',
          text: indexModified ? UPDATED_HTML : INITIAL_HTML,
        },
      ]);
      return;
    }

    if (lower === 'claude') {
      if (cwd !== '~/Zero2AI-Projects/my-site') {
        setCwd('~/Zero2AI-Projects/my-site');
        setDidCd(true);
      }
      setInClaude(true);
      setDidStartClaude(true);
      appendLines([
        { kind: 'success', text: '╭──────────────────────────────────────────────────╮' },
        { kind: 'success', text: '│  Claude Code CLI (Safe Practice Dojo)            │' },
        { kind: 'success', text: '│  Folder: ~/Zero2AI-Projects/my-site              │' },
        { kind: 'success', text: '│  Loaded: CLAUDE.md • Tip: try /compact or exit   │' },
        { kind: 'success', text: '╰──────────────────────────────────────────────────╯' },
        {
          kind: 'system',
          text: 'Mission 4: Ask Claude to edit your page! Try: "add a hero banner to index.html"',
        },
      ]);
      return;
    }

    if (lower === 'exit' || lower === '/exit') {
      setInClaude(false);
      appendLines([{ kind: 'output', text: 'Exited Claude Code back to bash shell.' }]);
      return;
    }

    if (lower === '/compact') {
      setDidCompact(true);
      setContextPct(18);
      appendLines([
        {
          kind: 'success',
          text: '✨ Compacted conversation summary! Working desk dropped from 68% -> 18% tokens.',
        },
      ]);
      return;
    }

    if (lower === 'git status') {
      setDidGitStatus(true);
      appendLines([
        {
          kind: 'output',
          text: indexModified
            ? 'On branch main\nChanges not staged for commit:\n  modified:   index.html\n\nTip: Run "git diff" to review or "git checkout -- index.html" to undo!'
            : 'On branch main\nnothing to commit, working tree clean',
        },
      ]);
      return;
    }

    if (lower === 'git diff') {
      setDidUndoOrDiff(true);
      if (indexModified) {
        appendLines([
          { kind: 'output', text: 'diff --git a/index.html b/index.html' },
          { kind: 'diff_del', text: '-    <h1>My First Site</h1>' },
          { kind: 'diff_add', text: '+    <section class="hero">' },
          { kind: 'diff_add', text: '+      <h1>Welcome to Zero2AI</h1>' },
          { kind: 'diff_add', text: '+      <p>Built with my very first CLI coding agent!</p>' },
          { kind: 'diff_add', text: '+      <a href="#start" class="btn">Get Started</a>' },
          { kind: 'diff_add', text: '+    </section>' },
        ]);
      } else {
        appendLines([
          {
            kind: 'output',
            text: '(No uncommitted changes right now — working tree matches last Git save point!)',
          },
        ]);
      }
      return;
    }

    if (lower.startsWith('git checkout --') || lower === 'git restore index.html') {
      setDidUndoOrDiff(true);
      setIndexModified(false);
      appendLines([
        {
          kind: 'success',
          text: '↺ Rewound index.html cleanly back to the original version! That is the superpower of Git undo.',
        },
      ]);
      return;
    }

    // Natural language request to Claude inside (or even outside) claude session
    if (
      lower.includes('hero') ||
      lower.includes('banner') ||
      lower.includes('index.html') ||
      (inClaude && !lower.startsWith('git') && !lower.startsWith('/'))
    ) {
      if (!inClaude) {
        setInClaude(true);
        setDidStartClaude(true);
      }
      setPendingDiff(true);
      appendLines([
        { kind: 'output', text: 'Thinking... reading index.html and CLAUDE.md...' },
        { kind: 'output', text: 'Proposed edit to index.html:' },
        { kind: 'diff_del', text: '-    <h1>My First Site</h1>' },
        { kind: 'diff_add', text: '+    <section class="hero">' },
        { kind: 'diff_add', text: '+      <h1>Welcome to Zero2AI</h1>' },
        { kind: 'diff_add', text: '+      <p>Built with my very first CLI coding agent!</p>' },
        { kind: 'diff_add', text: '+      <a href="#start" class="btn">Get Started</a>' },
        { kind: 'diff_add', text: '+    </section>' },
        {
          kind: 'system',
          text: 'Apply this change? Type "y" (or click Approve Diff below), or "n" to cancel.',
        },
      ]);
      return;
    }

    appendLines([
      {
        kind: 'error',
        text: `Command not recognized in Dojo: "${cmd}". Click one of the hint chips below or type "help"!`,
      },
    ]);
  };

  const resetDojo = () => {
    setCwd('~/Zero2AI-Projects');
    setInClaude(false);
    setPendingDiff(false);
    setIndexModified(false);
    setContextPct(68);
    setLines([
      {
        id: Date.now(),
        kind: 'system',
        text: 'Dojo reset! Start fresh with "pwd" and "ls" below.',
      },
    ]);
  };

  // Real Sandbox Execution
  const handleRunSandbox = async (cmdToRun: string) => {
    const trimmed = cmdToRun.trim();
    if (!trimmed) return;
    setSandboxInput('');
    setSandboxBusy(true);
    setSandboxLog((prev) => [
      ...prev,
      { id: Date.now(), kind: 'input', text: `${sandboxCwd}$ ${trimmed}` },
    ]);

    const res = await runSafeCommand(trimmed, sandboxCwd);
    setSandboxBusy(false);
    if (res.cwd) setSandboxCwd(res.cwd);

    const entries: TerminalLine[] = [];
    if (res.stdout) {
      entries.push({ id: Date.now() + 1, kind: 'output', text: res.stdout });
    }
    if (res.stderr) {
      entries.push({ id: Date.now() + 2, kind: 'error', text: res.stderr });
    }
    if (!res.stdout && !res.stderr) {
      entries.push({
        id: Date.now() + 3,
        kind: 'system',
        text: `(Completed with exit code ${res.exitCode})`,
      });
    }
    setSandboxLog((prev) => [...prev, ...entries]);
  };

  const missionSteps = [
    { id: 's1', label: '1. Run "pwd" and "ls" to see where you are', done: step1Done },
    { id: 's2', label: '2. Step inside your project with "cd my-site"', done: step2Done },
    { id: 's3', label: '3. Start Claude Code with "claude"', done: step3Done },
    { id: 's4', label: '4. Ask Claude to add a hero banner & approve the diff', done: step4Done },
    { id: 's5', label: '5. Run "/compact" and "git status"', done: step5Done },
    { id: 's6', label: '6. Inspect or undo safely ("git diff" / "git checkout -- index.html")', done: step6Done },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <LabHeader
        badge="Lab 4 • CLI & Terminal"
        title="Claude Code CLI & Friendly Terminal Dojo"
        subtitle="Never touched a command line before? Practice real terminal & Claude Code workflows safely with zero risk of breaking anything."
        xpReward={90}
        isCompleted={completedLabs.includes('claude-cli')}
        apiConfig={apiConfig}
        onOpenSettings={onOpenSettings}
        accent="teal"
        icon={<Terminal className="h-6 w-6" />}
      />

      <MissionChecklist
        labId="claude-cli"
        xpReward={90}
        steps={missionSteps}
        completedLabs={completedLabs}
        onCompleteLab={onCompleteLab}
        title="6-Step Terminal & Claude Code Missions"
      />

      {/* TAB SWITCHER */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('dojo')}
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
            activeTab === 'dojo'
              ? 'border-teal-500 bg-teal-600 text-white shadow-sm'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          Guided Safe Terminal Dojo (Zero Setup)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sandbox')}
          className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
            activeTab === 'sandbox'
              ? 'border-teal-500 bg-teal-600 text-white shadow-sm'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'
          }`}
        >
          <Wrench className="h-4 w-4" />
          Real Linux Terminal Sandbox
        </button>
      </div>

      {activeTab === 'dojo' ? (
        <div className="grid gap-5 lg:grid-cols-12">
          {/* LEFT: CURRENT GUIDE + TERMINAL */}
          <div className="space-y-4 lg:col-span-8">
            {/* Plain-English Mission Coach Card */}
            <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-4 dark:border-teal-900/60 dark:bg-teal-950/30">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-600 px-2.5 py-0.5 text-[11px] font-bold text-white">
                  Current Step {currentStepDef.step} of 6
                </span>
                <button
                  type="button"
                  onClick={resetDojo}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-teal-800 hover:bg-teal-100 dark:text-teal-200 dark:hover:bg-teal-900/50"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Restart Session
                </button>
              </div>
              <h3 className="mt-2 text-base font-bold text-teal-950 dark:text-teal-100">
                {currentStepDef.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-teal-900/90 dark:text-teal-200/90">
                {currentStepDef.plainEnglish}
              </p>
            </div>

            {/* Interactive Terminal Window */}
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-lg">
              {/* Terminal Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 font-mono text-xs text-slate-400">
                    {inClaude ? 'claude-code — my-site' : `bash — ${cwd}`}
                  </span>
                </div>
                <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-teal-300">
                  Desk Memory: {contextPct}%
                </span>
              </div>

              {/* Terminal Output */}
              <div
                ref={terminalContainerRef}
                className="h-72 overflow-y-auto p-4 font-mono text-xs leading-relaxed"
              >
                {lines.map((line) => {
                  const colorMap: Record<TerminalLine['kind'], string> = {
                    input: 'text-white font-semibold',
                    output: 'text-slate-300',
                    system: 'text-sky-300',
                    error: 'text-rose-400',
                    diff_del: 'bg-rose-950/80 text-rose-300 px-2 py-0.5 rounded block my-0.5',
                    diff_add: 'bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded block my-0.5',
                    success: 'text-emerald-400',
                  };
                  return (
                    <pre
                      key={line.id}
                      className={`whitespace-pre-wrap break-words ${colorMap[line.kind]}`}
                    >
                      {line.text}
                    </pre>
                  );
                })}
              </div>

              {/* Approve / Cancel Diff Inline Action Bar */}
              {pendingDiff && (
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-amber-700/60 bg-amber-950/60 px-4 py-2.5">
                  <span className="text-xs font-semibold text-amber-200">
                    Review the red/green diff above. Apply edit to index.html?
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleApproveDiff(true)}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approve Diff (y)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApproveDiff(false)}
                      className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                    >
                      Reject (n)
                    </button>
                  </div>
                </div>
              )}

              {/* Command Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  executeDojoCommand(inputValue);
                }}
                className="flex items-center gap-2 border-t border-slate-800 bg-slate-900/90 px-4 py-3"
              >
                <span className="shrink-0 font-mono text-xs font-bold text-teal-400">
                  {pendingDiff ? '[y/n]>' : inClaude ? 'claude>' : `${cwd}$`}
                </span>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp' && history.length > 0) {
                      e.preventDefault();
                      const nextIdx = Math.min(history.length - 1, historyIdx + 1);
                      setHistoryIdx(nextIdx);
                      setInputValue(history[nextIdx]);
                    } else if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      if (historyIdx <= 0) {
                        setHistoryIdx(-1);
                        setInputValue('');
                      } else {
                        const nextIdx = historyIdx - 1;
                        setHistoryIdx(nextIdx);
                        setInputValue(history[nextIdx]);
                      }
                    }
                  }}
                  placeholder={
                    pendingDiff
                      ? 'Type y to approve diff or n to reject...'
                      : 'Type a command or click a quick-hint chip below...'
                  }
                  className="w-full bg-transparent font-mono text-xs text-white outline-none placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 rounded-lg bg-teal-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-teal-400"
                >
                  Run
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>

            {/* Clickable Quick-Hint Chips */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Clickable Quick-Hint Chips (Click any chip to run it instantly!):
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {pendingDiff ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleApproveDiff(true)}
                      className="rounded-xl border border-emerald-400 bg-emerald-50 px-3 py-1.5 font-mono text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200"
                    >
                      y (Approve Diff)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApproveDiff(false)}
                      className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 font-mono text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      n (Reject Diff)
                    </button>
                  </>
                ) : (
                  [
                    ...currentStepDef.hintCommands,
                    'pwd',
                    'ls',
                    'cd my-site',
                    'claude',
                    'add a hero banner to index.html',
                    '/compact',
                    'git status',
                    'git diff',
                    'git checkout -- index.html',
                  ]
                    .filter((cmd, idx, arr) => arr.indexOf(cmd) === idx)
                    .map((chip) => {
                      const isRecommended = currentStepDef.hintCommands.includes(chip);
                      return (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => executeDojoCommand(chip)}
                          className={`rounded-xl border px-3 py-1.5 font-mono text-xs transition ${
                            isRecommended
                              ? 'border-teal-400 bg-teal-50 font-bold text-teal-900 shadow-sm hover:bg-teal-100 dark:border-teal-700 dark:bg-teal-950/70 dark:text-teal-200'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {chip}
                        </button>
                      );
                    })
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: LIVE VIRTUAL FOLDER & FILE PREVIEW */}
          <div className="space-y-4 lg:col-span-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <FolderOpen className="h-4 w-4 text-teal-500" />
                Live Virtual Folder Map
              </div>
              <div className="mt-3 space-y-1.5 font-mono text-xs">
                <div
                  className={`rounded-lg px-2.5 py-1.5 ${
                    cwd === '~/Zero2AI-Projects'
                      ? 'bg-teal-50 font-bold text-teal-900 dark:bg-teal-950/60 dark:text-teal-200'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  📁 ~/Zero2AI-Projects {cwd === '~/Zero2AI-Projects' ? '← You are here' : ''}
                </div>
                <div
                  className={`ml-4 rounded-lg px-2.5 py-1.5 ${
                    cwd === '~/Zero2AI-Projects/my-site'
                      ? 'bg-teal-50 font-bold text-teal-900 dark:bg-teal-950/60 dark:text-teal-200'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  📁 my-site/ {cwd === '~/Zero2AI-Projects/my-site' ? '← You are here' : ''}
                </div>
                <div className="ml-8 flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
                  <span>📄 index.html</span>
                  {indexModified && (
                    <span className="rounded bg-amber-200 px-1.5 py-0.5 text-[10px] font-bold text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                      MODIFIED
                    </span>
                  )}
                </div>
                <div className="ml-8 rounded-lg px-2.5 py-1 text-slate-500 dark:text-slate-400">
                  📄 styles.css
                </div>
                <div className="ml-8 rounded-lg px-2.5 py-1 text-slate-500 dark:text-slate-400">
                  📄 CLAUDE.md
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <FileCode2 className="h-4 w-4 text-blue-500" />
                  Live index.html
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <GitBranch className="h-3 w-3" />
                  {indexModified ? '1 edit' : 'clean'}
                </span>
              </div>
              <pre className="mt-2.5 overflow-x-auto rounded-xl bg-slate-950 p-3 font-mono text-[11px] leading-relaxed text-emerald-300">
                {indexModified ? UPDATED_HTML : INITIAL_HTML}
              </pre>
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: REAL LINUX TERMINAL SANDBOX */
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Your Computer&apos;s AI Builder Readiness Check
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Workspace: <code className="font-mono">{envInfo?.defaultWorkspace || '~/Zero2AI-Projects'}</code> • Platform:{' '}
                  <code className="font-mono">{envInfo?.platform || 'detecting...'}</code>
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {envInfo?.isDesktopApp ? 'Connected to Linux Desktop Bridge' : 'Browser Preview Fallback Mode'}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(['node', 'git', 'claude', 'ollama'] as const).map((tool) => {
                const installed = envInfo?.installedTools[tool] ?? false;
                return (
                  <div
                    key={tool}
                    className={`rounded-xl border p-3 ${
                      installed
                        ? 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/60 dark:bg-emerald-950/30'
                        : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold uppercase text-slate-900 dark:text-white">
                        {tool}
                      </span>
                      <Cpu
                        className={`h-4 w-4 ${
                          installed ? 'text-emerald-500' : 'text-slate-400'
                        }`}
                      />
                    </div>
                    <div
                      className={`mt-1 text-xs font-semibold ${
                        installed
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {installed ? 'Installed ✓' : 'Not detected'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-slate-300">
              <span className="font-mono">Safe Sandbox — {sandboxCwd}</span>
              <span className="text-[11px] text-amber-300">
                Destructive commands (sudo, rm -rf) are blocked automatically
              </span>
            </div>

            <div className="h-64 overflow-y-auto p-4 font-mono text-xs leading-relaxed">
              {sandboxLog.map((entry) => (
                <pre
                  key={entry.id}
                  className={`whitespace-pre-wrap break-words ${
                    entry.kind === 'input'
                      ? 'font-bold text-white'
                      : entry.kind === 'error'
                        ? 'text-rose-400'
                        : entry.kind === 'system'
                          ? 'text-sky-300'
                          : 'text-emerald-300'
                  }`}
                >
                  {entry.text}
                </pre>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRunSandbox(sandboxInput);
              }}
              className="flex items-center gap-2 border-t border-slate-800 bg-slate-900 px-4 py-3"
            >
              <span className="font-mono text-xs font-bold text-teal-400">$</span>
              <input
                type="text"
                value={sandboxInput}
                onChange={(e) => setSandboxInput(e.target.value)}
                placeholder="Try: pwd, ls -la, node -v, git --version..."
                className="w-full bg-transparent font-mono text-xs text-white outline-none placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={sandboxBusy}
                className="inline-flex items-center gap-1 rounded-lg bg-teal-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-teal-400 disabled:opacity-60"
              >
                {sandboxBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
                Run
              </button>
            </form>
          </div>

          <div className="flex flex-wrap gap-2">
            {['pwd', 'ls -la', 'node -v', 'git --version', 'claude --version', 'mkdir -p hello-ai'].map(
              (cmd) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => handleRunSandbox(cmd)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs font-semibold text-slate-700 hover:border-teal-400 hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  {cmd}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};
