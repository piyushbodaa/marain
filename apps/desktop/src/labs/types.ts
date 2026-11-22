import type React from 'react';

export type LabId =
  | 'tokenizer'
  | 'api-credits'
  | 'harness-agent'
  | 'claude-cli'
  | 'website-builder'
  | 'app-builder';

export type ApiProvider = 'openai' | 'anthropic' | 'gemini' | 'ollama';

export interface ApiConfig {
  mode: 'practice' | 'byok';
  provider: ApiProvider;
  apiKey: string;
  model: string;
  ollamaUrl: string;
}

export interface LabProps {
  onCompleteLab: (labId: LabId, xp: number) => void;
  completedLabs: string[];
  apiConfig: ApiConfig;
  onOpenSettings: () => void;
}

export interface LabDefinition {
  id: LabId;
  title: string;
  subtitle: string;
  badge: string;
  xpReward: number;
  component: React.FC<LabProps>;
}

export interface ExportProjectResult {
  ok: boolean;
  path: string;
  error?: string;
  simulated?: boolean;
}

export interface OpenPathResult {
  ok: boolean;
  error?: string;
}

export interface SafeCommandResult {
  ok: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
  cwd: string;
  simulated?: boolean;
}

export interface ProviderCallRequest {
  provider: ApiProvider;
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
  simulated?: boolean;
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
  isDesktopApp?: boolean;
}

export interface Zero2AIBridgeAPI {
  exportProject?: (
    folderName: string,
    files: Record<string, string>
  ) => Promise<ExportProjectResult>;
  openPath?: (targetPath: string) => Promise<OpenPathResult>;
  runSafeCommand?: (command: string, cwd?: string) => Promise<SafeCommandResult>;
  testProviderCall?: (req: ProviderCallRequest) => Promise<ProviderCallResponse>;
  getEnvironmentInfo?: () => Promise<EnvironmentInfo>;
}
