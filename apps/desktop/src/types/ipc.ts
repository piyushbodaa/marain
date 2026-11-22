export type ProviderId = 'openai' | 'anthropic' | 'gemini' | 'ollama';

export interface ApiSettings {
  mode: 'practice' | 'byok';
  provider: ProviderId;
  apiKey: string;
  model: string;
  ollamaUrl: string;
}

export interface UserProgress {
  xp: number;
  streakDays: number;
  lastActiveDate: string | null; // YYYY-MM-DD
  completedChapters: string[];
  completedQuizzes: Record<string, { score: number; total: number; xpEarned: number }>;
  completedLabs: string[];
  bookmarkedChapters: string[];
  lastChapterId: string | null;
  theme: 'light' | 'dark';
  checklistDismissed: boolean;
  apiConfig: ApiSettings;
}

export interface ExportProjectResult {
  ok: boolean;
  path: string;
  error?: string;
}

export interface OpenPathResult {
  ok: boolean;
}

export interface SafeCommandResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
  cwd: string;
}

export interface ProviderCallRequest {
  provider: ProviderId;
  apiKey?: string;
  baseUrl?: string;
  model: string;
  systemPrompt?: string;
  prompt: string;
}

export interface ProviderCallResponse {
  ok: boolean;
  text?: string;
  inputTokens?: number;
  outputTokens?: number;
  latencyMs?: number;
  rawStatus?: number;
  error?: string;
}

export interface EnvironmentInfo {
  platform: string;
  homeDir: string;
  defaultWorkspace: string;
  installedTools: {
    node: boolean;
    git: boolean;
    claude: boolean;
    ollama: boolean;
  };
}

export interface Zero2AIBridge {
  exportProject: (
    folderName: string,
    files: Record<string, string>
  ) => Promise<ExportProjectResult>;
  openPath: (targetPath: string) => Promise<OpenPathResult>;
  runSafeCommand: (command: string, cwd?: string) => Promise<SafeCommandResult>;
  testProviderCall: (req: ProviderCallRequest) => Promise<ProviderCallResponse>;
  getEnvironmentInfo: () => Promise<EnvironmentInfo>;
  loadProgress: () => Promise<UserProgress | null>;
  saveProgress: (progress: UserProgress) => Promise<void>;
}

declare global {
  interface Window {
    zero2ai?: Zero2AIBridge;
  }
}
