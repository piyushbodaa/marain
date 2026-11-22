import rawCurriculum from './curriculum.json';
import type {
  Chapter,
  CurriculumData,
  CurriculumModule,
  GlossaryTerm,
  LabMetadata,
} from '../types/curriculum';

export const CURRICULUM: CurriculumData = rawCurriculum as CurriculumData;

export function getAllChapters(): Chapter[] {
  return CURRICULUM.modules.flatMap((mod) => mod.chapters);
}

export function getModuleById(moduleId: string): CurriculumModule | undefined {
  return CURRICULUM.modules.find((m) => m.id === moduleId);
}

export function getChapterById(chapterId: string): {
  module: CurriculumModule;
  chapter: Chapter;
  flatIndex: number;
} | null {
  let idx = 0;
  for (const mod of CURRICULUM.modules) {
    for (const ch of mod.chapters) {
      if (ch.id === chapterId) {
        return { module: mod, chapter: ch, flatIndex: idx };
      }
      idx++;
    }
  }
  return null;
}

export function getAdjacentChapters(chapterId: string): {
  prev: Chapter | null;
  next: Chapter | null;
} {
  const all = getAllChapters();
  const idx = all.findIndex((c) => c.id === chapterId);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}

export function getNextRecommendedChapter(
  completedChapters: string[],
  lastChapterId: string | null
): { module: CurriculumModule; chapter: Chapter } | null {
  const completed = new Set(completedChapters);

  if (lastChapterId && !completed.has(lastChapterId)) {
    const found = getChapterById(lastChapterId);
    if (found) return { module: found.module, chapter: found.chapter };
  }

  for (const mod of CURRICULUM.modules) {
    for (const ch of mod.chapters) {
      if (!completed.has(ch.id)) {
        return { module: mod, chapter: ch };
      }
    }
  }

  const firstMod = CURRICULUM.modules[0];
  if (firstMod && firstMod.chapters[0]) {
    return { module: firstMod, chapter: firstMod.chapters[0] };
  }
  return null;
}

export function getGlossaryTermById(termId: string): GlossaryTerm | undefined {
  return CURRICULUM.glossary.find((g) => g.id === termId);
}

export function getLabMetadataById(labId: string): LabMetadata | undefined {
  return CURRICULUM.labs.find((l) => l.id === labId);
}
