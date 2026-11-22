import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookMarked,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  FlaskConical,
  Lightbulb,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Trophy,
  X,
  XCircle,
} from 'lucide-react';
import type {
  CalloutType,
  Chapter,
  CurriculumData,
  GlossaryTerm,
  QuizQuestionType,
} from '../types/curriculum';
import type { LabDefinition, LabId } from '../labs';
import type { UserProgress } from '../types/ipc';
import { getAdjacentChapters, getChapterById, getGlossaryTermById } from '../data/curriculum';
import { ModuleIcon } from '../utils/moduleIcons';
import { InlineMarkdown, RichMarkdownBody } from '../utils/RichText';

interface LearnPageProps {
  curriculum: CurriculumData;
  labs: LabDefinition[];
  progress: UserProgress;
  selectedChapterId: string | null;
  selectedModuleId: string | null;
  onSelectChapter: (chapterId: string | null) => void;
  onSelectModule: (moduleId: string | null) => void;
  onCompleteChapter: (chapterId: string, xpReward: number) => void;
  onCompleteQuiz: (chapterId: string, score: number, total: number, xpEarned: number) => void;
  onToggleBookmark: (chapterId: string) => void;
  onOpenLab: (labId: LabId) => void;
  onOpenGlossaryTerm: (term: string) => void;
}

function getCalloutStyle(type: CalloutType) {
  switch (type) {
    case 'myth':
      return {
        container:
          'border-rose-200 bg-rose-50/75 text-rose-950 dark:border-rose-900/60 dark:bg-rose-950/35 dark:text-rose-100',
        badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/70 dark:text-rose-200',
        label: 'Myth Buster',
        icon: <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-400" />,
      };
    case 'example':
      return {
        container:
          'border-blue-200 bg-blue-50/75 text-blue-950 dark:border-blue-900/60 dark:bg-blue-950/35 dark:text-blue-100',
        badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/70 dark:text-blue-200',
        label: 'Real-World Example',
        icon: <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
      };
    case 'warning':
      return {
        container:
          'border-amber-200 bg-amber-50/80 text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/35 dark:text-amber-100',
        badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/70 dark:text-amber-200',
        label: 'Watch Out',
        icon: <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
      };
    case 'tip':
    default:
      return {
        container:
          'border-emerald-200 bg-emerald-50/75 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/35 dark:text-emerald-100',
        badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/70 dark:text-emerald-200',
        label: 'Pro Tip',
        icon: <Lightbulb className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
      };
  }
}

function formatQuizType(type: QuizQuestionType): string {
  switch (type) {
    case 'true_false':
      return 'Myth Buster · True / False';
    case 'spot_mistake':
      return 'Spot the Mistake';
    case 'multiple_choice':
    default:
      return 'Multiple Choice';
  }
}

interface ChapterQuizProps {
  chapter: Chapter;
  alreadyDone: boolean;
  onFinish: (score: number, total: number, xpEarned: number) => void;
  onNextChapter?: () => void;
  relatedLab?: LabDefinition;
  onOpenLab: (labId: LabId) => void;
}

const ChapterQuiz: React.FC<ChapterQuizProps> = ({
  chapter,
  alreadyDone,
  onFinish,
  onNextChapter,
  relatedLab,
  onOpenLab,
}) => {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [lastEarnedXp, setLastEarnedXp] = useState(0);
  const [wasAlreadyDoneAtFinish, setWasAlreadyDoneAtFinish] = useState(false);

  const questions = chapter.quiz || [];
  if (questions.length === 0) return null;

  const current = questions[questionIdx];
  const isCorrect = selectedOption === current.correctIndex;

  const handleCheck = () => {
    if (selectedOption === null || submitted) return;
    setSubmitted(true);
    if (selectedOption === current.correctIndex) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (questionIdx + 1 < questions.length) {
      setQuestionIdx((i) => i + 1);
      setSelectedOption(null);
      setSubmitted(false);
    } else {
      const finalScore = correctCount;
      const earned = Math.max(
        10,
        Math.round((finalScore / questions.length) * chapter.xpReward)
      );
      setWasAlreadyDoneAtFinish(alreadyDone);
      setLastEarnedXp(earned);
      setFinished(true);
      onFinish(finalScore, questions.length, earned);
    }
  };

  const handleRetake = () => {
    setQuestionIdx(0);
    setSelectedOption(null);
    setSubmitted(false);
    setCorrectCount(0);
    setFinished(false);
    setLastEarnedXp(0);
    setWasAlreadyDoneAtFinish(false);
  };

  if (finished) {
    const pct = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-7 text-center shadow-sm dark:border-emerald-900/70 dark:from-emerald-950/50 dark:via-slate-900 dark:to-teal-950/40">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
          <Trophy className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white">
          {pct >= 70 ? 'Awesome job!' : 'Good practice round!'}
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          You scored{' '}
          <span className="font-bold text-emerald-700 dark:text-emerald-300">
            {correctCount} out of {questions.length}
          </span>{' '}
          ({pct}%) on &ldquo;<InlineMarkdown text={chapter.title} />&rdquo;.
        </p>

        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          <Sparkles className="h-3.5 w-3.5" />
          {wasAlreadyDoneAtFinish
            ? 'Quiz completed (XP already banked!)'
            : `+${lastEarnedXp} XP added to your profile`}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleRetake}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <RotateCcw className="h-4 w-4" />
            Retake Quiz
          </button>

          {relatedLab && (
            <button
              type="button"
              onClick={() => onOpenLab(relatedLab.id)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-800 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-200"
            >
              <FlaskConical className="h-4 w-4" />
              Try {relatedLab.title}
            </button>
          )}

          {onNextChapter && (
            <button
              type="button"
              onClick={onNextChapter}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700"
            >
              Next Chapter
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Header & Progress */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            Quick Check &middot; +{chapter.xpReward} XP
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {formatQuizType(current.type)}
          </span>
        </div>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Question {questionIdx + 1} of {questions.length}
        </span>
      </div>

      {/* Segmented bar */}
      <div className="mt-4 flex gap-1.5">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className={`h-2 flex-1 rounded-full transition-colors ${
              idx < questionIdx
                ? 'bg-emerald-500'
                : idx === questionIdx
                  ? 'bg-emerald-300 dark:bg-emerald-700'
                  : 'bg-slate-200 dark:bg-slate-800'
            }`}
          />
        ))}
      </div>

      {/* Question text */}
      <h4 className="mt-5 text-lg font-bold leading-snug text-slate-900 dark:text-white">
        <InlineMarkdown text={current.question} />
      </h4>

      {/* Options */}
      <div className="mt-4 space-y-2.5">
        {current.options.map((opt, idx) => {
          const isPicked = selectedOption === idx;
          const isRightAnswer = idx === current.correctIndex;

          let cardClass =
            'border-slate-200 bg-[#FAFAF7] text-slate-800 hover:border-emerald-300 hover:bg-emerald-50/40 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-200 dark:hover:border-emerald-700';

          if (!submitted && isPicked) {
            cardClass =
              'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-100';
          } else if (submitted && isRightAnswer) {
            cardClass =
              'border-emerald-500 bg-emerald-50 text-emerald-950 dark:border-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-100';
          } else if (submitted && isPicked && !isRightAnswer) {
            cardClass =
              'border-rose-400 bg-rose-50 text-rose-950 dark:border-rose-500 dark:bg-rose-950/50 dark:text-rose-100';
          } else if (submitted) {
            cardClass =
              'border-slate-200/70 bg-slate-50/50 text-slate-400 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-500';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={submitted}
              onClick={() => setSelectedOption(idx)}
              className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm font-medium transition ${cardClass}`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-current/20 text-xs font-bold">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1">
                <InlineMarkdown text={opt} />
              </span>
              {submitted && isRightAnswer && (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              )}
              {submitted && isPicked && !isRightAnswer && (
                <XCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback Banner */}
      {submitted && (
        <div
          className={`mt-4 rounded-2xl border p-4 text-sm leading-relaxed ${
            isCorrect
              ? 'border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-100'
              : 'border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-100'
          }`}
        >
          <p className="font-bold">
            {isCorrect ? 'Spot on!' : 'Not quite — here is why:'}
          </p>
          <p className="mt-1 opacity-95">
            <InlineMarkdown text={current.explanation} />
          </p>
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-5 flex justify-end">
        {!submitted ? (
          <button
            type="button"
            disabled={selectedOption === null}
            onClick={handleCheck}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Check Answer
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            {questionIdx + 1 < questions.length ? 'Next Question' : 'Finish Quiz'}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export const LearnPage: React.FC<LearnPageProps> = ({
  curriculum,
  labs,
  progress,
  selectedChapterId,
  selectedModuleId,
  onSelectChapter,
  onSelectModule,
  onCompleteChapter,
  onCompleteQuiz,
  onToggleBookmark,
  onOpenLab,
  onOpenGlossaryTerm,
}) => {
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [activeGlossaryModal, setActiveGlossaryModal] = useState<GlossaryTerm | null>(null);

  const completedChapterSet = useMemo(
    () => new Set(progress.completedChapters),
    [progress.completedChapters]
  );
  const bookmarkedSet = useMemo(
    () => new Set(progress.bookmarkedChapters),
    [progress.bookmarkedChapters]
  );

  // CHAPTER READER VIEW
  if (selectedChapterId) {
    const found = getChapterById(selectedChapterId);
    if (found) {
      const { module: mod, chapter } = found;
      const { prev, next } = getAdjacentChapters(chapter.id);
      const isRead = completedChapterSet.has(chapter.id);
      const isBookmarked = bookmarkedSet.has(chapter.id);
      const alreadyQuizzed = Boolean(progress.completedQuizzes[chapter.id]);
      const relatedLab = labs.find((l) => l.id === chapter.relatedLabId);
      const chapterGlossaryTerms = (chapter.glossaryTermIds || [])
        .map((id) => getGlossaryTermById(id))
        .filter((t): t is GlossaryTerm => Boolean(t));

      return (
        <div className="relative mx-auto max-w-4xl px-6 py-7">
          {/* Reader Top Utility Bar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onSelectChapter(null)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All Modules
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleBookmark(chapter.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  isBookmarked
                    ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <Bookmark
                  className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`}
                />
                {isBookmarked ? 'Saved' : 'Save'}
              </button>

              {!isRead ? (
                <button
                  type="button"
                  onClick={() => onCompleteChapter(chapter.id, Math.round(chapter.xpReward / 2))}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Mark as Read
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Completed
                </span>
              )}
            </div>
          </div>

          {/* Editorial Article Container */}
          <article className="space-y-7">
            {/* Editorial Header */}
            <header className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-white"
                  style={{ backgroundColor: mod.accentHex || '#10B981' }}
                >
                  Module {String(mod.number).padStart(2, '0')} &middot; {mod.title}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <Clock className="h-3.5 w-3.5" />
                  {chapter.readMinutes} min read
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                  <Sparkles className="h-3.5 w-3.5" />+{chapter.xpReward} XP
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white">
                {chapter.number}. <InlineMarkdown text={chapter.title} />
              </h1>
              <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                <InlineMarkdown text={chapter.summary} />
              </p>

              {/* Inline clickable glossary pills */}
              {chapterGlossaryTerms.length > 0 && (
                <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <BookMarked className="h-3.5 w-3.5" />
                    Key Terms (tap to define):
                  </span>
                  {chapterGlossaryTerms.map((term) => (
                    <button
                      key={term.id}
                      type="button"
                      onClick={() => setActiveGlossaryModal(term)}
                      className="rounded-full border border-emerald-200/80 bg-emerald-50/70 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-800/70 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/70"
                    >
                      {term.term}
                    </button>
                  ))}
                </div>
              )}
            </header>

            {/* Highlighted Everyday Analogy Card */}
            {chapter.analogy && (
              <section className="rounded-3xl border border-amber-200/90 bg-gradient-to-br from-amber-50/90 via-[#FFFDF5] to-orange-50/60 p-6 shadow-sm dark:border-amber-900/60 dark:from-amber-950/40 dark:via-slate-900 dark:to-orange-950/30">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-sm">
                    <Lightbulb className="h-5 w-5" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      Everyday Analogy
                    </p>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      <InlineMarkdown text={chapter.analogy.title} />
                    </h2>
                    <RichMarkdownBody
                      text={chapter.analogy.body}
                      className="space-y-2.5 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Structured Varsity Sections */}
            <div className="space-y-6 rounded-3xl border border-slate-200/90 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              {chapter.sections.map((sec, idx) => {
                const calloutStyle = sec.callout ? getCalloutStyle(sec.callout.type) : null;
                return (
                  <section
                    key={idx}
                    className={
                      idx > 0 ? 'border-t border-slate-100 pt-6 dark:border-slate-800/80' : ''
                    }
                  >
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                      <InlineMarkdown text={sec.heading} />
                    </h2>
                    <RichMarkdownBody
                      text={sec.body}
                      className="mt-3 space-y-3 text-[15.5px] leading-[1.8] text-slate-700 dark:text-slate-300"
                    />

                    {sec.callout && calloutStyle && (
                      <div className={`mt-5 rounded-2xl border p-4 ${calloutStyle.container}`}>
                        <div className="flex flex-wrap items-center gap-2">
                          {calloutStyle.icon}
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${calloutStyle.badge}`}
                          >
                            {calloutStyle.label}
                          </span>
                          <span className="text-sm font-bold">
                            <InlineMarkdown text={sec.callout.title} />
                          </span>
                        </div>
                        <RichMarkdownBody
                          text={sec.callout.body}
                          className="mt-2 space-y-2 text-sm leading-relaxed opacity-95"
                        />
                      </div>
                    )}
                  </section>
                );
              })}
            </div>

            {/* Key Takeaways */}
            {chapter.keyTakeaways.length > 0 && (
              <section className="rounded-3xl border border-emerald-200/80 bg-emerald-50/50 p-6 dark:border-emerald-900/60 dark:bg-emerald-950/25">
                <h3 className="flex items-center gap-2 text-base font-extrabold text-emerald-950 dark:text-emerald-200">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  Key Takeaways
                </h3>
                <ul className="mt-3 space-y-2.5">
                  {chapter.keyTakeaways.map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-800 dark:text-slate-200"
                    >
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                      <span>
                        <InlineMarkdown text={point} />
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Try This Hands-On in Lab CTA */}
            {relatedLab && (
              <section className="flex flex-col justify-between gap-4 rounded-3xl border border-blue-200/90 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-md sm:flex-row sm:items-center dark:border-blue-800/60">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide">
                    <FlaskConical className="h-3.5 w-3.5" />
                    Hands-On Practice Studio
                  </div>
                  <h3 className="text-lg font-extrabold">{relatedLab.title}</h3>
                  <p className="text-sm text-blue-100">{relatedLab.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenLab(relatedLab.id)}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-sm transition hover:bg-blue-50"
                >
                  Try This Hands-On in Lab
                  <ArrowRight className="h-4 w-4" />
                </button>
              </section>
            )}

            {/* Interactive End-of-Chapter Quiz */}
            <ChapterQuiz
              key={chapter.id}
              chapter={chapter}
              alreadyDone={alreadyQuizzed}
              relatedLab={relatedLab}
              onOpenLab={onOpenLab}
              onFinish={(score, total, xpEarned) =>
                onCompleteQuiz(chapter.id, score, total, xpEarned)
              }
              onNextChapter={next ? () => onSelectChapter(next.id) : undefined}
            />

            {/* Previous / Next Chapter Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
              {prev ? (
                <button
                  type="button"
                  onClick={() => onSelectChapter(prev.id)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="max-w-[220px] truncate">
                    <InlineMarkdown text={prev.title} />
                  </span>
                </button>
              ) : (
                <div />
              )}

              {next && (
                <button
                  type="button"
                  onClick={() => onSelectChapter(next.id)}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                >
                  <span className="max-w-[220px] truncate">
                    Next: <InlineMarkdown text={next.title} inverted />
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </article>

          {/* Inline Glossary Term Modal */}
          {activeGlossaryModal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
              onClick={() => setActiveGlossaryModal(null)}
            >
              <div
                className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {activeGlossaryModal.category}
                    </span>
                    <h3 className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
                      {activeGlossaryModal.term}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveGlossaryModal(null)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  <InlineMarkdown text={activeGlossaryModal.shortDef} />
                </p>

                <div className="mt-4 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-3.5 text-sm dark:border-amber-900/60 dark:bg-amber-950/35">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                    Everyday Analogy
                  </p>
                  <p className="mt-1 text-slate-800 dark:text-slate-200">
                    <InlineMarkdown text={activeGlossaryModal.analogy} />
                  </p>
                </div>

                <div className="mt-3 rounded-2xl border border-blue-200/80 bg-blue-50/70 p-3.5 text-sm dark:border-blue-900/60 dark:bg-blue-950/35">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-blue-700 dark:text-blue-400">
                    Example
                  </p>
                  <p className="mt-1 text-slate-800 dark:text-slate-200">
                    <InlineMarkdown text={activeGlossaryModal.example} />
                  </p>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const termText = activeGlossaryModal.term;
                      setActiveGlossaryModal(null);
                      onOpenGlossaryTerm(termText);
                    }}
                    className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Open in Glossary
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveGlossaryModal(null)}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                  >
                    Got it
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
  }

  // MODULE LIBRARY VIEW
  const visibleModules = curriculum.modules.filter((mod) => {
    if (selectedModuleId && mod.id !== selectedModuleId) return false;
    if (onlyBookmarked) {
      return mod.chapters.some((ch) => bookmarkedSet.has(ch.id));
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-7">
      {/* Filter Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onSelectModule(null);
              setOnlyBookmarked(false);
            }}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              !selectedModuleId && !onlyBookmarked
                ? 'bg-slate-900 text-white dark:bg-emerald-600'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
            }`}
          >
            All 7 Modules
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectModule(null);
              setOnlyBookmarked((v) => !v);
            }}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              onlyBookmarked
                ? 'bg-amber-500 text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            Saved ({progress.bookmarkedChapters.length})
          </button>

          {curriculum.modules.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setOnlyBookmarked(false);
                onSelectModule(selectedModuleId === m.id ? null : m.id);
              }}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                selectedModuleId === m.id
                  ? 'text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
              }`}
              style={
                selectedModuleId === m.id
                  ? { backgroundColor: m.accentHex || '#10B981' }
                  : undefined
              }
            >
              0{m.number}
            </button>
          ))}
        </div>
      </div>

      {/* Empty bookmarked state */}
      {visibleModules.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <Bookmark className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
          <h3 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
            No saved chapters yet
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Tap the Save icon while reading any chapter to keep it handy for quick review.
          </p>
          <button
            type="button"
            onClick={() => setOnlyBookmarked(false)}
            className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Browse All Modules
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {visibleModules.map((mod) => {
            const chaptersToShow = onlyBookmarked
              ? mod.chapters.filter((ch) => bookmarkedSet.has(ch.id))
              : mod.chapters;
            const doneCount = mod.chapters.filter((c) => completedChapterSet.has(c.id)).length;
            const linkedLab = labs.find((l) => l.id === mod.recommendedLabId);

            return (
              <section
                key={mod.id}
                className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                {/* Module Accent Header */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: mod.accentHex || '#10B981' }}
                />
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 p-6 dark:border-slate-800">
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm"
                      style={{ backgroundColor: mod.accentHex || '#10B981' }}
                    >
                      <ModuleIcon name={mod.icon} className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Module {String(mod.number).padStart(2, '0')}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {doneCount}/{mod.chapters.length} complete
                        </span>
                        <span className="text-xs text-slate-400">
                          &middot; ~{mod.estimatedMinutes} min
                        </span>
                      </div>
                      <h2 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
                        {mod.title}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {mod.subtitle}
                      </p>
                    </div>
                  </div>

                  {linkedLab && (
                    <button
                      type="button"
                      onClick={() => onOpenLab(linkedLab.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                    >
                      <FlaskConical className="h-3.5 w-3.5" />
                      Lab: {linkedLab.title}
                    </button>
                  )}
                </div>

                {/* Chapters List */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {chaptersToShow.map((ch) => {
                    const isDone = completedChapterSet.has(ch.id);
                    const isSaved = bookmarkedSet.has(ch.id);
                    const quizRecord = progress.completedQuizzes[ch.id];

                    return (
                      <div
                        key={ch.id}
                        className="flex flex-col justify-between gap-3 px-6 py-4 transition hover:bg-slate-50/80 sm:flex-row sm:items-center dark:hover:bg-slate-800/40"
                      >
                        <button
                          type="button"
                          onClick={() => onSelectChapter(ch.id)}
                          className="flex flex-1 items-start gap-3.5 text-left"
                        >
                          <div
                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                              isDone
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {isDone ? <CheckCircle2 className="h-4 w-4" /> : ch.number}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                              <InlineMarkdown text={ch.title} />
                            </h3>
                            <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                              <InlineMarkdown text={ch.summary} />
                            </p>
                            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                              <span className="inline-flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {ch.readMinutes} min
                              </span>
                              <span>&middot;</span>
                              <span className="font-semibold text-amber-700 dark:text-amber-400">
                                +{ch.xpReward} XP
                              </span>
                              {quizRecord && (
                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                  Quiz {quizRecord.score}/{quizRecord.total}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>

                        <div className="flex shrink-0 items-center gap-2 pl-11 sm:pl-0">
                          <button
                            type="button"
                            onClick={() => onToggleBookmark(ch.id)}
                            title={isSaved ? 'Remove bookmark' : 'Bookmark chapter'}
                            className={`rounded-lg p-2 transition ${
                              isSaved
                                ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/50'
                                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800'
                            }`}
                          >
                            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-amber-500' : ''}`} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onSelectChapter(ch.id)}
                            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/60"
                          >
                            <BookOpen className="h-3.5 w-3.5" />
                            {isDone ? 'Review' : 'Read'}
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};
