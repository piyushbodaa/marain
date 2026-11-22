import React from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  FlaskConical,
  Play,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react';
import type { CurriculumData } from '../types/curriculum';
import type { LabDefinition, LabId } from '../labs';
import type { UserProgress } from '../types/ipc';
import { getNextRecommendedChapter } from '../data/curriculum';
import { LabIcon, ModuleIcon } from '../utils/moduleIcons';
import { InlineMarkdown } from '../utils/RichText';

interface HomeDashboardProps {
  curriculum: CurriculumData;
  labs: LabDefinition[];
  progress: UserProgress;
  onOpenChapter: (chapterId: string) => void;
  onOpenModule: (moduleId: string) => void;
  onOpenLab: (labId: LabId) => void;
  onDismissChecklist: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  curriculum,
  labs,
  progress,
  onOpenChapter,
  onOpenModule,
  onOpenLab,
  onDismissChecklist,
}) => {
  const completedChapterSet = new Set(progress.completedChapters);
  const completedLabSet = new Set(progress.completedLabs);
  const totalChapters = curriculum.modules.reduce((acc, m) => acc + m.chapters.length, 0);
  const overallChapterPct =
    totalChapters > 0 ? Math.round((progress.completedChapters.length / totalChapters) * 100) : 0;

  const nextUp = getNextRecommendedChapter(progress.completedChapters, progress.lastChapterId);
  const nextLab = labs.find((l) => !completedLabSet.has(l.id)) ?? labs[0];

  const hasReadChapter = progress.completedChapters.length > 0;
  const hasPassedQuiz = Object.keys(progress.completedQuizzes).length > 0;
  const hasDoneAnyLab = progress.completedLabs.length > 0;
  const hasBuiltProject =
    completedLabSet.has('website-builder') || completedLabSet.has('app-builder');

  const checklistItems = [
    {
      id: 'read',
      label: 'Read your first jargon-free AI chapter',
      done: hasReadChapter,
      cta: 'Start Reading',
      onClick: () => nextUp && onOpenChapter(nextUp.chapter.id),
    },
    {
      id: 'quiz',
      label: 'Finish a quick bite-sized chapter quiz (+XP)',
      done: hasPassedQuiz,
      cta: 'Take a Quiz',
      onClick: () => nextUp && onOpenChapter(nextUp.chapter.id),
    },
    {
      id: 'lab',
      label: 'Try a hands-on Lab in free Practice Mode',
      done: hasDoneAnyLab,
      cta: 'Open Tokenizer Lab',
      onClick: () => onOpenLab('tokenizer'),
    },
    {
      id: 'build',
      label: 'Build & export your first Website or App',
      done: hasBuiltProject,
      cta: 'Website Studio',
      onClick: () => onOpenLab('website-builder'),
    },
  ];
  const checklistCompleted = checklistItems.filter((item) => item.done).length;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-7">
      {/* Hero: Continue Where You Left Off */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-200/80 bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-700 p-7 text-white shadow-lg shadow-emerald-950/10 dark:border-emerald-800/50">
        <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-amber-300/15 blur-2xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>
                {progress.completedChapters.length === 0
                  ? 'Welcome to Zero2AI Studio — Start Here'
                  : 'Continue Where You Left Off'}
              </span>
            </div>

            {nextUp ? (
              <>
                <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Module {String(nextUp.module.number).padStart(2, '0')}:{' '}
                  <InlineMarkdown text={nextUp.chapter.title} inverted />
                </h2>
                <p className="text-sm leading-relaxed text-emerald-50/95 sm:text-base">
                  <InlineMarkdown text={nextUp.chapter.summary} inverted />
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-semibold text-emerald-100">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {nextUp.chapter.readMinutes} min read
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Trophy className="h-3.5 w-3.5 text-amber-300" />+{nextUp.chapter.xpReward} XP
                  </span>
                  <span>
                    Overall path: {progress.completedChapters.length}/{totalChapters} chapters (
                    {overallChapterPct}%)
                  </span>
                </div>
              </>
            ) : (
              <h2 className="text-2xl font-extrabold">Ready to explore AI from scratch!</h2>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {nextUp && (
                <button
                  type="button"
                  onClick={() => onOpenChapter(nextUp.chapter.id)}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-50"
                >
                  <Play className="h-4 w-4 fill-emerald-700" />
                  {progress.completedChapters.length === 0
                    ? 'Start Chapter 1'
                    : 'Continue Chapter'}
                </button>
              )}
              {nextLab && (
                <button
                  type="button"
                  onClick={() => onOpenLab(nextLab.id)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
                >
                  <FlaskConical className="h-4 w-4" />
                  Try Lab: {nextLab.title}
                </button>
              )}
            </div>
          </div>

          {/* Right compact stats pill box */}
          <div className="grid shrink-0 grid-cols-2 gap-3 sm:w-64">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-3.5 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-100">
                Chapters
              </p>
              <p className="mt-1 text-2xl font-extrabold">
                {progress.completedChapters.length}
                <span className="text-sm font-medium text-emerald-100/80">/{totalChapters}</span>
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-3.5 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-100">
                Labs Built
              </p>
              <p className="mt-1 text-2xl font-extrabold">
                {progress.completedLabs.length}
                <span className="text-sm font-medium text-emerald-100/80">/{labs.length}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* First-Time Welcome Checklist */}
      {!progress.checklistDismissed && checklistCompleted < checklistItems.length && (
        <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  First-Time Welcome Checklist
                </h3>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  {checklistCompleted}/{checklistItems.length} done
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Zero coding background needed — everything works offline in free Practice Mode.
              </p>
            </div>
            <button
              type="button"
              onClick={onDismissChecklist}
              title="Dismiss checklist"
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {checklistItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 transition ${
                  item.done
                    ? 'border-emerald-200/80 bg-emerald-50/50 dark:border-emerald-900/60 dark:bg-emerald-950/30'
                    : 'border-slate-200/80 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-950/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-slate-400" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      item.done
                        ? 'text-emerald-800 line-through dark:text-emerald-300'
                        : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {!item.done && (
                  <button
                    type="button"
                    onClick={item.onClick}
                    className="shrink-0 rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-emerald-700 shadow-sm ring-1 ring-slate-200 hover:bg-emerald-50 dark:bg-slate-800 dark:text-emerald-300 dark:ring-slate-700 dark:hover:bg-slate-700"
                  >
                    {item.cta}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Duolingo-Style Zero-to-One Learning Path */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Your Zero-to-One AI Path
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              7 friendly modules taking you from &ldquo;What is an LLM?&rdquo; to shipping your own website &amp; app.
            </p>
          </div>
        </div>

        <div className="relative space-y-4">
          {/* Vertical connecting path line */}
          <div
            aria-hidden="true"
            className="absolute bottom-8 left-7 top-8 hidden w-0.5 bg-gradient-to-b from-emerald-300 via-blue-300 to-orange-300 sm:block dark:from-emerald-800 dark:via-blue-800 dark:to-orange-800"
          />

          {curriculum.modules.map((mod) => {
            const doneInModule = mod.chapters.filter((ch) =>
              completedChapterSet.has(ch.id)
            ).length;
            const isModuleComplete =
              mod.chapters.length > 0 && doneInModule === mod.chapters.length;
            const linkedLab = labs.find((l) => l.id === mod.recommendedLabId);
            const firstUnread =
              mod.chapters.find((ch) => !completedChapterSet.has(ch.id)) ?? mod.chapters[0];

            return (
              <div
                key={mod.id}
                className="relative flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-slate-300 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
              >
                {/* Accent Step Node */}
                <div
                  className="relative z-10 flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl text-white shadow-sm"
                  style={{ backgroundColor: mod.accentHex || '#10B981' }}
                >
                  <ModuleIcon name={mod.icon} className="h-5 w-5" />
                  <span className="mt-0.5 text-[10px] font-bold opacity-95">
                    0{mod.number}
                  </span>
                </div>

                {/* Module Details + Chapter Dots */}
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {mod.title}
                    </h4>
                    {isModuleComplete ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" />
                        Completed
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {doneInModule}/{mod.chapters.length} chapters &middot; ~
                        {mod.estimatedMinutes} min
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{mod.subtitle}</p>

                  {/* Interactive chapter pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {mod.chapters.map((ch) => {
                      const chDone = completedChapterSet.has(ch.id);
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => onOpenChapter(ch.id)}
                          title={`Chapter ${ch.number}: ${ch.title}`}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                            chDone
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900/70 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'border-slate-200 bg-[#FAFAF7] text-slate-700 hover:border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-800'
                          }`}
                        >
                          {chDone ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <span className="text-[10px] font-bold opacity-70">{ch.number}.</span>
                          )}
                          <span className="max-w-[170px] truncate">
                            <InlineMarkdown text={ch.title} />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex shrink-0 flex-row gap-2 sm:flex-col">
                  <button
                    type="button"
                    onClick={() =>
                      firstUnread ? onOpenChapter(firstUnread.id) : onOpenModule(mod.id)
                    }
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    {doneInModule > 0 && !isModuleComplete ? 'Continue' : 'Read Module'}
                  </button>
                  {linkedLab && (
                    <button
                      type="button"
                      onClick={() => onOpenLab(linkedLab.id)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-700 dark:hover:bg-blue-950/60 dark:hover:text-blue-300"
                    >
                      <FlaskConical className="h-3.5 w-3.5" />
                      {linkedLab.title}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6 Try & Build Studios Showcase */}
      <section className="space-y-4">
        <div>
          <h3 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            6 Hands-On Try &amp; Build Studios
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Learn by clicking, experimenting, and exporting real projects directly to your computer.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {labs.map((lab) => {
            const isDone = completedLabSet.has(lab.id);
            return (
              <button
                key={lab.id}
                type="button"
                onClick={() => onOpenLab(lab.id)}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950 dark:text-blue-300 dark:group-hover:bg-blue-600 dark:group-hover:text-white">
                      <LabIcon labId={lab.id} className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {lab.badge}
                      </span>
                      {isDone ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          <CheckCircle2 className="h-3 w-3" />
                          Done
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                          +{lab.xpReward} XP
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300">
                      {lab.title}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {lab.subtitle}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span>{isDone ? 'Open Studio Again' : 'Launch Studio'}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
