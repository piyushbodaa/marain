# Marain — The Language of AI

**Marain** is a mastery-first, offline-first AI learning suite inspired by **Zerodha Varsity** (calm, editorial, jargon-free chapters) and **Duolingo** (practice drills, daily XP goals, and streaks) — built for complete beginners with **zero coding background**.

Go from *"What even is an LLM?"* to understanding tokens, context windows, AI credits, API keys, harnesses, MCP, terminal AI, and **building and shipping your first real Website and App with AI** (CEFR A1 → C2).

- **Website:** [https://marain.fun](https://marain.fun) *(Android currently in internal testing)*
- **Privacy Policy:** [https://marain.fun/privacy](https://marain.fun/privacy)
- **Repository:** [https://github.com/piyushbodaa/marain](https://github.com/piyushbodaa/marain) (MIT License)

---

## Monorepo Architecture

```text
.
├── packages/curriculum/   # Single source of truth: 7 units, 28 chapters, 84 drills, 7 Unit Mastery Checks, 50 Phrasebook terms
├── apps/android/          # Marain Android App (app.marain.learn) — Kotlin + Jetpack Compose + Material 3 (100% offline)
├── apps/marain-web/       # Official public website & Privacy Policy deployed to https://marain.fun
└── apps/desktop/          # Zero2AI Studio — Desktop Companion (Electron + React + TS + Vite + Tailwind) with 6 hands-on labs
```

### 7 Fluency Units (A1 → C2)

| # | Unit | Key Concepts | Hands-On Desktop Lab |
|---|------|--------------|----------------------|
| 01 | **What Even Is AI?** | 5-minute phone-only intro: AI vs regular software, LLMs & next-token prediction, model families (Claude, Gemini, GPT, open weights), chat apps vs raw models | Tokenizer & Context Desk |
| 02 | **Tokens, Context & Talking to AI** | Subword tokens, context window ("working desk"), system prompts & temperature, hallucinations & verification | Tokenizer & Context Desk |
| 03 | **AI Credits, Pricing & API Keys** | $20 chat subscriptions vs pay-as-you-go API credits, API keys, `.env` safety, free local models (Ollama) | API Keys & Credits Lab |
| 04 | **AI Harnesses, Tools & Agents** | Model vs Harness ("engine vs car"), tool calling & MCP, agent loops, `CLAUDE.md` rules & skills | Harness & Agent Simulator |
| 05 | **Using Claude Code & AI CLIs** | Fear-free terminal basics, Claude Code CLI, reviewing diffs & undoing safely with Git, `/compact` | Claude Code CLI Dojo |
| 06 | **Build a Website with AI** | HTML/CSS/JS basics, mini-specs vs vague prompts, iterating live, publishing online for free | Website Builder Studio |
| 07 | **Build an App with AI** | Websites vs stateful apps, MVP steps, debugging errors without knowing code, backups & shipping | App Builder Studio |

---

## 1. Android Mobile App — Marain (`apps/android/`)

**Marain** (`app.marain.learn`, v1.2.0) is a native, **100% offline** Android app built with **Kotlin, Jetpack Compose, and Material 3**:

- **Mastery-First Learning**: Crisp 5-minute phone-only Unit 1 plus practical **Unit Mastery Checks** across all 7 units.
- **CEFR A1 → C2 Unlocked by Mastery**: Fluency milestones unlock when you prove understanding, while XP, daily 50 XP goals, and streaks track daily practice.
- **84 Balanced Practice Drills & 50-Term Phrasebook**: Instant plain-English explanations, searchable AI dictionary, and tap-to-flip flashcards.
- **WCAG AA Editorial Reading Themes**: Lora serif & Plus Jakarta Sans typography in Light Paper, Warm Sepia, and Dark Obsidian with S / M / L font sizing.
- **Private by Design**: Zero `INTERNET` permission, zero ads, zero trackers, local-only `SharedPreferences` storage, and disabled Android cloud/device-to-device backups (`allowBackup="false"`). See [Privacy Policy](https://marain.fun/privacy).

### Build & Test the Android App Locally

Marain for Android is currently in internal testing (see [https://marain.fun](https://marain.fun)). To build and test locally:

```bash
# Sync latest shared curriculum JSON into Android assets
cd apps/android
./sync-curriculum.sh

# Run JVM unit tests & assemble debug APK
./gradlew testDebugUnitTest assembleDebug --no-daemon

# Install onto a connected Android device or emulator
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

See [apps/android/PLAY_CONSOLE_UPLOAD.md](apps/android/PLAY_CONSOLE_UPLOAD.md) for signed release builds and Google Play Console upload steps.

---

## 2. Official Website (`apps/marain-web/`)

Static site auto-deployed on Vercel from `main` to **[https://marain.fun](https://marain.fun)**:

- `/` (`index.html`) — Public Marain landing page (no test APKs published)
- `/privacy` (`privacy.html`) — Public Privacy Policy aligned with the in-app offline Privacy Policy
- Legacy routes `/marain`, `/marain/index.html`, `/marain/privacy`, and `/marain/privacy.html` permanently redirect (`301`) to `/` and `/privacy`.

---

## 3. Linux Desktop App — Zero2AI Studio (`apps/desktop/`)

**Zero2AI Studio** combines the full editorial Reader + Quizzes + AI Glossary with **6 interactive Try & Build Labs**:

1. **Tokenizer & Context Window Lab** — Live BPE-like token visualizer & visual context "working desk" slider.
2. **API Keys & AI Credits Lab** — Interactive model pricing calculator, Spot-the-Leaked-Key game, and live/simulated API call inspector.
3. **AI Harness & Agent Simulator** — Compare a Raw Model vs Model + Harness with step-by-step tool calls and human-in-the-loop approval.
4. **Claude Code CLI Dojo** — Safe beginner terminal missions + real Linux sandbox restricted to `~/Zero2AI-Projects`.
5. **Website Builder Studio** — Structured prompt builder, live desktop/mobile preview, iterative AI edits, plain-English code explanations, and one-click export to `~/Zero2AI-Projects/`.
6. **App Builder Studio** — Build interactive stateful mini-apps, try the "Debug Like a Pro" bug-fix challenge, and export standalone working apps to disk.

> **100% Free Practice Mode by default**: No API key or credit card required. You can optionally switch to **Real AI Mode (BYOK)** in **API & Mode Settings** using Google Gemini, Anthropic Claude, OpenAI, or free local **Ollama**. Your keys stay strictly on your own computer.

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

`apps/desktop/package.json` configures `electron-builder` targets for macOS (`dmg`, `zip`) and Windows (`nsis`, `portable`). On a macOS or Windows host, run:
```bash
npx electron-builder --mac
npx electron-builder --win
```

---

## 4. Shared Curriculum Package (`packages/curriculum/`)

All educational content is authored once in `packages/curriculum/` and compiled to `packages/curriculum/dist/curriculum.json`.

```bash
cd packages/curriculum
npm run build   # Generates dist/curriculum.json
npm test        # Validates 7 modules, >=28 chapters, quizzes, mastery checks, glossary terms, and 6 lab links
```

---

## License

This project is licensed under the [MIT License](LICENSE).
