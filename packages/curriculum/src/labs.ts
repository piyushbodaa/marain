import type { LabInfo } from './schema.ts';

export const LABS: LabInfo[] = [
  {
    id: 'tokenizer',
    title: 'Token & Context Playground',
    subtitle: 'See how AI slices text into tokens and fills its working desk',
    difficulty: 'Beginner',
    estimatedMinutes: 10,
    xpReward: 75,
    moduleId: 'mod-2-tokens-prompts',
    description:
      'Type any sentence, emoji, or code snippet to watch how AI breaks words into numbered chunks called tokens. Then slide a conversation length bar to see a model context window fill up and push older messages off the desk.'
  },
  {
    id: 'api-credits',
    title: 'API Keys & AI Credits Lab',
    subtitle: 'Compare subscriptions vs. pay-as-you-go pricing and spot leaked keys',
    difficulty: 'Beginner',
    estimatedMinutes: 10,
    xpReward: 75,
    moduleId: 'mod-3-credits-keys',
    description:
      'Calculate how far $5 of AI credits actually stretches across Gemini, Claude, GPT, and free local Ollama models. Play the Spot-the-Leaked-Key safety challenge and inspect a live or simulated API request header by header.'
  },
  {
    id: 'harness-agent',
    title: 'Harness & Agent Simulator',
    subtitle: 'Compare a raw text-only model against an AI agent with real tools',
    difficulty: 'Hands-On',
    estimatedMinutes: 12,
    xpReward: 80,
    moduleId: 'mod-4-harnesses-agents',
    description:
      'Toggle capabilities like CLAUDE.md instructions, file reading, editing, and terminal tests on or off. Run a realistic bug-fix mission side by side to watch why a raw model can only give advice while a harnessed agent actually solves the task step by step.'
  },
  {
    id: 'claude-cli',
    title: 'Claude Code CLI Dojo',
    subtitle: 'Practice terminal commands, diff approvals, and safe undo without fear',
    difficulty: 'Hands-On',
    estimatedMinutes: 15,
    xpReward: 90,
    moduleId: 'mod-5-claude-cli',
    description:
      'Follow 6 bite-sized interactive missions in a zero-risk terminal dojo—from pwd and ls to starting Claude Code, reviewing red-and-green diffs, compacting long chats, and undoing changes safely with Git.'
  },
  {
    id: 'website-builder',
    title: 'Website Builder Studio',
    subtitle: 'Turn a structured mini-spec into a live website and export it to disk',
    difficulty: 'Builder',
    estimatedMinutes: 15,
    xpReward: 100,
    moduleId: 'mod-6-build-website',
    description:
      'Fill in a clear mini-spec for a portfolio, local cafe, or event page, watch your structured prompt assemble, generate a responsive site, iterate live with plain-English requests, inspect annotated HTML/CSS/JS, and export the finished folder.'
  },
  {
    id: 'app-builder',
    title: 'App Builder & Debug Studio',
    subtitle: 'Build a real stateful app, inject a bug, and fix it like a pro',
    difficulty: 'Builder',
    estimatedMinutes: 15,
    xpReward: 100,
    moduleId: 'mod-7-build-app',
    description:
      'Go beyond static pages by creating a working Habit Tracker, Expense Splitter, or Flashcard app that remembers data across reloads. Then trigger a realistic bug, read the console clue, and watch AI patch it cleanly.'
  }
];
