import React, { useEffect, useRef, useState } from 'react';
import {
  Bot,
  Car,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Cpu,
  FileEdit,
  FileSearch,
  Globe,
  Play,
  RotateCcw,
  ShieldCheck,
  Terminal,
  Wrench,
  XCircle,
} from 'lucide-react';
import type { LabProps } from './types';
import { LabHeader, MissionChecklist } from './LabShared';

interface HarnessCapabilities {
  systemPrompt: boolean;
  readFiles: boolean;
  editFiles: boolean;
  runTests: boolean;
  webSearch: boolean;
}

interface MissionConfig {
  id: 'signup-bug' | 'dark-mode' | 'sales-csv';
  title: string;
  userPrompt: string;
  targetFile: string;
  rawModelReply: string;
  claudeMdRule: string;
  fileSnippet: string;
  editPayload: { path: string; before: string; after: string };
  testCommand: string;
  testOutput: string;
  searchQuery: string;
  searchSummary: string;
  finalSuccess: string;
}

const MISSIONS: MissionConfig[] = [
  {
    id: 'signup-bug',
    title: 'Fix the broken signup button',
    userPrompt: 'Users say clicking "Create Account" on the signup page does nothing. Please fix it!',
    targetFile: 'src/SignupForm.tsx',
    rawModelReply:
      'I cannot see or edit your project files directly! Here are general steps you can try yourself:\n1. Open your signup form file in an editor.\n2. Check if the button has an onClick handler or type="submit".\n3. Make sure your form calls handleSubmit(event).\n4. Re-run your tests manually to see if that worked.',
    claudeMdRule:
      'Project Rule (CLAUDE.md): Always read the file first, make minimal surgical edits, and run npm test before declaring done.',
    fileSnippet:
      '10: export function SignupForm({ onSignup }) {\n11:   return (\n12:     <form>\n13:       <button type="button" onClick={() => {}}>Create Account</button>\n14:     </form>\n15:   );\n16: }',
    editPayload: {
      path: 'src/SignupForm.tsx',
      before: '<button type="button" onClick={() => {}}>Create Account</button>',
      after: '<button type="submit" onClick={onSignup}>Create Account</button>',
    },
    testCommand: 'npm test -- SignupForm.test.tsx',
    testOutput: 'PASS src/SignupForm.test.tsx (3/3 tests passed in 0.42s)',
    searchQuery: 'React form submit button accessibility best practices',
    searchSummary: 'MDN Docs: Use type="submit" inside <form> so Enter key and click both submit cleanly.',
    finalSuccess:
      'Fixed! Line 13 had an empty onClick={() => {}} placeholder. Updated it to trigger onSignup with type="submit" and verified all 3 unit tests pass.',
  },
  {
    id: 'dark-mode',
    title: 'Add dark mode to homepage',
    userPrompt: 'Add a clean dark mode toggle to our homepage and make sure text stays easy to read.',
    targetFile: 'styles.css',
    rawModelReply:
      'Since I am only a raw text model without file tools, copy-paste this example CSS into your stylesheet and wire up a button yourself:\n\nbody.dark { background: #111; color: #fff; }\n\n(Note: I guessed your class names because I cannot inspect your actual HTML or CSS.)',
    claudeMdRule:
      'Project Rule (CLAUDE.md): Use CSS custom properties (--bg, --text) and keep WCAG AA text contrast.',
    fileSnippet:
      '1: :root { --bg: #ffffff; --text: #0f172a; }\n2: body { background: var(--bg); color: var(--text); }',
    editPayload: {
      path: 'styles.css',
      before: ':root { --bg: #ffffff; --text: #0f172a; }',
      after: ':root { --bg: #ffffff; --text: #0f172a; }\n[data-theme="dark"] { --bg: #0b1120; --text: #f8fafc; }',
    },
    testCommand: 'npm run test:contrast',
    testOutput: 'PASS Contrast Check: Light 16.4:1 (AAA), Dark 17.8:1 (AAA)',
    searchQuery: 'WCAG AA dark mode color contrast guidelines',
    searchSummary: 'W3C Guide: Aim for at least 4.5:1 contrast ratio for body text; avoid pure #000/#fff glare.',
    finalSuccess:
      'Added [data-theme="dark"] CSS variables to styles.css, preserved your light palette, and verified AAA contrast checks pass!',
  },
  {
    id: 'sales-csv',
    title: 'Summarize sales CSV',
    userPrompt: 'Read data/march-sales.csv, find our top product, and save a summary in report.md.',
    targetFile: 'data/march-sales.csv',
    rawModelReply:
      'I cannot open local files on your computer! Please open data/march-sales.csv, copy all the rows, paste them into this chat window, and then copy my reply into a new report.md file yourself.',
    claudeMdRule:
      'Project Rule (CLAUDE.md): Format currency with two decimal places and double-check totals with a script.',
    fileSnippet:
      'product,units,revenue\nCold Brew Pack,142,1704.00\nMatcha Tin,89,1602.00\nOat Latte Box,64,768.00',
    editPayload: {
      path: 'report.md',
      before: '(new file)',
      after: '# March Sales Summary\n- Total Revenue: $4,074.00\n- Top Product: Cold Brew Pack (142 units, $1,704.00)',
    },
    testCommand: 'node scripts/verify-report.mjs',
    testOutput: 'PASS report.md totals match CSV sum ($4,074.00)',
    searchQuery: 'Markdown table formatting best practices',
    searchSummary: 'Clean Markdown summary lists work well in Notion, GitHub, and email.',
    finalSuccess:
      'Analyzed data/march-sales.csv, wrote report.md with verified totals ($4,074.00; Top seller: Cold Brew Pack), and confirmed numbers with verify-report.mjs!',
  },
];

interface TraceStep {
  id: string;
  phase: 'system' | 'think' | 'tool_call' | 'tool_output' | 'warning' | 'done';
  title: string;
  summary: string;
  jsonPayload?: Record<string, unknown>;
  requiresApproval?: boolean;
}

function buildAgentTrace(
  mission: MissionConfig,
  caps: HarnessCapabilities
): TraceStep[] {
  const steps: TraceStep[] = [];

  if (caps.systemPrompt) {
    steps.push({
      id: 'sys',
      phase: 'system',
      title: 'Load System Prompt (CLAUDE.md)',
      summary: mission.claudeMdRule,
      jsonPayload: {
        role: 'system',
        source: 'CLAUDE.md',
        instructions: mission.claudeMdRule,
      },
    });
  } else {
    steps.push({
      id: 'no-sys',
      phase: 'warning',
      title: 'No System Prompt Loaded',
      summary: 'Running without CLAUDE.md project guidelines — agent will improvise conventions.',
    });
  }

  steps.push({
    id: 'think-1',
    phase: 'think',
    title: 'Agent Thinks & Plans',
    summary: caps.readFiles
      ? `Goal: "${mission.title}". First, I should inspect ${mission.targetFile} so I don't guess.`
      : `Goal: "${mission.title}". Uh oh — Read Files tool is turned OFF! I will have to guess what's in ${mission.targetFile}.`,
  });

  if (caps.readFiles) {
    steps.push({
      id: 'call-read',
      phase: 'tool_call',
      title: `Call Tool: read_file("${mission.targetFile}")`,
      summary: 'Harness executes the file read safely inside the project folder.',
      jsonPayload: {
        tool: 'read_file',
        arguments: { path: mission.targetFile },
      },
    });
    steps.push({
      id: 'obs-read',
      phase: 'tool_output',
      title: `Observed File Contents (${mission.targetFile})`,
      summary: mission.fileSnippet,
    });
  }

  if (caps.webSearch) {
    steps.push({
      id: 'call-web',
      phase: 'tool_call',
      title: 'Call Tool: web_search(...)',
      summary: `Checking up-to-date docs: "${mission.searchQuery}"`,
      jsonPayload: {
        tool: 'web_search',
        arguments: { query: mission.searchQuery },
      },
    });
    steps.push({
      id: 'obs-web',
      phase: 'tool_output',
      title: 'Observed Web Docs',
      summary: mission.searchSummary,
    });
  }

  if (caps.editFiles) {
    steps.push({
      id: 'call-edit',
      phase: 'tool_call',
      title: `Call Tool: edit_file("${mission.editPayload.path}")`,
      summary: 'Ready to apply a targeted patch directly to disk.',
      requiresApproval: true,
      jsonPayload: {
        tool: 'edit_file',
        arguments: {
          path: mission.editPayload.path,
          replace: mission.editPayload.before,
          with: mission.editPayload.after,
        },
      },
    });
    steps.push({
      id: 'obs-edit',
      phase: 'tool_output',
      title: `File Updated (${mission.editPayload.path})`,
      summary: `Applied clean diff to ${mission.editPayload.path} (+1 change).`,
    });
  } else {
    steps.push({
      id: 'no-edit',
      phase: 'warning',
      title: 'Edit Files Tool Disabled',
      summary:
        'Because Edit Files is turned OFF, the agent cannot save changes — it can only print suggested instructions for you to copy-paste.',
    });
  }

  if (caps.runTests && caps.editFiles) {
    steps.push({
      id: 'call-test',
      phase: 'tool_call',
      title: `Call Tool: run_tests("${mission.testCommand}")`,
      summary: 'Verifying the fix automatically in the terminal!',
      requiresApproval: true,
      jsonPayload: {
        tool: 'run_terminal',
        arguments: { command: mission.testCommand },
      },
    });
    steps.push({
      id: 'obs-test',
      phase: 'tool_output',
      title: 'Tests Passed!',
      summary: mission.testOutput,
    });
  } else if (!caps.runTests) {
    steps.push({
      id: 'no-tests',
      phase: 'warning',
      title: 'Terminal Tests Disabled',
      summary:
        'Without Run Terminal Tests, the agent cannot verify whether its edit actually works!',
    });
  }

  steps.push({
    id: 'done',
    phase: 'done',
    title: 'Agent Loop Complete',
    summary:
      caps.readFiles && caps.editFiles && caps.runTests
        ? mission.finalSuccess
        : caps.editFiles
          ? `Edited ${mission.editPayload.path}, though some harness tools were disabled (${[
              !caps.readFiles && 'Read Files',
              !caps.runTests && 'Run Tests',
            ]
              .filter(Boolean)
              .join(', ')}).`
          : 'Diagnosed the issue, but could not modify files because Edit Files was turned off.',
  });

  return steps;
}

export const HarnessAgentLab: React.FC<LabProps> = ({
  onCompleteLab,
  completedLabs,
  apiConfig,
  onOpenSettings,
}) => {
  const [missionId, setMissionId] = useState<MissionConfig['id']>('signup-bug');
  const [caps, setCaps] = useState<HarnessCapabilities>({
    systemPrompt: true,
    readFiles: true,
    editFiles: true,
    runTests: true,
    webSearch: false,
  });
  const [requireApproval, setRequireApproval] = useState<boolean>(true);

  const [runMode, setRunMode] = useState<'idle' | 'raw' | 'agent'>('idle');
  const [visibleSteps, setVisibleSteps] = useState<TraceStep[]>([]);
  const [pendingQueue, setPendingQueue] = useState<TraceStep[]>([]);
  const [awaitingApproval, setAwaitingApproval] = useState<TraceStep | null>(null);
  const [rejectedStep, setRejectedStep] = useState<string | null>(null);
  const [expandedJson, setExpandedJson] = useState<Record<string, boolean>>({});
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Mission completion states
  const [ranRaw, setRanRaw] = useState<boolean>(false);
  const [ranAgentWithDecision, setRanAgentWithDecision] = useState<boolean>(false);
  const [toggledCapability, setToggledCapability] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  const mission = MISSIONS.find((m) => m.id === missionId) || MISSIONS[0];

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const advanceQueue = (queue: TraceStep[], approvalGateOn: boolean) => {
    clearTimer();
    if (queue.length === 0) {
      setIsRunning(false);
      return;
    }

    const [next, ...rest] = queue;
    if (next.requiresApproval && approvalGateOn) {
      setVisibleSteps((prev) => [...prev, next]);
      setPendingQueue(rest);
      setAwaitingApproval(next);
      setIsRunning(false);
      return;
    }

    setVisibleSteps((prev) => [...prev, next]);
    setPendingQueue(rest);

    if (rest.length === 0) {
      setIsRunning(false);
      setRanAgentWithDecision(true);
      return;
    }

    timerRef.current = window.setTimeout(() => {
      advanceQueue(rest, approvalGateOn);
    }, 520);
  };

  const handleRunRaw = () => {
    clearTimer();
    setRunMode('raw');
    setAwaitingApproval(null);
    setRejectedStep(null);
    setPendingQueue([]);
    setIsRunning(false);
    setVisibleSteps([
      {
        id: 'raw-reply',
        phase: 'warning',
        title: 'Raw Model Output (Text Only — No Tools)',
        summary: mission.rawModelReply,
      },
    ]);
    setRanRaw(true);
  };

  const handleRunAgent = () => {
    clearTimer();
    const trace = buildAgentTrace(mission, caps);
    setRunMode('agent');
    setVisibleSteps([]);
    setAwaitingApproval(null);
    setRejectedStep(null);
    setIsRunning(true);
    setPendingQueue(trace);

    timerRef.current = window.setTimeout(() => {
      advanceQueue(trace, requireApproval);
    }, 220);
  };

  const handleApprove = () => {
    if (!awaitingApproval) return;
    setAwaitingApproval(null);
    setRanAgentWithDecision(true);
    setIsRunning(true);
    timerRef.current = window.setTimeout(() => {
      advanceQueue(pendingQueue, requireApproval);
    }, 280);
  };

  const handleReject = () => {
    if (!awaitingApproval) return;
    const rejectedName = awaitingApproval.title;
    setAwaitingApproval(null);
    setPendingQueue([]);
    setRejectedStep(rejectedName);
    setRanAgentWithDecision(true);
    setVisibleSteps((prev) => [
      ...prev,
      {
        id: 'human-rejected',
        phase: 'warning',
        title: 'Stopped by Human Safety Gate',
        summary: `You rejected "${rejectedName}". No file or terminal command was executed — you are always in the driver's seat!`,
      },
    ]);
  };

  const toggleCap = (key: keyof HarnessCapabilities) => {
    setCaps((prev) => ({ ...prev, [key]: !prev[key] }));
    setToggledCapability(true);
  };

  const missionSteps = [
    {
      id: 'run-raw',
      label: 'Click "Run Raw Model (No Harness)" to see what text-only AI can do',
      done: ranRaw,
    },
    {
      id: 'run-agent',
      label: 'Click "Run Agent (Model + Harness)" & approve (or reject) a tool call',
      done: ranAgentWithDecision,
    },
    {
      id: 'toggle-cap',
      label: 'Toggle a Harness Capability switch ON or OFF to see how the loop adapts',
      done: toggledCapability,
    },
  ];

  const capabilityList: Array<{
    key: keyof HarnessCapabilities;
    label: string;
    desc: string;
    icon: React.ReactNode;
  }> = [
    {
      key: 'systemPrompt',
      label: 'System Prompt (CLAUDE.md)',
      desc: 'Project rules & coding style',
      icon: <ShieldCheck className="h-4 w-4" />,
    },
    {
      key: 'readFiles',
      label: 'Read Files',
      desc: 'Inspect real project files',
      icon: <FileSearch className="h-4 w-4" />,
    },
    {
      key: 'editFiles',
      label: 'Edit Files',
      desc: 'Apply exact code patches',
      icon: <FileEdit className="h-4 w-4" />,
    },
    {
      key: 'runTests',
      label: 'Run Terminal Tests',
      desc: 'Verify fixes automatically',
      icon: <Terminal className="h-4 w-4" />,
    },
    {
      key: 'webSearch',
      label: 'Web Search',
      desc: 'Check latest official docs',
      icon: <Globe className="h-4 w-4" />,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <LabHeader
        badge="Lab 3 • Agents & Tools"
        title="Model vs Harness & Agent Loop Simulator"
        subtitle="Discover why an AI model alone is just an engine on a stand — and how a Harness turns it into a drivable car with tools and brakes."
        xpReward={80}
        isCompleted={completedLabs.includes('harness-agent')}
        apiConfig={apiConfig}
        onOpenSettings={onOpenSettings}
        accent="violet"
        icon={<Bot className="h-6 w-6" />}
      />

      <MissionChecklist
        labId="harness-agent"
        xpReward={80}
        steps={missionSteps}
        completedLabs={completedLabs}
        onCompleteLab={onCompleteLab}
      />

      {/* ENGINE VS CAR ANALOGY STRIP */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Raw AI Model = The Engine
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Amazing at predicting smart text, but has zero hands. It cannot open folders, edit code, or click buttons.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-violet-200 bg-violet-50/60 p-4 shadow-sm dark:border-violet-900/60 dark:bg-violet-950/30">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-violet-950 dark:text-violet-100">
                AI Harness + Model = The Whole Car (Agent)
              </h2>
              <p className="text-xs text-violet-900/80 dark:text-violet-200/80">
                Tools like Claude Code or Cursor wrap the model with steering (system rules), wheels (file & terminal tools), and brakes (your approval!).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN SIMULATOR */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT: MISSION & HARNESS CONTROLS */}
        <div className="space-y-5 lg:col-span-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              1. Pick a Realistic Mission
            </h3>
            <div className="mt-3 space-y-2">
              {MISSIONS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    clearTimer();
                    setMissionId(m.id);
                    setRunMode('idle');
                    setVisibleSteps([]);
                    setAwaitingApproval(null);
                    setRejectedStep(null);
                  }}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    missionId === m.id
                      ? 'border-violet-500 bg-violet-50 dark:border-violet-400 dark:bg-violet-950/50'
                      : 'border-slate-200 bg-slate-50/70 hover:border-violet-300 dark:border-slate-700 dark:bg-slate-800/50'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {m.title}
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-300">
                    &quot;{m.userPrompt}&quot;
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                2. Configure Harness Tools
              </h3>
              <Wrench className="h-4 w-4 text-violet-500" />
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Switch tools on/off to see how each harness capability changes what the agent can do.
            </p>

            <div className="mt-3 space-y-2">
              {capabilityList.map((item) => {
                const enabled = caps[item.key];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleCap(item.key)}
                    className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left transition ${
                      enabled
                        ? 'border-violet-300 bg-violet-50/70 text-violet-950 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-100'
                        : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={
                          enabled
                            ? 'text-violet-600 dark:text-violet-400'
                            : 'text-slate-400'
                        }
                      >
                        {item.icon}
                      </span>
                      <div>
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className="text-[11px] opacity-80">{item.desc}</div>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        enabled
                          ? 'bg-violet-600 text-white'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {enabled ? 'ON' : 'OFF'}
                    </span>
                  </button>
                );
              })}
            </div>

            <label className="mt-3 flex cursor-pointer items-center justify-between rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2.5 text-xs dark:border-amber-900/60 dark:bg-amber-950/40">
              <div>
                <div className="font-bold text-amber-950 dark:text-amber-100">
                  Human-in-the-Loop Approval Gate
                </div>
                <div className="text-[11px] text-amber-800 dark:text-amber-300">
                  Pause & ask permission before editing files or running tests
                </div>
              </div>
              <input
                type="checkbox"
                checked={requireApproval}
                onChange={(e) => setRequireApproval(e.target.checked)}
                className="h-4 w-4 accent-amber-600"
              />
            </label>
          </div>
        </div>

        {/* RIGHT: LIVE EXECUTION STAGE */}
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleRunRaw}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-800 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                <Play className="h-3.5 w-3.5" />
                Run Raw Model (No Harness)
              </button>
              <button
                type="button"
                onClick={handleRunAgent}
                className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-violet-500"
              >
                <Bot className="h-4 w-4" />
                Run Agent (Model + Harness)
              </button>
            </div>

            {runMode !== 'idle' && (
              <button
                type="button"
                onClick={() => {
                  clearTimer();
                  setRunMode('idle');
                  setVisibleSteps([]);
                  setAwaitingApproval(null);
                  setRejectedStep(null);
                  setIsRunning(false);
                }}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            )}
          </div>

          {/* Execution Trace */}
          <div className="mt-4 flex-1 space-y-3">
            {runMode === 'idle' && (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-6 text-center dark:border-slate-700 dark:bg-slate-950/50">
                <Bot className="h-10 w-10 text-violet-500 opacity-80" />
                <div className="mt-3 text-sm font-bold text-slate-800 dark:text-slate-100">
                  Ready to run: &quot;{mission.title}&quot;
                </div>
                <p className="mt-1 max-w-md text-xs text-slate-500 dark:text-slate-400">
                  First click <strong>Run Raw Model (No Harness)</strong> to see a plain chat reply, then click <strong>Run Agent (Model + Harness)</strong> to watch the Think → Tool Call → Observe → Approve loop in action!
                </p>
              </div>
            )}

            {visibleSteps.map((step) => {
              const badgeStyles: Record<TraceStep['phase'], string> = {
                system: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200',
                think: 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200',
                tool_call: 'bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-200',
                tool_output: 'bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-200',
                warning: 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200',
                done: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200',
              };
              const isExpanded = Boolean(expandedJson[step.id]);

              return (
                <div
                  key={step.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-950/60"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badgeStyles[step.phase]}`}
                      >
                        {step.phase.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {step.title}
                      </span>
                    </div>

                    {step.jsonPayload && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedJson((prev) => ({ ...prev, [step.id]: !prev[step.id] }))
                        }
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-200/70 px-2 py-0.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                        Inspect JSON
                      </button>
                    )}
                  </div>

                  <pre className="mt-2 whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    {step.summary}
                  </pre>

                  {step.jsonPayload && isExpanded && (
                    <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-[11px] text-emerald-300">
                      {JSON.stringify(step.jsonPayload, null, 2)}
                    </pre>
                  )}
                </div>
              );
            })}

            {/* HUMAN APPROVAL GATE */}
            {awaitingApproval && (
              <div className="rounded-xl border-2 border-amber-400 bg-amber-50 p-4 shadow-sm dark:border-amber-500/80 dark:bg-amber-950/60">
                <div className="text-xs font-extrabold uppercase tracking-wide text-amber-800 dark:text-amber-300">
                  ✋ Human-in-the-Loop Approval Required
                </div>
                <p className="mt-1 text-xs text-amber-950 dark:text-amber-100">
                  The agent wants to execute <strong>{awaitingApproval.title}</strong>. Review its JSON payload above and decide:
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve Tool Call
                  </button>
                  <button
                    type="button"
                    onClick={handleReject}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-rose-300 bg-white px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:bg-slate-900 dark:text-rose-300"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject & Stop
                  </button>
                </div>
              </div>
            )}

            {isRunning && (
              <div className="rounded-xl border border-violet-200 bg-violet-50/50 px-3.5 py-2.5 text-xs font-semibold text-violet-700 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-300">
                Agent harness is running the next step...
              </div>
            )}
          </div>

          {/* Comparison Scorecard */}
          {ranRaw && ranAgentWithDecision && !rejectedStep && (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs dark:border-emerald-900/60 dark:bg-emerald-950/30">
              <div className="font-bold text-emerald-900 dark:text-emerald-200">
                Key Takeaway: Same AI Brain, Completely Different Superpowers!
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-lg bg-white/80 p-2 dark:bg-slate-900/80">
                  <div className="font-bold text-slate-700 dark:text-slate-200">Raw Model</div>
                  <div className="text-slate-500 dark:text-slate-400">
                    Can only give advice. You do every file edit & test manually.
                  </div>
                </div>
                <div className="rounded-lg bg-white/80 p-2 dark:bg-slate-900/80">
                  <div className="font-bold text-emerald-700 dark:text-emerald-300">Model + Harness</div>
                  <div className="text-slate-600 dark:text-slate-300">
                    Reads real files, proposes exact diffs, asks your approval, and runs tests!
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
