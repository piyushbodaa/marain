import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { CURRICULUM, getAllChapters, getChapterById } from './data/curriculum';
import { LAB_REGISTRY, type LabId } from './labs';
import type { ApiSettings, UserProgress } from './types/ipc';
import {
  createDefaultProgress,
  loadPersistedProgress,
  savePersistedProgress,
  updateStreakOnActivity,
} from './utils/progress';
import { Sidebar, type NavSection } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { HomeDashboard } from './components/HomeDashboard';
import { LearnPage } from './components/LearnPage';
import { LabHostPage } from './components/LabHostPage';
import { GlossaryPage } from './components/GlossaryPage';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => createDefaultProgress());
  const [hydrated, setHydrated] = useState(false);

  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [activeLabId, setActiveLabId] = useState<LabId | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [glossarySearch, setGlossarySearch] = useState('');
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const [xpPulseKey, setXpPulseKey] = useState(0);
  const [xpToast, setXpToast] = useState<string | null>(null);
  const [justCompletedLabId, setJustCompletedLabId] = useState<LabId | null>(null);

  const mainScrollRef = useRef<HTMLDivElement | null>(null);

  // Hydrate persisted progress on mount
  useEffect(() => {
    let active = true;
    loadPersistedProgress().then((loaded) => {
      if (active) {
        setProgress(loaded);
        setHydrated(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Persist progress changes after hydration
  useEffect(() => {
    if (!hydrated) return;
    savePersistedProgress(progress);
  }, [progress, hydrated]);

  // Apply light/dark Tailwind class on documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (progress.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [progress.theme]);

  // Scroll main viewport to top on view/chapter switch
  useEffect(() => {
    mainScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeSection, selectedChapterId, activeLabId]);

  const showToast = useCallback((message: string) => {
    setXpToast(message);
    setXpPulseKey((k) => k + 1);
    setTimeout(() => {
      setXpToast((curr) => (curr === message ? null : curr));
    }, 3200);
  }, []);

  const totalChapters = useMemo(() => getAllChapters().length, []);

  const handleOpenChapter = useCallback((chapterId: string) => {
    setSelectedChapterId(chapterId);
    setActiveSection('learn');
    setProgress((prev) => ({ ...prev, lastChapterId: chapterId }));
  }, []);

  const handleOpenModule = useCallback((moduleId: string) => {
    setSelectedChapterId(null);
    setSelectedModuleId(moduleId);
    setActiveSection('learn');
  }, []);

  const handleSelectLab = useCallback((labId: LabId) => {
    setActiveLabId(labId);
    setJustCompletedLabId(null);
    setActiveSection('lab');
  }, []);

  const handleCompleteChapter = useCallback(
    (chapterId: string, xpReward: number) => {
      setProgress((prev) => {
        if (prev.completedChapters.includes(chapterId)) return prev;
        const streak = updateStreakOnActivity(prev);
        return {
          ...prev,
          xp: prev.xp + xpReward,
          streakDays: streak.streakDays,
          lastActiveDate: streak.lastActiveDate,
          completedChapters: [...prev.completedChapters, chapterId],
          lastChapterId: chapterId,
        };
      });
      showToast(`Chapter marked read! +${xpReward} XP`);
    },
    [showToast]
  );

  const handleCompleteQuiz = useCallback(
    (chapterId: string, score: number, total: number, xpEarned: number) => {
      let deltaXp = 0;
      setProgress((prev) => {
        const alreadyDone = Boolean(prev.completedQuizzes[chapterId]);
        const alreadyRead = prev.completedChapters.includes(chapterId);
        deltaXp = alreadyDone ? 0 : xpEarned;
        const streak = updateStreakOnActivity(prev);
        return {
          ...prev,
          xp: prev.xp + deltaXp,
          streakDays: streak.streakDays,
          lastActiveDate: streak.lastActiveDate,
          completedChapters: alreadyRead
            ? prev.completedChapters
            : [...prev.completedChapters, chapterId],
          completedQuizzes: {
            ...prev.completedQuizzes,
            [chapterId]: {
              score: Math.max(score, prev.completedQuizzes[chapterId]?.score ?? 0),
              total,
              xpEarned: Math.max(xpEarned, prev.completedQuizzes[chapterId]?.xpEarned ?? 0),
            },
          },
          lastChapterId: chapterId,
        };
      });
      if (deltaXp > 0) {
        showToast(`Quiz complete (${score}/${total})! +${deltaXp} XP`);
      }
    },
    [showToast]
  );

  const handleCompleteLab = useCallback(
    (labId: LabId, xp: number) => {
      let awarded = false;
      setProgress((prev) => {
        if (prev.completedLabs.includes(labId)) {
          return prev;
        }
        awarded = true;
        const streak = updateStreakOnActivity(prev);
        return {
          ...prev,
          xp: prev.xp + xp,
          streakDays: streak.streakDays,
          lastActiveDate: streak.lastActiveDate,
          completedLabs: [...prev.completedLabs, labId],
        };
      });
      setJustCompletedLabId(labId);
      if (awarded) {
        showToast(`Lab completed! +${xp} XP`);
      }
    },
    [showToast]
  );

  const handleToggleBookmark = useCallback((chapterId: string) => {
    setProgress((prev) => {
      const exists = prev.bookmarkedChapters.includes(chapterId);
      return {
        ...prev,
        bookmarkedChapters: exists
          ? prev.bookmarkedChapters.filter((id) => id !== chapterId)
          : [...prev.bookmarkedChapters, chapterId],
      };
    });
  }, []);

  const handleToggleTheme = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  }, []);

  const handleSaveApiConfig = useCallback((nextConfig: ApiSettings) => {
    setProgress((prev) => ({
      ...prev,
      apiConfig: nextConfig,
    }));
  }, []);

  const handleResetProgress = useCallback(() => {
    setProgress((prev) => ({
      ...createDefaultProgress(),
      theme: prev.theme,
      apiConfig: prev.apiConfig,
    }));
    setJustCompletedLabId(null);
    showToast('Progress reset — fresh start!');
  }, [showToast]);

  const activeLab = useMemo(
    () => LAB_REGISTRY.find((l) => l.id === activeLabId) ?? LAB_REGISTRY[0],
    [activeLabId]
  );

  const headerMeta = useMemo(() => {
    if (activeSection === 'home') {
      return {
        title: 'Home Learning Path',
        subtitle: CURRICULUM.tagline,
      };
    }
    if (activeSection === 'learn') {
      if (selectedChapterId) {
        const found = getChapterById(selectedChapterId);
        if (found) {
          return {
            title: `Module ${String(found.module.number).padStart(2, '0')} · ${found.module.title}`,
            subtitle: `Chapter ${found.chapter.number}: ${found.chapter.title}`,
          };
        }
      }
      return {
        title: 'Varsity Chapters & Quizzes',
        subtitle: 'Plain-English AI modules designed for zero coding background',
      };
    }
    if (activeSection === 'lab' && activeLab) {
      return {
        title: activeLab.title,
        subtitle: activeLab.subtitle,
      };
    }
    if (activeSection === 'glossary') {
      return {
        title: 'AI Glossary',
        subtitle: `${CURRICULUM.glossary.length} everyday definitions & analogies`,
      };
    }
    return {
      title: 'API & Learning Mode',
      subtitle: 'Practice Mode (Free) or Bring Your Own Key / Local Ollama',
    };
  }, [activeSection, selectedChapterId, activeLab]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAFAF7] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Left Navigation Sidebar */}
      <Sidebar
        activeSection={activeSection}
        activeLabId={activeLabId}
        labs={LAB_REGISTRY}
        progress={progress}
        totalChapters={totalChapters}
        totalGlossaryTerms={CURRICULUM.glossary.length}
        onSelectSection={(sec) => {
          setActiveSection(sec);
          if (sec === 'learn') {
            setSelectedChapterId(null);
          }
        }}
        onSelectLab={handleSelectLab}
      />

      {/* Right Workspace Column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          title={headerMeta.title}
          subtitle={headerMeta.subtitle}
          progress={progress}
          xpPulseKey={xpPulseKey}
          onToggleTheme={handleToggleTheme}
          onOpenSettings={() => {
            if (activeSection === 'lab') {
              setSettingsModalOpen(true);
            } else {
              setActiveSection('settings');
            }
          }}
        />

        {/* Main Content Viewport */}
        <main
          ref={mainScrollRef}
          className={`min-h-0 flex-1 ${activeSection === 'lab' ? 'overflow-hidden' : 'overflow-y-auto'}`}
        >
          {activeSection === 'home' && (
            <HomeDashboard
              curriculum={CURRICULUM}
              labs={LAB_REGISTRY}
              progress={progress}
              onOpenChapter={handleOpenChapter}
              onOpenModule={handleOpenModule}
              onOpenLab={handleSelectLab}
              onDismissChecklist={() =>
                setProgress((prev) => ({ ...prev, checklistDismissed: true }))
              }
            />
          )}

          {activeSection === 'learn' && (
            <LearnPage
              curriculum={CURRICULUM}
              labs={LAB_REGISTRY}
              progress={progress}
              selectedChapterId={selectedChapterId}
              selectedModuleId={selectedModuleId}
              onSelectChapter={(id) => {
                setSelectedChapterId(id);
                if (id) {
                  setProgress((prev) => ({ ...prev, lastChapterId: id }));
                }
              }}
              onSelectModule={setSelectedModuleId}
              onCompleteChapter={handleCompleteChapter}
              onCompleteQuiz={handleCompleteQuiz}
              onToggleBookmark={handleToggleBookmark}
              onOpenLab={handleSelectLab}
              onOpenGlossaryTerm={(termText) => {
                setGlossarySearch(termText);
                setActiveSection('glossary');
              }}
            />
          )}

          {activeSection === 'lab' && activeLab && (
            <LabHostPage
              lab={activeLab}
              allLabs={LAB_REGISTRY}
              completedLabs={progress.completedLabs}
              apiConfig={progress.apiConfig}
              justCompletedLabId={justCompletedLabId}
              onCompleteLab={handleCompleteLab}
              onSelectLab={handleSelectLab}
              onOpenSettings={() => setSettingsModalOpen(true)}
              onBackHome={() => setActiveSection('home')}
            />
          )}

          {activeSection === 'glossary' && (
            <GlossaryPage terms={CURRICULUM.glossary} initialSearch={glossarySearch} />
          )}

          {activeSection === 'settings' && (
            <SettingsModal
              apiConfig={progress.apiConfig}
              onSaveConfig={handleSaveApiConfig}
              onResetProgress={handleResetProgress}
            />
          )}
        </main>
      </div>

      {/* Settings Overlay Modal when triggered inside a Lab */}
      {settingsModalOpen && (
        <SettingsModal
          asModal
          apiConfig={progress.apiConfig}
          onSaveConfig={handleSaveApiConfig}
          onResetProgress={handleResetProgress}
          onClose={() => setSettingsModalOpen(false)}
        />
      )}

      {/* Floating XP Toast */}
      {xpToast && (
        <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-xl">
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span>{xpToast}</span>
        </div>
      )}
    </div>
  );
}
