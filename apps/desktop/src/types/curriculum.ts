export type CalloutType = 'tip' | 'myth' | 'example' | 'warning';

export interface ChapterAnalogy {
  title: string;
  body: string;
}

export interface SectionCallout {
  type: CalloutType;
  title: string;
  body: string;
}

export interface ChapterSection {
  heading: string;
  body: string;
  callout?: SectionCallout | null;
}

export type QuizQuestionType = 'multiple_choice' | 'true_false' | 'spot_mistake';

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Chapter {
  id: string;
  moduleId: string;
  number: number;
  title: string;
  readMinutes: number;
  xpReward: number;
  summary: string;
  analogy: ChapterAnalogy;
  sections: ChapterSection[];
  keyTakeaways: string[];
  glossaryTermIds: string[];
  relatedLabId?: string | null;
  quiz: QuizQuestion[];
}

export interface CurriculumModule {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  icon: string;
  accentHex: string;
  estimatedMinutes: number;
  recommendedLabId?: string | null;
  chapters: Chapter[];
}

export type GlossaryCategory =
  | 'foundations'
  | 'tokens'
  | 'money'
  | 'agents'
  | 'cli'
  | 'building';

export interface GlossaryTerm {
  id: string;
  term: string;
  shortDef: string;
  analogy: string;
  category: GlossaryCategory;
  example: string;
}

export interface LabMetadata {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'Beginner' | 'Hands-On' | 'Builder' | string;
  estimatedMinutes: number;
  xpReward: number;
  moduleId: string;
  description: string;
}

export interface CurriculumData {
  version: string;
  appName: string;
  tagline: string;
  modules: CurriculumModule[];
  glossary: GlossaryTerm[];
  labs: LabMetadata[];
}
