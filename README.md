# Zero2AI — From Zero to Building with AI

**Zero2AI** is an interactive learning suite inspired by **Zerodha Varsity** (warm, editorial, jargon-free chapters) and **Duolingo** (streaks, XP, bite-sized quizzes, and hands-on practice) — designed for complete beginners with **zero coding background**.

Go from *"What even is an LLM?"* to understanding tokens, AI credits, API keys, harnesses, Claude Code CLI, and **building and exporting your first real Website and App with AI**.

---

## Monorepo Architecture

```text
.
├── packages/curriculum/   # Single source of truth: 7 modules, 28 chapters, quizzes, 40+ glossary terms
├── apps/desktop/          # Zero2AI Studio — Linux Desktop App (Electron + React + TS + Vite + Tailwind)
└── apps/android/          # Zero2AI Varsity — Native Android App (Kotlin + Jetpack Compose + Material 3)
```

### 7 Zero-to-One Curriculum Modules

| # | Module | Key Concepts | Hands-On Desktop Lab |
|---|--------|--------------|----------------------|
| 01 | **What Even Is AI?** | AI vs regular software, LLMs & next-token prediction, model families (Claude, Gemini, GPT, open-weights), chat apps vs raw models | Tokenizer & Context Desk |
| 02 | **Tokens, Context & Talking to AI** | Subword tokens, context window ("working desk"), system prompts & temperature, hallucinations & verification | Tokenizer & Context Desk |
| 03 | **AI Credits, Pricing & API Keys** | $20 chat subscriptions vs pay-as-you-go API credits, API keys, `.env` safety, free local models (Ollama) | API Keys & Credits Lab |
| 04 | **AI Harnesses, Tools & Agents** | Model vs Harness ("engine vs car"), tool calling & MCP, agent loops, `CLAUDE.md` rules & skills | Harness & Agent Simulator |
| 05 | **Using Claude Code & AI CLIs** | Fear-free terminal basics, Claude Code CLI, reviewing diffs & undoing safely with Git, `/compact` | Claude Code CLI Dojo |
| 06 | **Build a Website with AI** | HTML/CSS/JS basics, mini-specs vs vague prompts, iterating live, publishing online for free | Website Builder Studio |
| 07 | **Build an App with AI** | Websites vs stateful apps, MVP steps, debugging errors without knowing code, backups & shipping | App Builder Studio |

---

## 1. Linux Desktop App — Zero2AI Studio (`apps/desktop/`)

**Zero2AI Studio** combines the full Varsity Reader + Duolingo Quizzes + AI Glossary with **6 interactive Try & Build Labs**:

1. **Tokenizer & Context Window Lab** — Live BPE-like token visualizer & visual context "working desk" slider.
2. **API Keys & AI Credits Lab** — Interactive model pricing calculator, Spot-the-Leaked-Key game, and live/simulated API call inspector.
3. **AI Harness & Agent Simulator** — Compare a Raw Model vs Model + Harness with step-by-step tool calls and human-in-the-loop approval.
4. **Claude Code CLI Dojo** — Safe beginner terminal missions + real Linux sandbox restricted to `~/Zero2AI-Projects`.
5. **Website Builder Studio** — Structured prompt builder, live desktop/mobile preview, iterative AI edits, plain-English code explanations, and one-click export to `~/Zero2AI-Projects/`.
6. **App Builder Studio** — Build interactive stateful mini-apps, try the "Debug Like a Pro" bug-fix challenge, and export standalone working apps to disk.

> **100% Free Practice Mode by default**: No API key or credit card required. You can optionally switch to **Real AI Mode (BYOK)** in **API & Mode Settings** using Google Gemini, Anthropic Claude, OpenAI, or free local **Ollama**. Your keys stay strictly on your own computer.

### Download / Run Pre-Built Linux Artifacts

Packaged Linux artifacts are built into `apps/desktop/release/`:

- **AppImage (portable single-file executable):**
  ```bash
  chmod +x "apps/desktop/release/Zero2AI Studio-1.0.0.AppImage"
  "./apps/desktop/release/Zero2AI Studio-1.0.0.AppImage"
  ```
- **Tarball archive (`tar.gz`):**
  ```bash
  mkdir -p /tmp/zero2ai-studio
  tar -xzf "apps/desktop/release/zero2ai-studio-1.0.0.tar.gz" -C /tmp/zero2ai-studio
  /tmp/zero2ai-studio/zero2ai-studio-1.0.0/zero2ai-studio
  ```
- **Unpacked Linux binary (for quick local testing):**
  ```bash
  ./apps/desktop/release/linux-unpacked/zero2ai-studio
  ```
  *(If running inside a restricted container/sandbox without kernel user namespaces, pass `--no-sandbox`.)*

### Build & Develop the Desktop App from Source

Prerequisites: **Node.js 20+** and **npm**.

```bash
# 1. Build & validate the shared curriculum
npm run build:curriculum
npm run test:curriculum

# 2. Install desktop dependencies and sync curriculum.json
cd apps/desktop
npm install
npm run sync-curriculum

# 3. Run in development mode (Vite + Electron)
npm run dev

# Or preview the renderer in a regular browser
npm run dev:web

# 4. Type-check and build production bundles
npm run build

# 5. Package downloadable Linux AppImage & tar.gz into apps/desktop/release/
npm run package:linux
```

#### macOS & Windows Packaging Readiness

`apps/desktop/package.json` already configures `electron-builder` targets for macOS (`dmg`, `zip`) and Windows (`nsis`, `portable`). On a macOS or Windows host, run:
```bash
npx electron-builder --mac
npx electron-builder --win
```

---

## 2. Android Mobile App — Zero2AI Varsity (`apps/android/`)

**Zero2AI Varsity** is a native offline-first Android companion built with **Kotlin, Jetpack Compose, and Material 3**:

- Clean **Varsity Editorial Reader** with Light, Warm Sepia, and Dark themes + adjustable font sizes.
- Interactive **Duolingo-style Chapter Quizzes** with instant plain-English explanations, XP, levels, and daily streaks.
- Searchable **AI Glossary** with category chips and inline tap-to-define bottom sheets.
- Offline **Saved Bookmarks** and local progress persistence.

### Build, Test & Install the Android APK

```bash
# Sync latest shared curriculum JSON into Android assets
cd apps/android
./sync-curriculum.sh

# Run JVM unit tests & assemble debug APK
./gradlew testDebugUnitTest assembleDebug

# Install onto a connected Android device or emulator
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

Compiled debug APK path:
`apps/android/app/build/outputs/apk/debug/app-debug.apk`

---

## 3. Shared Curriculum Package (`packages/curriculum/`)

All educational content is authored once in `packages/curriculum/` and compiled to `packages/curriculum/dist/curriculum.json`.

```bash
cd packages/curriculum
npm run build   # Generates dist/curriculum.json
npm test        # Validates 7 modules, >=28 chapters, quizzes, >=40 glossary terms, and 6 lab links
```
