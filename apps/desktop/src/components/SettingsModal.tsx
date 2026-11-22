import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  FolderOpen,
  HardDrive,
  KeyRound,
  Loader2,
  Lock,
  RotateCcw,
  Send,
  ShieldCheck,
  Terminal,
  X,
  XCircle,
  Zap,
} from 'lucide-react';
import type { ApiSettings, EnvironmentInfo, ProviderId } from '../types/ipc';

interface SettingsModalProps {
  apiConfig: ApiSettings;
  asModal?: boolean;
  onSaveConfig: (next: ApiSettings) => void;
  onResetProgress: () => void;
  onClose?: () => void;
}

const PROVIDER_META: Record<
  ProviderId,
  {
    name: string;
    subtitle: string;
    defaultModel: string;
    models: string[];
    keyPlaceholder: string;
    needsKey: boolean;
  }
> = {
  gemini: {
    name: 'Google Gemini',
    subtitle: 'Generous free tier & ultra-fast models',
    defaultModel: 'gemini-2.5-flash',
    models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'],
    keyPlaceholder: 'AIzaSy...',
    needsKey: true,
  },
  anthropic: {
    name: 'Anthropic Claude',
    subtitle: 'Great for clear writing & coding',
    defaultModel: 'claude-sonnet-4-20250514',
    models: ['claude-sonnet-4-20250514', 'claude-3-5-haiku-latest', 'claude-opus-4-20250514'],
    keyPlaceholder: 'sk-ant-api03-...',
    needsKey: true,
  },
  openai: {
    name: 'OpenAI',
    subtitle: 'GPT-4o mini & GPT-4o family',
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1-mini'],
    keyPlaceholder: 'sk-proj-...',
    needsKey: true,
  },
  ollama: {
    name: 'Local Ollama (100% Free)',
    subtitle: 'Runs open-weights models privately on your own machine',
    defaultModel: 'llama3.2',
    models: ['llama3.2', 'qwen2.5-coder:7b', 'mistral', 'gemma3'],
    keyPlaceholder: 'Not required for Ollama',
    needsKey: false,
  },
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
  apiConfig,
  asModal = false,
  onSaveConfig,
  onResetProgress,
  onClose,
}) => {
  const [draft, setDraft] = useState<ApiSettings>(apiConfig);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    message: string;
    meta?: string;
  } | null>(null);
  const [envInfo, setEnvInfo] = useState<EnvironmentInfo | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    setDraft(apiConfig);
  }, [apiConfig]);

  useEffect(() => {
    let mounted = true;
    if (window.zero2ai?.getEnvironmentInfo) {
      window.zero2ai
        .getEnvironmentInfo()
        .then((info) => {
          if (mounted) setEnvInfo(info);
        })
        .catch(() => {});
    }
    return () => {
      mounted = false;
    };
  }, []);

  const updateDraft = (patch: Partial<ApiSettings>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    onSaveConfig(next);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1800);
  };

  const handleSelectProvider = (provider: ProviderId) => {
    const meta = PROVIDER_META[provider];
    updateDraft({
      provider,
      model: meta.defaultModel,
    });
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    if (!window.zero2ai?.testProviderCall) {
      setTesting(false);
      setTestResult({
        ok: false,
        message:
          'Direct provider calls require the Zero2AI Studio desktop app (to avoid browser CORS blocks). Practice Mode works right here in web preview!',
      });
      return;
    }

    try {
      const res = await window.zero2ai.testProviderCall({
        provider: draft.provider,
        apiKey: draft.provider === 'ollama' ? undefined : draft.apiKey,
        baseUrl: draft.provider === 'ollama' ? draft.ollamaUrl : undefined,
        model: draft.model,
        systemPrompt: 'Reply in one short, friendly sentence.',
        prompt: 'Say hello to a brand new AI learner!',
      });

      if (res.ok) {
        const parts: string[] = [];
        if (typeof res.latencyMs === 'number') parts.push(`${res.latencyMs}ms`);
        if (typeof res.inputTokens === 'number') parts.push(`${res.inputTokens} in`);
        if (typeof res.outputTokens === 'number') parts.push(`${res.outputTokens} out`);
        setTestResult({
          ok: true,
          message: res.text?.trim() || 'Connection succeeded!',
          meta: parts.join(' · '),
        });
      } else {
        setTestResult({
          ok: false,
          message: res.error || 'Connection test failed.',
        });
      }
    } catch (err: any) {
      setTestResult({
        ok: false,
        message: err?.message || 'Unexpected error testing connection.',
      });
    } finally {
      setTesting(false);
    }
  };

  const currentProvider = PROVIDER_META[draft.provider];

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              API &amp; Learning Mode
            </h2>
            {savedNotice && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <CheckCircle2 className="h-3 w-3" />
                Saved locally
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Start 100% free with Practice Mode, or optionally plug in your own AI key or local Ollama anytime.
          </p>
        </div>
        {asModal && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Mode Cards: Practice Mode vs BYOK */}
      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => updateDraft({ mode: 'practice' })}
          className={`flex flex-col rounded-2xl border p-5 text-left transition ${
            draft.mode === 'practice'
              ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/40'
              : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Recommended for Beginners
            </span>
          </div>
          <h3 className="mt-3 text-base font-extrabold text-slate-900 dark:text-white">
            Practice Mode (100% Free)
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            No API key, no credit card, and zero billing risk. All 28 chapters, quizzes, and all 6 hands-on studios work out of the box with smart simulations and real local project exports.
          </p>
        </button>

        <button
          type="button"
          onClick={() => updateDraft({ mode: 'byok' })}
          className={`flex flex-col rounded-2xl border p-5 text-left transition ${
            draft.mode === 'byok'
              ? 'border-violet-500 bg-violet-50/70 ring-2 ring-violet-500/20 dark:border-violet-500 dark:bg-violet-950/40'
              : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
              <Zap className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-bold text-violet-800 dark:bg-violet-950 dark:text-violet-300">
              Optional Live AI
            </span>
          </div>
          <h3 className="mt-3 text-base font-extrabold text-slate-900 dark:text-white">
            Real AI Mode (BYOK / Local Ollama)
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            Connect Google Gemini, Anthropic Claude, OpenAI, or free local Ollama to make real live AI calls in the API Inspector, Website Studio, and App Studio.
          </p>
        </button>
      </div>

      {/* Plain-English Privacy Promise */}
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 text-xs leading-relaxed text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <div>
          <p className="font-bold">Privacy promise: Keys stay strictly on your computer</p>
          <p className="mt-0.5 opacity-90">
            Zero2AI Studio has no cloud backend and never collects or transmits your API keys. When Real AI Mode is enabled, this desktop app sends requests directly from your machine to the provider you choose.
          </p>
        </div>
      </div>

      {/* Provider Config Panel */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <KeyRound className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            Provider Configuration
          </h3>
          {draft.mode === 'practice' && (
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Switch to Real AI Mode above to activate live calls
            </span>
          )}
        </div>

        {/* Provider Tabs */}
        <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(PROVIDER_META) as ProviderId[]).map((pid) => {
            const p = PROVIDER_META[pid];
            const active = draft.provider === pid;
            return (
              <button
                key={pid}
                type="button"
                onClick={() => handleSelectProvider(pid)}
                className={`rounded-xl border p-3 text-left transition ${
                  active
                    ? 'border-violet-500 bg-violet-50/70 dark:border-violet-500 dark:bg-violet-950/50'
                    : 'border-slate-200 bg-[#FAFAF7] hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950/60'
                }`}
              >
                <p className="text-xs font-bold text-slate-900 dark:text-white">{p.name}</p>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  {p.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Credential & Model Inputs */}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {currentProvider.needsKey ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {currentProvider.name} API Key
              </label>
              <div className="relative mt-1.5">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={draft.apiKey}
                  onChange={(e) => updateDraft({ apiKey: e.target.value })}
                  placeholder={currentProvider.keyPlaceholder}
                  autoComplete="off"
                  className="w-full rounded-xl border border-slate-200 bg-[#FAFAF7] py-2.5 pl-3 pr-10 font-mono text-xs text-slate-900 outline-none focus:border-violet-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((s) => !s)}
                  aria-label={showKey ? 'Hide API key' : 'Show API key'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Tip: Always set a $5 monthly spending cap in your provider dashboard!
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Local Ollama URL
              </label>
              <input
                type="text"
                value={draft.ollamaUrl}
                onChange={(e) => updateDraft({ ollamaUrl: e.target.value })}
                placeholder="http://localhost:11434"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-[#FAFAF7] px-3 py-2.5 font-mono text-xs text-slate-900 outline-none focus:border-violet-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                No API key required — runs completely locally on your PC.
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Model Name
            </label>
            <input
              type="text"
              value={draft.model}
              onChange={(e) => updateDraft({ model: e.target.value })}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-[#FAFAF7] px-3 py-2.5 font-mono text-xs text-slate-900 outline-none focus:border-violet-500 focus:bg-white dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {currentProvider.models.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => updateDraft({ model: m })}
                  className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold transition ${
                    draft.model === m
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Test Connection */}
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            type="button"
            disabled={testing}
            onClick={handleTestConnection}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-violet-600 dark:hover:bg-violet-500"
          >
            {testing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            Test Connection
          </button>

          {testResult && (
            <div
              className={`flex flex-1 items-start gap-2 rounded-xl border px-3 py-2 text-xs ${
                testResult.ok
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200'
                  : 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200'
              }`}
            >
              {testResult.ok ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
              )}
              <div className="min-w-0">
                <p className="font-medium">{testResult.message}</p>
                {testResult.meta && <p className="mt-0.5 opacity-75">{testResult.meta}</p>}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Local Desktop Workspace & Tools */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <HardDrive className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Local Workspace &amp; Developer Tools
          </h3>
          {envInfo && window.zero2ai?.openPath && (
            <button
              type="button"
              onClick={() => window.zero2ai?.openPath(envInfo.defaultWorkspace)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-[#FAFAF7] px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <FolderOpen className="h-3.5 w-3.5" />
              Open Export Folder
            </button>
          )}
        </div>

        {envInfo ? (
          <div className="mt-3 space-y-3">
            <p className="font-mono text-xs text-slate-600 dark:text-slate-400">
              Export folder: <span className="font-semibold">{envInfo.defaultWorkspace}</span> (
              {envInfo.platform})
            </p>
            <div className="flex flex-wrap gap-2">
              {(['node', 'git', 'claude', 'ollama'] as const).map((tool) => {
                const available = envInfo.installedTools[tool];
                return (
                  <span
                    key={tool}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                      available
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    <Terminal className="h-3 w-3" />
                    {tool}: {available ? 'Installed' : 'Not detected'}
                  </span>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Running in browser preview mode. Exported projects will download cleanly as files; install the Linux Desktop App for direct disk exports &amp; safe terminal execution.
          </p>
        )}
      </section>

      {/* Reset Progress */}
      <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/70 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/60">
        <div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Reset Learning Progress
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Clears completed chapters, quiz scores, XP, and lab badges (keeps your theme).
          </p>
        </div>
        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-rose-50 hover:text-rose-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Progress
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onResetProgress();
                setConfirmReset(false);
              }}
              className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
            >
              Confirm Reset
            </button>
          </div>
        )}
      </section>
    </div>
  );

  if (asModal) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-[#FAFAF7] p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  }

  return <div className="mx-auto max-w-4xl px-6 py-7">{content}</div>;
};
