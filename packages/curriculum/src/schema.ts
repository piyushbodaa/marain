export type LabId =
  | 'tokenizer'
  | 'api-credits'
  | 'harness-agent'
  | 'claude-cli'
  | 'website-builder'
  | 'app-builder';

export type CalloutType = 'tip' | 'myth' | 'example' | 'warning';

export type QuizQuestionType = 'multiple_choice' | 'true_false' | 'spot_mistake';

export type GlossaryCategory =
  | 'foundations'
  | 'tokens'
  | 'money'
  | 'agents'
  | 'cli'
  | 'building';

export type LabDifficulty = 'Beginner' | 'Hands-On' | 'Builder';

export interface Analogy {
  title: string;
  body: string;
}

export interface Callout {
  type: CalloutType;
  title: string;
  body: string;
}

export interface ChapterSection {
  heading: string;
  body: string;
  callout: Callout | null;
}

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
  analogy: Analogy;
  sections: ChapterSection[];
  keyTakeaways: string[];
  glossaryTermIds: string[];
  relatedLabId: LabId | null;
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
  recommendedLabId: LabId;
  chapters: Chapter[];
}

export interface GlossaryTerm {
  id: string;
  term: string;
  shortDef: string;
  analogy: string;
  category: GlossaryCategory;
  example: string;
}

export interface LabInfo {
  id: LabId;
  title: string;
  subtitle: string;
  difficulty: LabDifficulty;
  estimatedMinutes: number;
  xpReward: number;
  moduleId: string;
  description: string;
}

export interface Curriculum {
  version: string;
  appName: string;
  tagline: string;
  modules: CurriculumModule[];
  glossary: GlossaryTerm[];
  labs: LabInfo[];
}
