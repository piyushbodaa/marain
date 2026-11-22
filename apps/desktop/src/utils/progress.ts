import type { ApiSettings, UserProgress } from '../types/ipc';

const STORAGE_KEY = 'zero2ai_studio_progress_v1';

export const DEFAULT_API_CONFIG: ApiSettings = {
  mode: 'practice',
  provider: 'gemini',
  apiKey: '',
  model: 'gemini-2.5-flash',
  ollamaUrl: 'http://localhost:11434',
};

export function createDefaultProgress(): UserProgress {
  return {
    xp: 0,
    streakDays: 1,
    lastActiveDate: null,
    completedChapters: [],
    completedQuizzes: {},
    completedLabs: [],
    bookmarkedChapters: [],
    lastChapterId: null,
    theme: 'light',
    checklistDismissed: false,
    apiConfig: { ...DEFAULT_API_CONFIG },
  };
}

export interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  nextXp: number | null;
  progressPct: number;
  xpToNext: number;
}

const LEVELS: Array<{ level: number; title: string; minXp: number }> = [
  { level: 1, title: 'Curious Beginner', minXp: 0 },
  { level: 2, title: 'Prompt Explorer', minXp: 150 },
  { level: 3, title: 'Token Whisperer', minXp: 400 },
  { level: 4, title: 'Agent Architect', minXp: 750 },
  { level: 5, title: 'AI Builder', minXp: 1200 },
];

export function getLevelInfo(xp: number): LevelInfo {
  let current = LEVELS[0];
  let next: { level: number; title: string; minXp: number } | null = LEVELS[1];

  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].minXp) {
      current = LEVELS[i];
      next = LEVELS[i + 1] ?? null;
    }
  }

  if (!next) {
    return {
      level: current.level,
      title: current.title,
      minXp: current.minXp,
      nextXp: null,
      progressPct: 100,
      xpToNext: 0,
    };
  }

  const span = next.minXp - current.minXp;
  const gained = Math.max(0, xp - current.minXp);
  return {
    level: current.level,
    title: current.title,
    minXp: current.minXp,
    nextXp: next.minXp,
    progressPct: Math.min(100, Math.round((gained / span) * 100)),
    xpToNext: Math.max(0, next.minXp - xp),
  };
}

export function getTodayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function updateStreakOnActivity(progress: UserProgress): {
  streakDays: number;
  lastActiveDate: string;
} {
  const today = getTodayIso();
  if (!progress.lastActiveDate) {
    return { streakDays: Math.max(1, progress.streakDays), lastActiveDate: today };
  }
  if (progress.lastActiveDate === today) {
    return { streakDays: Math.max(1, progress.streakDays), lastActiveDate: today };
  }

  const prev = new Date(`${progress.lastActiveDate}T00:00:00`);
  const curr = new Date(`${today}T00:00:00`);
  const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return { streakDays: progress.streakDays + 1, lastActiveDate: today };
  }
  return { streakDays: 1, lastActiveDate: today };
}

export function normalizeProgress(raw: Partial<UserProgress> | null | undefined): UserProgress {
  const base = createDefaultProgress();
  if (!raw || typeof raw !== 'object') return base;

  return {
    xp: typeof raw.xp === 'number' && Number.isFinite(raw.xp) ? Math.max(0, raw.xp) : base.xp,
    streakDays:
      typeof raw.streakDays === 'number' && raw.streakDays >= 1
        ? raw.streakDays
        : base.streakDays,
    lastActiveDate: typeof raw.lastActiveDate === 'string' ? raw.lastActiveDate : null,
    completedChapters: Array.isArray(raw.completedChapters)
      ? Array.from(new Set(raw.completedChapters.filter((v): v is string => typeof v === 'string')))
      : [],
    completedQuizzes:
      raw.completedQuizzes && typeof raw.completedQuizzes === 'object' ? raw.completedQuizzes : {},
    completedLabs: Array.isArray(raw.completedLabs)
      ? Array.from(new Set(raw.completedLabs.filter((v): v is string => typeof v === 'string')))
      : [],
    bookmarkedChapters: Array.isArray(raw.bookmarkedChapters)
      ? Array.from(new Set(raw.bookmarkedChapters.filter((v): v is string => typeof v === 'string')))
      : [],
    lastChapterId: typeof raw.lastChapterId === 'string' ? raw.lastChapterId : null,
    theme: raw.theme === 'dark' ? 'dark' : 'light',
    checklistDismissed: Boolean(raw.checklistDismissed),
    apiConfig: {
      ...DEFAULT_API_CONFIG,
      ...(raw.apiConfig && typeof raw.apiConfig === 'object' ? raw.apiConfig : {}),
    },
  };
}

export async function loadPersistedProgress(): Promise<UserProgress> {
  try {
    if (window.zero2ai?.loadProgress) {
      const fromDisk = await window.zero2ai.loadProgress();
      if (fromDisk) {
        return normalizeProgress(fromDisk);
      }
    }
  } catch {
    // Fall back to localStorage
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return normalizeProgress(JSON.parse(raw));
    }
  } catch {
    // Ignore parse/storage errors
  }

  return createDefaultProgress();
}

export async function savePersistedProgress(progress: UserProgress): Promise<void> {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota errors
  }

  try {
    if (window.zero2ai?.saveProgress) {
      await window.zero2ai.saveProgress(progress);
    }
  } catch {
    // Ignore IPC errors in web preview
  }
}
