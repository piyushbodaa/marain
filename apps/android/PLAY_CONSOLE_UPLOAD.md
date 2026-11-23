# Marain — Google Play Console Upload & Direct Install Guide

Everything needed to publish **Marain** (`app.marain.learn`, v1.2.0 / versionCode 4) — *Learn Marain: The Language of AI* — to Google Play Console and install it immediately on any Android 8.0+ phone.

---

## 1. Signed Release Artifacts

| Artifact | Path | Purpose |
| --- | --- | --- |
| **Play Store Bundle (`.aab`)** | `apps/android/app/build/outputs/bundle/release/app-release.aab` | Upload to Google Play Console (Internal / Closed / Production tracks) |
| **Signed Direct APK (`.apk`)** | `apps/android/app/build/outputs/apk/release/app-release.apk` | Sideload directly onto Android phones via USB (`adb`) or file transfer |
| **Debug APK (`.apk`)** | `apps/android/app/build/outputs/apk/debug/app-debug.apk` | Local development / debugging |

> **Keystore Backup Reminder (Critical!)**
> Your upload signing key lives at `apps/android/marain-upload.jks` with credentials in `apps/android/keystore.properties` (alias: `marain-upload`).
> Both files are gitignored (`apps/android/.gitignore`) so secrets are never committed. **Back up both files immediately** to an encrypted password manager or offline drive — you need the exact same upload key to publish future updates on Google Play (unless you request an upload key reset via Play App Signing).

---

## 2. Ready-to-Paste Google Play Store Listing

- **App Name**: `Marain`
- **Package ID**: `app.marain.learn`
- **Category**: `Education`
- **Pricing**: Free (No ads, no in-app purchases)
- **Short Description** *(75 / 80 characters)*:
  ```text
  Learn Marain — the language of AI. Bite-sized lessons, flashcards & drills.
  ```
- **Full Description**:
  ```text
  Learn Marain — The Language of AI.

  Everyone around you suddenly speaks a new language: LLMs, tokens, context windows, API keys, harnesses, MCP, and Claude Code. Marain takes you from A1 First Contact to C2 Fluent Builder in 5 minutes a day — 100% offline, with zero tech background required.

  READ LIKE VARSITY. PRACTICE LIKE DUOLINGO.
  • Winding Language Path (7 Units · 28 Lessons): Follow a clear stepping-stone path from A1 to C2 with color-coded Unit Guidebooks, daily 50 XP goals, and streaks.
  • Practice Drills with Hearts & Combos: 84 interactive Multiple Choice, Myth Buster, and Spot-the-Mistake drills with instant plain-English explanations, 5 Hearts (free instant recharge), and combo streak bonuses.
  • Interactive AI Phrasebook & Flashcards: Master 50 essential AI terms across 6 categories—browse searchable plain-English definitions or flip interactive Flashcards to earn XP.
  • Calm Editorial Reader: Every chapter opens with a memorable Everyday Analogy plus Pro Tips, Myth Busters, Examples, and Warnings—with live Light, Warm Sepia, and Dark themes plus S / M / L text sizing.
  • CEFR Fluency Ladder & Milestones: Track your progression across A1 First Contact, A2 Signal Listener, B1 Key Bearer, B2 Terminal Speaker, C1 Web Shaper, and C2 Fluent Builder.

  7 COMPLETE UNITS
  1. What Even Is AI? (LLMs, next-token prediction, Claude, Gemini, GPT, open weights)
  2. Tokens, Context & Talking to AI (tokens, working desk context, prompts, temperature, hallucinations)
  3. AI Credits, Pricing & API Keys (subscriptions vs credits, APIs, keeping .env keys safe)
  4. AI Harnesses, Tools & Agents (model vs harness, tool calling, MCP, agent loops, CLAUDE.md)
  5. Mastering Terminal AI & Claude Code CLI (safe CLI habits, diffs, git safety, /compact)
  6. Building a Website with AI (scoping, iterating, responsive checks, shipping)
  7. Building Your First App with AI (feature specs, debugging loops, launching cleanly)

  100% OFFLINE & PRIVATE
  No login, no ads, no trackers. Everything lives on your device so you can learn anywhere.
  ```

---

## 3. Privacy Policy & Google Play Data Safety Facts

Use these exact facts when completing the **App Content → Data Safety** form in Play Console:

- **Does your app collect or share any of the required user data types?** → **No**
- **Account creation required?** → **No** (zero sign-up, zero backend servers)
- **Network / Permissions**: **100% offline** — requires zero dangerous permissions; the full curriculum is bundled inside the app.
- **On-device storage**: Reading progress, CEFR fluency rank, XP, daily goals, streaks, mastered flashcards, bookmarks, and reading preferences are stored strictly locally on the user's device inside `marain_learn_prefs.xml` (`SharedPreferences`) and are never transmitted anywhere. Android cloud backup (`allowBackup="false"`) and device-to-device transfer are explicitly disabled across API 26–36, and an offline Privacy Policy is built directly into the app (`Saved` and `Progress` tabs).
- **Ads / Analytics / Third-party SDKs**: None.

---

## 4. Upload to Google Play Console (Internal Testing)

1. Sign in to [Google Play Console](https://play.google.com/console) and click **Create app**.
2. Enter **App name**: `Marain`, **Default language**: English (United States), **App or game**: App, **Free or paid**: Free.
3. Complete the initial **Set up your app** checklist (Privacy policy URL, App access: all functionality available without login, Ads: No, Content rating questionnaire, Target audience, Data safety).
4. In the left sidebar, open **Testing → Internal testing** and click **Create new release**.
5. Under **App signing**, opt in to **Play App Signing** (recommended by Google Play).
6. Drag and drop `apps/android/app/build/outputs/bundle/release/app-release.aab` into **App bundles**.
7. Set **Release name**: `1.2.0 (4)` and **Release notes**:
   ```text
   v1.2.0 — Rebuilt Unit 1 as a crisp 5-minute phone-only experience with practical Mastery Checks across all 7 units; gated CEFR fluency milestones on real mastery instead of clicks; balanced quiz options so answers cannot be guessed by length; fixed API key, budget, and permissions safety advice; added direct Lesson 1 and Start/Continue CTA navigation; and upgraded Dark Mode contrast to WCAG AA.
   ```
8. Click **Next → Save → Publish to Internal testing**, then add tester Gmail addresses under the **Testers** tab and share the opt-in link.

---

## 5. One-Command Automatic Upload (Play Developer API)

Once `app.marain.learn` exists in Google Play Console (and the first `.aab` has been uploaded once manually), you can upload future releases from the terminal in one command using the zero-dependency uploader (`apps/android/publish-internal.sh` → `apps/android/scripts/publish-play.mjs`).

### One-Time Credential Setup (NEVER commit keys!)
1. In Google Cloud Console, enable the **Google Play Android Developer API** (`androidpublisher.googleapis.com`), create a service account, and download its JSON key.
2. In Google Play Console → **Users and permissions**, invite that service account's email and grant **View app information** + **Release to testing tracks** (or Release manager) on **Marain**.
3. Save the downloaded JSON key to:
   ```text
   apps/android/play-service-account.json
   ```
   *(Explicitly gitignored in both root `.gitignore` and `apps/android/.gitignore` along with `*service-account*.json` and `*-play-key.json` so credentials can never be pushed to GitHub. You can also pass `--key <path>` or set `PLAY_SERVICE_ACCOUNT_JSON`.)*

### Common Commands (run from `apps/android/`)

```bash
# 1. Dry run — verify version parsing, release notes (<= 500 chars), key, and AAB with zero network calls
./publish-internal.sh --dry-run --skip-build --notes "v1.2.0 internal test"

# 2. Upload the already-built signed v1.2.0 (4) bundle directly to Internal Testing
./publish-internal.sh --skip-build --notes "v1.2.0 — Rebuilt Unit 1, mastery checks, balanced quizzes, and WCAG AA dark mode."

# 3. Auto-increment versionCode, rebuild curriculum + tests + signed AAB, and upload to Internal Testing
./publish-internal.sh --bump --notes "v1.2.1 — Bug fixes and polish"

# 4. Optional flags: change versionName, choose another track, or upload as draft on a brand-new draft app
./publish-internal.sh --bump --version-name 1.3.0 --track beta --notes "v1.3.0 beta release"
./publish-internal.sh --skip-build --status draft --notes "v1.2.0 draft internal release"
```

---

## 6. Direct Install on Your Android Phone (Right Now)

**Option A — Over USB with `adb`:**
```bash
adb install -r "apps/android/app/build/outputs/apk/release/app-release.apk"
```

**Option B — Copy APK directly to phone:**
1. Copy `apps/android/app/build/outputs/apk/release/app-release.apk` to your phone (USB, Drive, or LocalSend).
2. Tap the file on your phone and allow **Install unknown apps** for your file manager.
3. Launch **Marain** from your home screen — works immediately offline!

---

## 7. Rebuilding Signed Releases Locally

```bash
cd apps/android
./sync-curriculum.sh
./gradlew testDebugUnitTest testReleaseUnitTest bundleRelease assembleRelease assembleDebug --no-daemon
```
