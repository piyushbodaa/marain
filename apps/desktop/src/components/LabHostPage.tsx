import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  FlaskConical,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import type { ApiConfig, LabDefinition, LabId } from '../labs';
import { ErrorBoundary } from './ErrorBoundary';
import { LabIcon } from '../utils/moduleIcons';

interface LabHostPageProps {
  lab: LabDefinition;
  allLabs: LabDefinition[];
  completedLabs: string[];
  apiConfig: ApiConfig;
  justCompletedLabId: LabId | null;
  onCompleteLab: (labId: LabId, xp: number) => void;
  onSelectLab: (labId: LabId) => void;
  onOpenSettings: () => void;
  onBackHome: () => void;
}

export const LabHostPage: React.FC<LabHostPageProps> = ({
  lab,
  allLabs,
  completedLabs,
  apiConfig,
  justCompletedLabId,
  onCompleteLab,
  onSelectLab,
  onOpenSettings,
  onBackHome,
}) => {
  const LabComponent = lab.component;
  const isCompleted = completedLabs.includes(lab.id);
  const isByok = apiConfig.mode === 'byok';

  return (
    <div className="flex h-full flex-col">
      {/* Compact Studio Breadcrumb Header */}
      <div className="shrink-0 border-b border-slate-200/85 bg-white/85 px-6 py-3 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/85">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackHome}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Home
            </button>

            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <LabIcon labId={lab.id} className="h-4 w-4" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Try &amp; Build Studio
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {lab.badge}
                  </span>
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" />
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                      <Sparkles className="h-3 w-3" />+{lab.xpReward} XP
                    </span>
                  )}
                </div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  {lab.title} —{' '}
                  <span className="font-normal text-slate-500 dark:text-slate-400">
                    {lab.subtitle}
                  </span>
                </h2>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenSettings}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                isByok
                  ? 'border-violet-200 bg-violet-50 text-violet-800 hover:bg-violet-100 dark:border-violet-800 dark:bg-violet-950/60 dark:text-violet-300'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
              }`}
            >
              {isByok ? (
                <>
                  <Zap className="h-3.5 w-3.5" />
                  Live AI ({apiConfig.provider})
                </>
              ) : (
                <>
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Practice Mode
                </>
              )}
            </button>

            <select
              aria-label="Switch active lab"
              value={lab.id}
              onChange={(e) => onSelectLab(e.target.value as LabId)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {allLabs.map((item) => (
                <option key={item.id} value={item.id}>
                  {completedLabs.includes(item.id) ? '✓ ' : ''}
                  {item.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Completion Celebration Banner */}
      {justCompletedLabId === lab.id && (
        <div className="shrink-0 border-b border-emerald-200 bg-emerald-50 px-6 py-3 dark:border-emerald-900/70 dark:bg-emerald-950/50">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2 font-semibold text-emerald-900 dark:text-emerald-200">
              <FlaskConical className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>
                Lab complete! You earned <strong>+{lab.xpReward} XP</strong> for mastering{' '}
                {lab.title}.
              </span>
            </div>
            {allLabs.find((l) => !completedLabs.includes(l.id) && l.id !== lab.id) && (
              <button
                type="button"
                onClick={() => {
                  const next = allLabs.find(
                    (l) => !completedLabs.includes(l.id) && l.id !== lab.id
                  );
                  if (next) onSelectLab(next.id);
                }}
                className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-700"
              >
                Try Next Lab &rarr;
              </button>
            )}
          </div>
        </div>
      )}

      {/* Full-Height Lab Content */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <ErrorBoundary resetKey={lab.id} label={lab.title}>
            <LabComponent
              onCompleteLab={onCompleteLab}
              completedLabs={completedLabs}
              apiConfig={apiConfig}
              onOpenSettings={onOpenSettings}
            />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};
