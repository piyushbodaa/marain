import React, { useMemo, useState } from 'react';
import {
  Calculator,
  CheckCircle2,
  Coins,
  CreditCard,
  KeyRound,
  Loader2,
  Play,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import type { LabProps } from './types';
import { buildProviderCallRequest, isByokReady, testProviderCall } from './bridge';
import { LabHeader, MissionChecklist } from './LabShared';

interface PricingModel {
  id: string;
  name: string;
  providerLabel: string;
  inputPerMillion: number;
  outputPerMillion: number;
  badge: string;
  summary: string;
}

const PRICING_MODELS: PricingModel[] = [
  {
    id: 'gemini-flash',
    name: 'Gemini 2.5 Flash',
    providerLabel: 'Google',
    inputPerMillion: 0.15,
    outputPerMillion: 0.6,
    badge: 'Super Cheap & Fast',
    summary: 'Pennies for thousands of chats — ideal for learning & apps.',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    providerLabel: 'OpenAI',
    inputPerMillion: 0.15,
    outputPerMillion: 0.6,
    badge: 'Everyday Value',
    summary: 'Great everyday utility model at tiny per-token prices.',
  },
  {
    id: 'claude-sonnet',
    name: 'Claude Sonnet',
    providerLabel: 'Anthropic',
    inputPerMillion: 3.0,
    outputPerMillion: 15.0,
    badge: 'Builder Favorite',
    summary: 'Top choice for coding, websites, and Claude Code CLI.',
  },
  {
    id: 'claude-opus',
    name: 'Claude Opus',
    providerLabel: 'Anthropic',
    inputPerMillion: 15.0,
    outputPerMillion: 75.0,
    badge: 'Heavy Pro Model',
    summary: 'Deepest reasoning, noticeably higher cost per token.',
  },
  {
    id: 'ollama-free',
    name: 'Local Ollama (Llama 3)',
    providerLabel: 'Your PC',
    inputPerMillion: 0,
    outputPerMillion: 0,
    badge: '$0 Free Forever',
    summary: 'Runs offline on your own computer — zero API credit bill!',
  },
];

interface SecurityScenario {
  id: string;
  title: string;
  snippet: string;
  isSafe: boolean;
  explanation: string;
}

const SECURITY_SCENARIOS: SecurityScenario[] = [
  {
    id: 'hardcoded-html',
    title: 'Scenario 1: Putting your key inside index.html',
    snippet: `<script>\n  const OPENAI_KEY = "sk-proj-9a8f7c6b...2k1";\n  fetch("https://api.openai.com/...", { headers: { Authorization: "Bearer " + OPENAI_KEY } });\n</script>`,
    isSafe: false,
    explanation:
      'Danger! Anyone who opens "View Page Source" on your website can steal your API key in 2 seconds and rack up charges on your credit card. API keys belong on a server or inside a local desktop app, never in public browser HTML.',
  },
  {
    id: 'dotenv-gitignore',
    title: 'Scenario 2: Saving your key in .env + .gitignore',
    snippet: `# .env (stays on your computer)\nANTHROPIC_API_KEY=sk-ant-api03-xxxx...\n\n# .gitignore (tells Git: NEVER upload .env!)\n.env`,
    isSafe: true,
    explanation:
      'Safe practice! Storing secrets in a local .env file and listing .env inside .gitignore keeps your key off GitHub while your local tools can still read it.',
  },
  {
    id: 'screenshot-discord',
    title: 'Scenario 3: Posting a help screenshot with your key visible',
    snippet: `Terminal screenshot shared in a public Discord channel:\n$ export ANTHROPIC_API_KEY="sk-ant-api03-92fK8xL..."\n$ claude "why won't my CSS center?"`,
    isSafe: false,
    explanation:
      'Danger! Bots and strangers scan screenshots and public repos for "sk-ant-" and "sk-proj-" prefixes. If you ever accidentally show a key, revoke/delete it immediately in your provider dashboard and create a fresh one.',
  },
  {
    id: 'billing-cap',
    title: 'Scenario 4: Setting a $5 hard spending cap',
    snippet: `Billing Dashboard -> Usage Limits:\nMonthly Hard Limit: $5.00\nAuto-Recharge: OFF`,
    isSafe: true,
    explanation:
      'Smart move! Prepaid credits with auto-recharge OFF and a low $5 cap guarantee you can never get a surprise bill while learning or testing code.',
  },
];

interface InspectorOutput {
  mode: 'simulated' | 'live';
  endpoint: string;
  headers: Record<string, string>;
  requestBody: Record<string, unknown>;
  status: number;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
  responseText: string;
  error?: string;
}

function formatUsd(amount: number): string {
  if (amount === 0) return '$0.00';
  if (amount < 0.0001) return `$${amount.toFixed(6)}`;
  if (amount < 0.01) return `$${amount.toFixed(4)}`;
  return `$${amount.toFixed(2)}`;
}

export const ApiCreditsLab: React.FC<LabProps> = ({
  onCompleteLab,
  completedLabs,
  apiConfig,
  onOpenSettings,
}) => {
  // Calculator state
  const [selectedModelId, setSelectedModelId] = useState<string>('gemini-flash');
  const [promptTokens, setPromptTokens] = useState<number>(600);
  const [replyTokens, setReplyTokens] = useState<number>(400);
  const [messagesPerDay, setMessagesPerDay] = useState<number>(25);
  const [usedCalculator, setUsedCalculator] = useState<boolean>(false);

  // Security mini-game state
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  // API Inspector state
  const [inspectorPrompt, setInspectorPrompt] = useState<string>(
    'Explain what an API is using a restaurant waiter analogy in 2 short sentences.'
  );
  const [inspectorLoading, setInspectorLoading] = useState<boolean>(false);
  const [inspectorResult, setInspectorResult] = useState<InspectorOutput | null>(null);

  const selectedModel =
    PRICING_MODELS.find((m) => m.id === selectedModelId) || PRICING_MODELS[0];

  const calc = useMemo(() => {
    const inputCost = (promptTokens / 1_000_000) * selectedModel.inputPerMillion;
    const outputCost = (replyTokens / 1_000_000) * selectedModel.outputPerMillion;
    const perMessage = inputCost + outputCost;
    const perThousand = perMessage * 1000;
    const monthlyCost = perMessage * messagesPerDay * 30;
    const chatsForFiveDollars =
      perMessage === 0 ? Infinity : Math.floor(5 / perMessage);

    return { perMessage, perThousand, monthlyCost, chatsForFiveDollars };
  }, [promptTokens, replyTokens, messagesPerDay, selectedModel]);

  const answeredCount = Object.keys(answers).length;
  const correctSecurityCount = SECURITY_SCENARIOS.filter(
    (s) => answers[s.id] !== undefined && answers[s.id] === s.isSafe
  ).length;

  const handleRunInspector = async (forceSimulated = false) => {
    setInspectorLoading(true);
    const livePossible = !forceSimulated && isByokReady(apiConfig);

    if (livePossible) {
      const req = buildProviderCallRequest(
        apiConfig,
        inspectorPrompt,
        'Be friendly, concise, and beginner-friendly.'
      );
      const endpointMap: Record<typeof apiConfig.provider, string> = {
        openai: 'POST https://api.openai.com/v1/chat/completions',
        anthropic: 'POST https://api.anthropic.com/v1/messages',
        gemini: `POST https://generativelanguage.googleapis.com/v1beta/models/${req.model}:generateContent`,
        ollama: `POST ${(apiConfig.ollamaUrl || 'http://localhost:11434').replace(/\/$/, '')}/api/generate`,
      };

      const res = await testProviderCall(req);
      const inTok = res.inputTokens ?? Math.max(12, Math.ceil(inspectorPrompt.length / 4));
      const outTok = res.outputTokens ?? Math.max(18, Math.ceil((res.text || '').length / 4));
      const approxCost =
        apiConfig.provider === 'ollama'
          ? 0
          : (inTok / 1_000_000) * 0.5 + (outTok / 1_000_000) * 1.5;

      setInspectorResult({
        mode: 'live',
        endpoint: endpointMap[apiConfig.provider],
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            apiConfig.provider === 'ollama'
              ? '(none — local machine)'
              : 'Bearer sk-••••••••••••(masked)',
        },
        requestBody: {
          model: req.model,
          messages: [{ role: 'user', content: inspectorPrompt }],
          max_tokens: 256,
        },
        status: res.rawStatus ?? (res.ok ? 200 : 400),
        latencyMs: res.latencyMs ?? 420,
        inputTokens: inTok,
        outputTokens: outTok,
        estimatedCostUsd: approxCost,
        responseText: res.text || '',
        error: res.ok ? undefined : res.error || 'Live API call failed.',
      });
      setInspectorLoading(false);
      return;
    }

    // Realistic simulated API request/response
    await new Promise((resolve) => setTimeout(resolve, 420));
    const inTok = Math.max(14, Math.ceil(inspectorPrompt.length / 3.8) + 12);
    const simulatedReply =
      inspectorPrompt.toLowerCase().includes('coffee')
        ? 'Roast bold. Sip happy. Start bright.'
        : 'An API is like a restaurant waiter: you tell the waiter what you want from the menu, they carry your order to the kitchen (the AI model), and bring your finished dish back to your table. Your API key is simply your customer tab so the kitchen knows who is ordering!';
    const outTok = Math.ceil(simulatedReply.length / 3.9);
    const cost =
      (inTok / 1_000_000) * selectedModel.inputPerMillion +
      (outTok / 1_000_000) * selectedModel.outputPerMillion;

    setInspectorResult({
      mode: 'simulated',
      endpoint:
        selectedModel.id === 'ollama-free'
          ? 'POST http://localhost:11434/api/generate'
          : 'POST https://api.anthropic.com/v1/messages',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          selectedModel.id === 'ollama-free'
            ? '(none — runs locally)'
            : 'Bearer sk-demo-••••••••••4f9a',
      },
      requestBody: {
        model: selectedModel.id,
        max_tokens: 256,
        messages: [{ role: 'user', content: inspectorPrompt }],
      },
      status: 200,
      latencyMs: 386,
      inputTokens: inTok,
      outputTokens: outTok,
      estimatedCostUsd: cost,
      responseText: simulatedReply,
    });
    setInspectorLoading(false);
  };

  const missionSteps = [
    {
      id: 'calculator',
      label: 'Compare models or adjust sliders in the Credit Cost Calculator',
      done: usedCalculator,
    },
    {
      id: 'security-game',
      label: `Judge all 4 scenarios in the API Key Safety Game (${answeredCount}/4)`,
      done: answeredCount === SECURITY_SCENARIOS.length,
    },
    {
      id: 'inspector',
      label: 'Send a Simulated or Live API request in the Inspector',
      done: inspectorResult !== null,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <LabHeader
        badge="Lab 2 • Money & Safety"
        title="AI Credits, Pricing & API Keys Lab"
        subtitle="Understand why a $20 chat plan differs from pay-as-you-go API credits, calculate real token costs, and practice keeping keys safe."
        xpReward={75}
        isCompleted={completedLabs.includes('api-credits')}
        apiConfig={apiConfig}
        onOpenSettings={onOpenSettings}
        accent="amber"
        icon={<Coins className="h-6 w-6" />}
      />

      <MissionChecklist
        labId="api-credits"
        xpReward={75}
        steps={missionSteps}
        completedLabs={completedLabs}
        onCompleteLab={onCompleteLab}
      />

      {/* SECTION 1: SUBSCRIPTION VS API CREDITS */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm dark:border-blue-900/60 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Monthly Chat Subscription ($20/mo)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Analogy: All-You-Can-Eat Buffet Pass
              </p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <li>• Examples: ChatGPT Plus, Claude Pro, Gemini Advanced.</li>
            <li>• Flat $20/month whether you send 10 messages or 1,000.</li>
            <li>• Works inside the provider&apos;s chat app & website (with usage limits every few hours).</li>
            <li className="font-semibold text-blue-700 dark:text-blue-300">
              • Best for: Everyday chatting, writing, brainstorming, and trying Claude Code via Pro/Max plans.
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm dark:border-amber-900/60 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Pay-As-You-Go API Credits (Per 1M Tokens)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Analogy: Prepaid Metro Card or Electricity Meter
              </p>
            </div>
          </div>
          <ul className="mt-4 space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <li>• Load $5 of prepaid credits once — only pay tiny fractions of a cent per prompt!</li>
            <li>• Separate billing from your $20 chat subscription (buying ChatGPT Plus does NOT add API credits).</li>
            <li>• Lets YOUR websites, scripts, and desktop tools call AI automatically via an API Key.</li>
            <li className="font-semibold text-amber-700 dark:text-amber-300">
              • Best for: Building apps, automations, light users spending &lt;$3/mo, or picking any model.
            </li>
          </ul>
        </div>
      </section>

      {/* SECTION 2: CREDIT COST CALCULATOR */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Interactive AI Credit Cost Calculator
          </h2>
        </div>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          API pricing is quoted per <strong>1,000,000 tokens</strong> (~750,000 words — about 10 full novels!). Pick a model and slide your usage:
        </p>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
          {PRICING_MODELS.map((m) => {
            const active = m.id === selectedModelId;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setSelectedModelId(m.id);
                  setUsedCalculator(true);
                }}
                className={`rounded-xl border p-3 text-left transition-all ${
                  active
                    ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500 dark:border-amber-400 dark:bg-amber-950/50'
                    : 'border-slate-200 bg-slate-50/70 hover:border-amber-300 dark:border-slate-700 dark:bg-slate-800/50'
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                  {m.badge}
                </div>
                <div className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">
                  {m.name}
                </div>
                <div className="mt-1 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                  ${m.inputPerMillion} in / ${m.outputPerMillion} out
                </div>
                <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  {m.summary}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid gap-6 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-6">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
                <label htmlFor="calc-prompt">Your Prompt Size (Input Tokens)</label>
                <span className="font-mono text-amber-600 dark:text-amber-400">
                  {promptTokens.toLocaleString()} tokens (~{Math.round(promptTokens * 0.75)} words)
                </span>
              </div>
              <input
                id="calc-prompt"
                type="range"
                min={100}
                max={10000}
                step={100}
                value={promptTokens}
                onChange={(e) => {
                  setPromptTokens(Number(e.target.value));
                  setUsedCalculator(true);
                }}
                className="mt-1.5 h-2 w-full cursor-pointer accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
                <label htmlFor="calc-reply">AI Reply Size (Output Tokens — usually 3–5× pricier!)</label>
                <span className="font-mono text-amber-600 dark:text-amber-400">
                  {replyTokens.toLocaleString()} tokens (~{Math.round(replyTokens * 0.75)} words)
                </span>
              </div>
              <input
                id="calc-reply"
                type="range"
                min={100}
                max={4000}
                step={100}
                value={replyTokens}
                onChange={(e) => {
                  setReplyTokens(Number(e.target.value));
                  setUsedCalculator(true);
                }}
                className="mt-1.5 h-2 w-full cursor-pointer accent-amber-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-200">
                <label htmlFor="calc-msgs">Messages Per Day</label>
                <span className="font-mono text-amber-600 dark:text-amber-400">
                  {messagesPerDay} chats / day ({(messagesPerDay * 30).toLocaleString()} / month)
                </span>
              </div>
              <input
                id="calc-msgs"
                type="range"
                min={1}
                max={200}
                step={1}
                value={messagesPerDay}
                onChange={(e) => {
                  setMessagesPerDay(Number(e.target.value));
                  setUsedCalculator(true);
                }}
                className="mt-1.5 h-2 w-full cursor-pointer accent-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:col-span-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Cost Per Single Chat
              </div>
              <div className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                {formatUsd(calc.perMessage)}
              </div>
              <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                {calc.perMessage === 0
                  ? 'Free on your hardware'
                  : `${(calc.perMessage * 100).toFixed(3)} cents per message`}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Cost Per 1,000 Chats
              </div>
              <div className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                {formatUsd(calc.perThousand)}
              </div>
              <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                At {promptTokens}+{replyTokens} tokens each
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/40">
              <div className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
                How Far $5 of Credits Goes
              </div>
              <div className="mt-1 text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">
                {calc.chatsForFiveDollars === Infinity
                  ? 'Unlimited'
                  : `${calc.chatsForFiveDollars.toLocaleString()}`}
              </div>
              <div className="mt-1 text-[11px] text-emerald-700/80 dark:text-emerald-300/80">
                {calc.chatsForFiveDollars === Infinity
                  ? 'Zero API charges with Ollama!'
                  : 'messages on a single $5 top-up'}
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 dark:border-blue-900/60 dark:bg-blue-950/40">
              <div className="text-xs font-medium text-blue-800 dark:text-blue-300">
                Est. Monthly API Bill
              </div>
              <div className="mt-1 text-2xl font-extrabold text-blue-700 dark:text-blue-300">
                {formatUsd(calc.monthlyCost)}
              </div>
              <div className="mt-1 text-[11px] text-blue-700/80 dark:text-blue-300/80">
                {calc.monthlyCost < 20
                  ? `Saves ${formatUsd(20 - calc.monthlyCost)}/mo vs $20 plan!`
                  : 'Higher than $20/mo — a flat subscription may save money!'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: SPOT-THE-LEAKED-API-KEY MINI-GAME */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Spot-the-Leaked-API-Key Mini-Game
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Treat your API key like your debit card PIN. Decide whether each scenario is{' '}
              <strong>Safe Practice</strong> or a <strong>Danger / Leak</strong>!
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            Score: {correctSecurityCount} / {SECURITY_SCENARIOS.length}
          </span>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {SECURITY_SCENARIOS.map((sc) => {
            const picked = answers[sc.id];
            const hasAnswered = picked !== undefined;
            const isCorrect = hasAnswered && picked === sc.isSafe;

            return (
              <div
                key={sc.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/50"
              >
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {sc.title}
                  </div>
                  <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-[11px] leading-relaxed text-slate-100">
                    {sc.snippet}
                  </pre>
                </div>

                <div className="mt-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, [sc.id]: true }))}
                      className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                        picked === true
                          ? 'border-emerald-500 bg-emerald-600 text-white'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-emerald-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
                      }`}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Safe Practice
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnswers((prev) => ({ ...prev, [sc.id]: false }))}
                      className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                        picked === false
                          ? 'border-rose-500 bg-rose-600 text-white'
                          : 'border-slate-300 bg-white text-slate-700 hover:border-rose-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
                      }`}
                    >
                      <ShieldAlert className="h-4 w-4" />
                      Danger! Leak
                    </button>
                  </div>

                  {hasAnswered && (
                    <div
                      className={`mt-3 rounded-xl border p-3 text-xs ${
                        isCorrect
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200'
                          : 'border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        {isCorrect ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 shrink-0" />
                        )}
                        {isCorrect ? 'Spot on!' : 'Not quite — here is why:'}
                      </div>
                      <p className="mt-1 leading-relaxed">{sc.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: LIVE / SIMULATED API CALL INSPECTOR */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Live API Call Inspector (Under the Hood)
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              See the exact HTTP headers, JSON request, token count, latency, and fraction-of-a-cent cost of a single API call.
            </p>
          </div>
          {!isByokReady(apiConfig) && (
            <button
              type="button"
              onClick={onOpenSettings}
              className="self-start rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Add Real Key in Settings (Optional)
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={inspectorPrompt}
            onChange={(e) => setInspectorPrompt(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            placeholder="Write a short prompt to send to the API..."
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleRunInspector(false)}
              disabled={inspectorLoading || !inspectorPrompt.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-sm transition hover:bg-amber-400 disabled:opacity-60"
            >
              {inspectorLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isByokReady(apiConfig) ? 'Send Real API Call' : 'Run Simulated API Call'}
            </button>
            {isByokReady(apiConfig) && (
              <button
                type="button"
                onClick={() => handleRunInspector(true)}
                disabled={inspectorLoading}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Simulate Free
              </button>
            )}
          </div>
        </div>

        {inspectorResult && (
          <div className="mt-4 space-y-4">
            {/* Telemetry pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span
                className={`rounded-full px-2.5 py-1 font-bold ${
                  inspectorResult.error
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                }`}
              >
                HTTP {inspectorResult.status} {inspectorResult.error ? 'Error' : 'OK'}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                Latency: {inspectorResult.latencyMs}ms
              </span>
              <span className="rounded-full bg-blue-100 px-2.5 py-1 font-mono text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                In: {inspectorResult.inputTokens} tok • Out: {inspectorResult.outputTokens} tok
              </span>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 font-mono font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                Est. Cost: {formatUsd(inspectorResult.estimatedCostUsd)}
              </span>
              <span className="rounded-full bg-violet-100 px-2.5 py-1 font-semibold text-violet-800 dark:bg-violet-950 dark:text-violet-200">
                {inspectorResult.mode === 'live' ? 'Real Provider Call' : 'Simulated Practice Call'}
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-950 p-4 text-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wide text-amber-400">
                  Outgoing HTTP Request
                </div>
                <div className="mt-1 font-mono text-xs text-emerald-300">
                  {inspectorResult.endpoint}
                </div>
                <pre className="mt-2 overflow-x-auto font-mono text-[11px] leading-relaxed text-slate-300">
                  {Object.entries(inspectorResult.headers)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join('\n')}
                  {'\n\n'}
                  {JSON.stringify(inspectorResult.requestBody, null, 2)}
                </pre>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">
                <div className="text-[11px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                  Incoming AI Response
                </div>
                {inspectorResult.error ? (
                  <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">
                    {inspectorResult.error}
                  </p>
                ) : (
                  <p className="mt-2 text-sm leading-relaxed text-slate-800 dark:text-slate-100">
                    {inspectorResult.responseText}
                  </p>
                )}
                <div className="mt-3 rounded-lg bg-slate-900 p-2.5 font-mono text-[11px] text-slate-300">
                  {JSON.stringify(
                    {
                      usage: {
                        input_tokens: inspectorResult.inputTokens,
                        output_tokens: inspectorResult.outputTokens,
                      },
                      cost_usd: Number(inspectorResult.estimatedCostUsd.toFixed(6)),
                    },
                    null,
                    2
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
