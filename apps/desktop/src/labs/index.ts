import type { LabDefinition } from './types';
import { TokenizerLab } from './TokenizerLab';
import { ApiCreditsLab } from './ApiCreditsLab';
import { HarnessAgentLab } from './HarnessAgentLab';
import { ClaudeCliLab } from './ClaudeCliLab';
import { WebsiteBuilderLab } from './WebsiteBuilderLab';
import { AppBuilderLab } from './AppBuilderLab';

export type {
  LabId,
  ApiConfig,
  LabProps,
  LabDefinition,
  ApiProvider,
  ExportProjectResult,
  OpenPathResult,
  SafeCommandResult,
  ProviderCallRequest,
  ProviderCallResponse,
  EnvironmentInfo,
  Zero2AIBridgeAPI,
} from './types';

export {
  exportProject,
  openPath,
  runSafeCommand,
  testProviderCall,
  getEnvironmentInfo,
  isDesktopBridgeAvailable,
  isByokReady,
  buildProviderCallRequest,
} from './bridge';

export {
  TokenizerLab,
  ApiCreditsLab,
  HarnessAgentLab,
  ClaudeCliLab,
  WebsiteBuilderLab,
  AppBuilderLab,
};

export const LAB_REGISTRY: LabDefinition[] = [
  {
    id: 'tokenizer',
    title: 'Tokenizer & Context Desk',
    subtitle: 'See how AI chunks text into tokens and what happens when its working desk overflows.',
    badge: 'Foundations',
    xpReward: 75,
    component: TokenizerLab,
  },
  {
    id: 'api-credits',
    title: 'AI Credits & API Keys Lab',
    subtitle: 'Compare $20 plans vs pay-as-you-go tokens, spot leaked keys, and inspect a live API call.',
    badge: 'Money & Safety',
    xpReward: 75,
    component: ApiCreditsLab,
  },
  {
    id: 'harness-agent',
    title: 'Model vs Harness Simulator',
    subtitle: 'Toggle file & terminal tools to watch an AI agent loop with human-in-the-loop approvals.',
    badge: 'Agents',
    xpReward: 80,
    component: HarnessAgentLab,
  },
  {
    id: 'claude-cli',
    title: 'Claude Code CLI Dojo',
    subtitle: 'Zero-fear guided terminal & Claude Code workflow plus a safe Linux command sandbox.',
    badge: 'CLI & Git',
    xpReward: 90,
    component: ClaudeCliLab,
  },
  {
    id: 'website-builder',
    title: 'Website Builder Studio',
    subtitle: 'Assemble structured prompts, generate & iterate live, read plain-English code, and export.',
    badge: 'Build a Website',
    xpReward: 100,
    component: WebsiteBuilderLab,
  },
  {
    id: 'app-builder',
    title: 'Stateful App Builder Studio',
    subtitle: 'Build a real data-driven mini-app, inspect saved state, squash a live bug, and export.',
    badge: 'Build an App',
    xpReward: 100,
    component: AppBuilderLab,
  },
];
