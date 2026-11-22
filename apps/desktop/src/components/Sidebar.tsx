import React from 'react';
import {
  BookOpen,
  BookMarked,
  CheckCircle2,
  Compass,
  FlaskConical,
  KeyRound,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import type { LabDefinition, LabId } from '../labs';
import type { UserProgress } from '../types/ipc';
import { getLevelInfo } from '../utils/progress';
import { LabIcon } from '../utils/moduleIcons';

export type NavSection = 'home' | 'learn' | 'lab' | 'glossary' | 'settings';

interface SidebarProps {
  activeSection: NavSection;
  activeLabId: LabId | null;
  labs: LabDefinition[];
  progress: UserProgress;
  totalChapters: number;
  totalGlossaryTerms: number;
  onSelectSection: (section: NavSection) => void;
  onSelectLab: (labId: LabId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  activeLabId,
  labs,
  progress,
  totalChapters,
  totalGlossaryTerms,
  onSelectSection,
  onSelectLab,
}) => {
  const level = getLevelInfo(progress.xp);
  const completedChapterCount = progress.completedChapters.length;
  const completedLabSet = new Set(progress.completedLabs);
  const isByok = progress.apiConfig.mode === 'byok';

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200/90 bg-white/95 dark:border-slate-800 dark:bg-slate-900/95">
      {/* Brand Header */}
      <div className="flex items-center gap-3 border-b border-slate-200/80 px-4 py-4 dark:border-slate-800">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-blue-600 text-white shadow-sm">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-base font-bold tracking-tight text-slate-900 dark:text-white">
              Zero2AI Studio
            </span>
          </div>
          <p className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Zero to Building with AI
          </p>
        </div>
      </div>

      {/* Main Scrollable Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {/* Core Destinations */}
        <div className="space-y-1">
          <p className="px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Learn
          </p>

          <button
            type="button"
            onClick={() => onSelectSection('home')}
            className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              activeSection === 'home'
                ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800/70'
                : 'text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/70'
            }`}
          >
            <Compass className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">Home Path</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('learn')}
            className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              activeSection === 'learn'
                ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800/70'
                : 'text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/70'
            }`}
          >
            <BookOpen className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">Varsity Chapters</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {completedChapterCount}/{totalChapters}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('glossary')}
            className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              activeSection === 'glossary'
                ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800/70'
                : 'text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/70'
            }`}
          >
            <BookMarked className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">AI Glossary</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {totalGlossaryTerms}
            </span>
          </button>
        </div>

        {/* Try & Build Labs */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2.5 pb-1">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <FlaskConical className="h-3.5 w-3.5" />
              Try &amp; Build Labs
            </p>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              {progress.completedLabs.length}/{labs.length}
            </span>
          </div>

          {labs.map((lab) => {
            const isSelected = activeSection === 'lab' && activeLabId === lab.id;
            const isDone = completedLabSet.has(lab.id);
            return (
              <button
                key={lab.id}
                type="button"
                onClick={() => onSelectLab(lab.id)}
                className={`group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                  isSelected
                    ? 'bg-blue-50 font-semibold text-blue-800 ring-1 ring-blue-200/80 dark:bg-blue-950/60 dark:text-blue-200 dark:ring-blue-800/70'
                    : 'font-medium text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/70'
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : isDone
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/70 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  <LabIcon labId={lab.id} className="h-3.5 w-3.5" />
                </span>
                <span className="flex-1 truncate text-[13px]">{lab.title}</span>
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                ) : (
                  <span className="shrink-0 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                    +{lab.xpReward}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Settings */}
        <div className="space-y-1 border-t border-slate-200/80 pt-4 dark:border-slate-800">
          <p className="px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Studio Settings
          </p>
          <button
            type="button"
            onClick={() => onSelectSection('settings')}
            className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              activeSection === 'settings'
                ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800/70'
                : 'text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/70'
            }`}
          >
            <KeyRound className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">API &amp; Mode</span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                isByok
                  ? 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
              }`}
            >
              {isByok ? <Zap className="h-2.5 w-2.5" /> : <ShieldCheck className="h-2.5 w-2.5" />}
              {isByok ? 'BYOK' : 'Free'}
            </span>
          </button>
        </div>
      </nav>

      {/* Bottom Rank Card */}
      <div className="border-t border-slate-200/80 p-3 dark:border-slate-800">
        <div className="rounded-xl border border-slate-200/80 bg-[#FAFAF7] p-3 dark:border-slate-800 dark:bg-slate-950/70">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Lvl {level.level} &middot; {level.title}
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{progress.xp} XP</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
              style={{ width: `${level.progressPct}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            {level.nextXp
              ? `${level.xpToNext} XP to next rank`
              : 'Top rank reached — keep building!'}
          </p>
        </div>
      </div>
    </aside>
  );
};
