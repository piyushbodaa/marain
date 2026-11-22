import React, { useEffect, useRef } from 'react';
import {
  CheckCircle2,
  Circle,
  KeyRound,
  Settings,
  Sparkles,
  Trophy,
} from 'lucide-react';
import type { ApiConfig, LabId } from './types';
import { isByokReady } from './bridge';

export interface MissionStep {
  id: string;
  label: string;
  done: boolean;
}

interface LabHeaderProps {
  badge: string;
  title: string;
  subtitle: string;
  xpReward: number;
  isCompleted: boolean;
  apiConfig: ApiConfig;
  onOpenSettings: () => void;
  accent?: 'emerald' | 'blue' | 'amber' | 'violet' | 'rose' | 'teal';
  icon: React.ReactNode;
}

const ACCENT_STYLES: Record<
  NonNullable<LabHeaderProps['accent']>,
  {
    iconBg: string;
    badgeBg: string;
    border: string;
  }
> = {
  emerald: {
    iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
    badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300',
    border: 'border-emerald-200/80 dark:border-emerald-900/60',
  },
  blue: {
    iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25',
    badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300',
    border: 'border-blue-200/80 dark:border-blue-900/60',
  },
  amber: {
    iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25',
    badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300',
    border: 'border-amber-200/80 dark:border-amber-900/60',
  },
  violet: {
    iconBg: 'bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/25',
    badgeBg: 'bg-violet-100 text-violet-800 dark:bg-violet-950/70 dark:text-violet-300',
    border: 'border-violet-200/80 dark:border-violet-900/60',
  },
  rose: {
    iconBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/25',
    badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300',
    border: 'border-rose-200/80 dark:border-rose-900/60',
  },
  teal: {
    iconBg: 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/25',
    badgeBg: 'bg-teal-100 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300',
    border: 'border-teal-200/80 dark:border-teal-900/60',
  },
};

export const LabHeader: React.FC<LabHeaderProps> = ({
  badge,
  title,
  subtitle,
  xpReward,
  isCompleted,
  apiConfig,
  onOpenSettings,
  accent = 'emerald',
  icon,
}) => {
  const styles = ACCENT_STYLES[accent];
  const liveReady = isByokReady(apiConfig);

  return (
    <div
      className={`rounded-2xl border bg-white dark:bg-slate-900/80 p-5 shadow-sm ${styles.border}`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${styles.iconBg}`}
          >
            {icon}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles.badgeBg}`}
              >
                {badge}
              </span>
              {isCompleted ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                  <Trophy className="h-3.5 w-3.5" />
                  Completed (+{xpReward} XP)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/80 dark:text-amber-300">
                  <Sparkles className="h-3.5 w-3.5" />+{xpReward} XP Reward
                </span>
              )}
            </div>
            <h1 className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              {title}
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenSettings}
          className={`inline-flex items-center gap-2 self-start rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors lg:self-center ${
            liveReady
              ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 dark:hover:bg-emerald-900/60'
              : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          {liveReady ? (
            <>
              <KeyRound className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>
                Live AI: {apiConfig.provider.toUpperCase()}
                {apiConfig.model ? ` (${apiConfig.model})` : ''}
              </span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Practice Mode (Free • No Key Needed)</span>
            </>
          )}
          <Settings className="ml-0.5 h-3.5 opacity-60" />
        </button>
      </div>
    </div>
  );
};

interface MissionChecklistProps {
  labId: LabId;
  xpReward: number;
  steps: MissionStep[];
  completedLabs: string[];
  onCompleteLab: (labId: LabId, xp: number) => void;
  title?: string;
}

export const MissionChecklist: React.FC<MissionChecklistProps> = ({
  labId,
  xpReward,
  steps,
  completedLabs,
  onCompleteLab,
  title = 'Hands-On Mission Checklist',
}) => {
  const doneCount = steps.filter((s) => s.done).length;
  const allDone = steps.length > 0 && doneCount === steps.length;
  const alreadyCompleted = completedLabs.includes(labId);
  const awardedRef = useRef(false);

  useEffect(() => {
    if (allDone && !alreadyCompleted && !awardedRef.current) {
      awardedRef.current = true;
      onCompleteLab(labId, xpReward);
    }
  }, [allDone, alreadyCompleted, labId, xpReward, onCompleteLab]);

  const progressPct = steps.length ? Math.round((doneCount / steps.length) * 100) : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Trophy
            className={`h-4 w-4 ${
              allDone || alreadyCompleted
                ? 'text-emerald-500'
                : 'text-amber-500'
            }`}
          />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h2>
        </div>
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          {allDone || alreadyCompleted
            ? `All missions complete! +${xpReward} XP earned`
            : `${doneCount} / ${steps.length} complete • Earn +${xpReward} XP`}
        </span>
      </div>

      <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${alreadyCompleted ? 100 : progressPct}%` }}
        />
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-xs transition-colors ${
              step.done
                ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200'
                : 'border-slate-200 bg-slate-50/70 text-slate-700 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300'
            }`}
          >
            {step.done ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
            )}
            <span className={step.done ? 'font-medium' : ''}>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
