import React from 'react';
import { Award, Flame, Moon, ShieldCheck, Sparkles, Sun, Zap } from 'lucide-react';
import type { UserProgress } from '../types/ipc';
import { getLevelInfo } from '../utils/progress';
import { InlineMarkdown } from '../utils/RichText';

interface TopBarProps {
  title: string;
  subtitle?: string;
  progress: UserProgress;
  xpPulseKey: number;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  subtitle,
  progress,
  xpPulseKey,
  onToggleTheme,
  onOpenSettings,
}) => {
  const level = getLevelInfo(progress.xp);
  const isByok = progress.apiConfig.mode === 'byok';
  const isDark = progress.theme === 'dark';

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200/85 bg-white/90 px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
      <div className="min-w-0">
        <h1 className="truncate text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          <InlineMarkdown text={title} />
        </h1>
        {subtitle && (
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            <InlineMarkdown text={subtitle} />
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        {/* Streak Pill */}
        <div
          title="Daily learning streak"
          className="inline-flex items-center gap-1.5 rounded-full border border-orange-200/80 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/50 dark:text-orange-300"
        >
          <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
          <span>
            {progress.streakDays} {progress.streakDays === 1 ? 'day' : 'days'}
          </span>
        </div>

        {/* XP Counter */}
        <div
          key={xpPulseKey}
          title="Total XP earned"
          className={`inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-300 ${
            xpPulseKey > 0 ? 'animate-xp-pop' : ''
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>{progress.xp} XP</span>
        </div>

        {/* Level Badge */}
        <div className="hidden items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 lg:inline-flex dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <Award className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{level.title}</span>
        </div>

        {/* Practice / BYOK Mode Pill */}
        <button
          type="button"
          onClick={onOpenSettings}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
            isByok
              ? 'border-violet-200 bg-violet-50 text-violet-800 hover:bg-violet-100 dark:border-violet-800/70 dark:bg-violet-950/50 dark:text-violet-300 dark:hover:bg-violet-900/60'
              : 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800/70 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-900/60'
          }`}
          title="Configure Practice Mode or Bring Your Own API Key"
        >
          {isByok ? (
            <>
              <Zap className="h-3.5 w-3.5" />
              <span>BYOK: {progress.apiConfig.provider}</span>
            </>
          ) : (
            <>
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Practice Mode (Free)</span>
            </>
          )}
        </button>

        {/* Dark/Light Toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
        >
          {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
};
