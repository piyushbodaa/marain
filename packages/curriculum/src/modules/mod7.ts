import type { CurriculumModule } from '../schema.ts';

export const MODULE_7: CurriculumModule = {
  id: 'mod-7-build-app',
  number: 7,
  title: 'Build an App with AI',
  subtitle: 'Step up from static pages to real interactive apps with state, storage, fearless debugging, and safe shipping.',
  icon: 'smartphone',
  accentHex: '#F97316',
  estimatedMinutes: 18,
  recommendedLabId: 'app-builder',
  chapters: [
    {
      id: 'ch-7-1',
      moduleId: 'mod-7-build-app',
      number: 1,
      title: 'Website vs. App: State, Storage & Backends Explained',
      readMinutes: 4,
      xpReward: 35,
      summary:
        'A brochure website shows the same page to everyone. A real app responds to taps, updates live data (State), and remembers it tomorrow (Storage). Learn when you need a backend—and when you do not!',
      analogy: {
        title: 'The Printed Menu vs. The Live Order Whiteboard',
        body: 'A static website is a printed cafe menu taped in the window: every passerby reads the exact same dishes and prices. An **app** is the live order whiteboard inside the kitchen: customers add items, check off finished drinks, see updated totals instantly (**State**), and save today’s tallies in a ledger (**Storage**) so nothing vanishes if the power blinks.'
      },
      sections: [
        {
          heading: 'What turns a webpage into a real app: State + Storage',
          body: 'You can build genuinely useful personal apps—Habit Trackers, Expense Splitters, Flashcard Decks, Pomodoro Timers, Budget Planners—using the exact same HTML, CSS, and JavaScript from Unit 6! Two new concepts power the leap:\n\n• **State**: The app’s live memory right now (for example, your list of habits, which boxes are checked today, and your streak count). Whenever you tap a button, JavaScript updates State and immediately redraws the screen to match.\n• **Storage**: Saving that State somewhere permanent so refreshing the browser does NOT wipe out your habits. For non-sensitive, single-person tools, your browser already includes **`localStorage`**—zero server required!',
          callout: {
            type: 'example',
            title: 'Watching State and Storage team up',
            body: '1. You type "Drink 2L Water" and tap Add.\n2. JavaScript appends that habit to your `habits` array (**State**).\n3. The UI redraws to display the new row.\n4. JavaScript saves the updated list into `localStorage` (**Storage**) so tomorrow morning your habit is still right there!'
          }
        },
        {
          heading: 'Frontend vs. Backend: when do you actually need a server?',
          body: 'Beginners often assume every app requires cloud databases and login systems. Here is the clean boundary:\n\n• **Frontend-only (HTML/CSS/JS + `localStorage`) is ENOUGH when**: The app is for one person on their own device storing non-sensitive data (Habit Tracker, Flashcards, Calculator, Dinner Splitter). Free, fast, and easy to build!\n• **Add a Backend server + Database when**: Multiple people share data across devices, OR you need user logins, payments, or **paid AI API calls**—because secret API keys MUST stay server-side, never in browser code or `localStorage` (where CORS, XSS, and browser extensions expose them)!',
          callout: {
            type: 'warning',
            title: 'Never store secret API keys in browser code or `localStorage`',
            body: 'A public web page should NEVER ship your secret API key—nor ask casual visitors to paste live API keys into browser `localStorage` where malicious scripts or extensions can read them. Keep paid keys on a backend server (or in trusted native/local apps using the OS keychain).'
          }
        },
        {
          heading: 'Meet "Backend-in-a-Box" when you are ready for Version 2',
          body: 'Whenever your app outgrows `localStorage` and genuinely needs accounts or multi-device sync, platforms like **Supabase** or **Firebase** provide ready-made authentication and cloud databases. Just remember one critical security rule: **always enable strict access rules** (such as Row Level Security so users can only read and edit their own rows)—never leave a cloud database open to public read/write!',
          callout: {
            type: 'myth',
            title: 'Myth Buster: "An app only counts if it is in an app store"',
            body: 'A responsive web app works on Android, iPhone, Linux, Mac, and Windows immediately from one link—and visitors can even tap "Add to Home Screen" so it launches with an icon like a native app!'
          }
        }
      ],
      keyTakeaways: [
        'Apps differ from brochure websites by managing live changing data (**State**) and persisting it across reloads (**Storage**).',
        'Single-user personal tools storing non-sensitive data work wonderfully with browser `localStorage`—zero backend required.',
        'Paid AI API keys, accounts, and shared data belong on a backend server with strict access rules (like Row Level Security)—never in public browser JS or `localStorage`.'
      ],
      glossaryTermIds: ['state', 'local-storage', 'frontend-backend', 'javascript'],
      relatedLabId: null,
      quiz: [
        {
          id: 'q-7-1-1',
          type: 'multiple_choice',
          question: 'If you build a Daily Habit Tracker and forget to save its state to `localStorage` (or a database), what happens when the user refreshes the page?',
          options: [
            'The browser automatically saves every checkbox inside `styles.css` as a fallback.',
            'The user is redirected to a 404 page until a paid cloud database is connected.',
            'Only habits added within the last sixty seconds are kept while older ones vanish.',
            'All added habits and checkmarks reset back to the empty starting state.'
          ],
          correctIndex: 3,
          explanation:
            'In-memory State lives only while the page stays open. Saving State to `localStorage` (or a database) persists user data safely across page reloads!'
        },
        {
          id: 'q-7-1-2',
          type: 'true_false',
          question:
            'Every interactive personal utility app—like a Flashcard deck or Dinner Bill Splitter—requires a paid cloud backend server and login screen.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! Frontend-only apps using browser `localStorage` run completely free with zero servers and zero logins for non-sensitive personal utilities.'
        },
        {
          id: 'q-7-1-3',
          type: 'spot_mistake',
          question:
            'Priya builds a public AI web app and avoids setting up a backend by putting her OpenAI key into browser `localStorage`—or telling visitors to paste their own keys into `localStorage`. Spot the security problem.',
          options: [
            'Browser `localStorage` can only store numbers and rejects API keys containing hyphens.',
            'HTTPS websites are legally prohibited from using `localStorage` unless a database is attached.',
            'Browser code and `localStorage` are exposed to visitors, XSS, and extensions—keep paid keys server-side.',
            'Putting a key in `localStorage` works safely only if you rename the file from `app.js` to `config.js`.'
          ],
          correctIndex: 2,
          explanation:
            'Anything in a browser (source files or `localStorage`) is exposed to the visitor, XSS scripts, and extensions—and many providers also block direct browser calls via CORS. Keep paid keys on a backend server (or OS keychain in trusted local apps).'
        }
      ]
    },
    {
      id: 'ch-7-2',
      moduleId: 'mod-7-build-app',
      number: 2,
      title: 'Breaking an App Idea into Tiny MVP Steps',
      readMinutes: 4,
      xpReward: 35,
      summary:
        'The secret to building real apps with AI without getting overwhelmed is radical smallness: shrink your dream app into a tiny Minimum Viable Product (MVP) and stack one working slice at a time.',
      analogy: {
        title: 'Build the Skateboard Before the Sports Car',
        body: 'Imagine wanting a better way to commute across town. If you spend six months manufacturing just one car door and one leather seat, you still have to walk to work! Build a simple rolling **skateboard** on Day 1 (MVP)—it gets you moving today. Next week add handlebars (scooter), then pedals (bicycle), and only later add the engine.'
      },
      sections: [
        {
          heading: 'Why huge "build me Uber in one prompt" requests collapse',
          body: 'When beginners ask AI *"Build a full fitness app with user logins, social feed, AI meal scanner, push notifications, Stripe billing, and smartwatch sync,"* the AI tries to juggle twenty interlocking systems at once. Dozens of files appear, half the buttons are fake stubs, and when something breaks you have zero clue where to look.\n\nInstead, top AI builders shrink the idea to its beating heart—the **MVP (Minimum Viable Product)**: the smallest working version that actually solves ONE core problem cleanly.',
          callout: {
            type: 'example',
            title: 'Shrinking a "Dream Expense App" into a 15-minute MVP',
            body: 'Dream wish-list: Bank sync, receipt OCR camera, 12 currencies, group chats, monthly PDF tax exports.\n**Crisp MVP (Version 1)**:\n1. Add an expense (Item name + Amount + Who paid).\n2. Show the clean list of expenses + total spent.\n3. Calculate "Who owes whom" equally with one tap.\n4. Save automatically in `localStorage` + a Reset Trip button.'
          }
        },
        {
          heading: 'The 3-Slice Build Ladder',
          body: 'Once your MVP fits on 4 bullet points, build it in three calm, testable slices—never jumping to Slice 2 until Slice 1 genuinely works when you tap it:\n\n• **Slice 1 (Data + Core Action)**: Can I add an item and see it appear on screen?\n• **Slice 2 (Persistence + Polish)**: Does it survive hitting Refresh (`localStorage`), let me delete/check off items, and look crisp on mobile?\n• **Slice 3 (One Delightful Extra)**: Add a search filter, dark mode, CSV export, or summary card!',
          callout: {
            type: 'tip',
            title: 'Write a 3-line "Data Model" in plain English',
            body: 'Telling AI what ONE item looks like works wonders: *"Each Habit item has: an `id`, a `name` (text), `completedToday` (true/false), and `streak` (number)."* Clear data shapes produce cleaner, more reliable apps!'
          }
        },
        {
          heading: 'Save a working checkpoint after EVERY single slice',
          body: 'Finished Slice 1 and the Add button works smoothly? Check `git status` and save a clean Git commit! Now Slice 2 is stress-free—because even if Slice 2 gets weird, your working Slice 1 is safely locked in history.',
          callout: {
            type: 'myth',
            title: 'Myth Buster: "Simple MVPs feel cheap or boring"',
            body: 'Think of the best tools you actually open every day—a crisp checklist, a clean timer, a fast bill splitter. People LOVE focused tools that do one job effortlessly without clutter!'
          }
        }
      ],
      keyTakeaways: [
        'An MVP (Minimum Viable Product) strips your idea down to the single core loop that actually solves the problem today.',
        'Build in 3 small testable slices (Core Action -> Persistence & Polish -> One Delightful Extra), testing buttons after every slice.',
        'Describing your item’s data fields in 2–3 lines of plain English makes AI-generated app code dramatically cleaner.'
      ],
      glossaryTermIds: ['mvp', 'state', 'mini-spec', 'commit'],
      relatedLabId: null,
      quiz: [
        {
          id: 'q-7-2-1',
          type: 'multiple_choice',
          question: 'You want to build a Study Flashcards app with AI. Which scope is the best MVP for Version 1?',
          options: [
            'Multiplayer leaderboards, live voice tutoring rooms, Stripe subscriptions, and a 3D avatar store.',
            'Add a card, tap to flip, mark known/again, and save locally.',
            'A full cloud backend with accounts and admin panels first.',
            'A static webpage with fifty hardcoded cards and no way to flip or track progress.'
          ],
          correctIndex: 1,
          explanation:
            'A focused V1 nails the real study loop immediately—you can actually study with it today and layer extra features on safely tomorrow!'
        },
        {
          id: 'q-7-2-2',
          type: 'true_false',
          question:
            'You should test that Slice 1 works properly by tapping the buttons before asking AI to pile Slice 2 and Slice 3 on top.',
          options: ['True', 'False'],
          correctIndex: 0,
          explanation:
            'True! Verifying each small slice keeps bugs tiny, obvious, and effortless to fix.'
        },
        {
          id: 'q-7-2-3',
          type: 'spot_mistake',
          question:
            'Marcus asks AI to generate a complete 15-feature restaurant booking platform in one single giant prompt, and gets tangled broken screens. What strategy would have succeeded?',
          options: [
            'Scoping a tiny 4-bullet MVP and building one tested slice at a time.',
            'Re-prompting all 15 features at temperature 0.0.',
            'Skipping `localStorage` and building a cloud database first.',
            'Adding thirty more optional features to the prompt so the AI has richer context about the restaurant.'
          ],
          correctIndex: 0,
          explanation:
            'Big-bang prompts multiply complexity exponentially. Small MVP slices + plain-English data descriptions + testing each step is how reliable apps get built.'
        }
      ]
    },
    {
      id: 'ch-7-3',
      moduleId: 'mod-7-build-app',
      number: 3,
      title: 'Debugging Without Knowing Code (Error Messages Are Clues!)',
      readMinutes: 5,
      xpReward: 35,
      summary:
        'Seeing red error text does not mean you failed—it means your computer just handed you a treasure map! Learn the calm 3-step debugging loop anyone can use without knowing how to code.',
      analogy: {
        title: 'The Mechanic’s Check-Engine Code',
        body: 'When the check-engine light turns on in your car, you do not have to be a mechanical engineer to handle it. A scanner plugs in and prints an exact clue: `Code P0302: Spark plug cylinder 2 misfire`. Even if you have never held a wrench, handing that exact code to a mechanic saves hours of guessing. Browser console errors work the exact same way when handing clues to AI!'
      },
      sections: [
        {
          heading: 'Red error text is your best friend, not an insult',
          body: 'Every beginner freezes the first time a button stops responding or a block of angry red text flashes in the Console. Take a slow breath and reframe it: **silent bugs are hard; loud red error messages are a gift!**\n\nInside any browser’s Developer Tools (**Console** tab), almost every error hands you three priceless facts:\n\n1. **What went wrong** (e.g., `TypeError: Cannot read properties of null`)\n2. **Which exact file** (e.g., `app.js`)\n3. **Which exact line number** (e.g., `line 42`)',
          callout: {
            type: 'example',
            title: 'Translating a scary error into plain English',
            body: 'Raw error: `TypeError: Cannot read properties of null (reading "value") at app.js:42`\nPlain English: *"On line 42 of app.js, the code tried to read text from an input box it could not find—usually a small mismatch between the HTML ID and the JavaScript lookup!"*'
          }
        },
        {
          heading: 'The Calm 3-Step Non-Coder Debugging Loop',
          body: 'Whenever something breaks in an app you are building with AI, follow this exact 3-step recipe:\n\n1. **Reproduce & Notice**: Write down the exact tap that broke it (*"When I leave the Amount box blank and tap Split, the total turns into `NaN`"*).\n2. **Grab the Exact Clue**: Copy the exact red error message (removing any tokens/secrets if present) plus a screenshot if the layout looks strange.\n3. **Ask AI to Diagnose FIRST, Patch SECOND**: Paste the error and say: *"Here is what I tapped and the exact error. First explain in 2 simple sentences why this happened, then apply the smallest possible fix without changing unrelated features."*',
          callout: {
            type: 'tip',
            title: 'Quick phone exercise: spot the bug from the clue',
            body: 'If your console says `TypeError: Cannot read properties of null at app.js:42` right when you tap Submit, you already know where to look—line 42 of `app.js` is referencing an HTML element ID that does not match!'
          }
        },
        {
          heading: 'What to do if a fix does not work on try #1',
          body: 'If AI tries one fix and the bug is still there, do NOT keep pasting "still broken" five times. Give it fresher evidence!\n\n• Ask it to add a temporary `console.log` print statement (never logging secrets!) so you can see what value the button actually received.\n• Check if the browser is showing a cached old version (try a Hard Refresh).\n• If a messy repair spiral starts, roll back cleanly to your last working Git commit and ask for a simpler approach!',
          callout: {
            type: 'warning',
            title: 'Watch out for "band-aid rewrites"',
            body: 'If an AI proposes deleting and rewriting 300 lines of working code just to fix one broken button, pause and say: "Stop—keep the working parts and make a minimal targeted fix for line 42 only."'
          }
        }
      ],
      keyTakeaways: [
        'Console error messages are helpful diagnostic clues pointing directly to the file, line number, and cause—never something to fear.',
        'Always give AI three inputs when debugging: exact steps you took, exact copied error text (redacted of any secrets), and a request for a plain-English diagnosis + minimal fix.',
        'Use hard refresh, temporary `console.log` clues, or a clean Git rollback whenever a bug resists the first fix.'
      ],
      glossaryTermIds: ['console-error', 'state', 'diff', 'git'],
      relatedLabId: null,
      quiz: [
        {
          id: 'q-7-3-1',
          type: 'multiple_choice',
          question: 'A button in your app stopped working. What is the single best thing to send your AI assistant so it fixes the real bug quickly?',
          options: [
            'Ask it to rewrite the whole app from scratch.',
            'Raise temperature to 0.9 so the AI tries several creative new button layouts automatically.',
            'Clear your Git commit history so older versions of the script do not confuse the browser.',
            'Send the exact tap steps, verbatim console error, and ask for a minimal fix.'
          ],
          correctIndex: 3,
          explanation:
            'Exact reproduction steps plus the verbatim console error pinpoint the exact file and line immediately—turning guesswork into a surgical fix.'
        },
        {
          id: 'q-7-3-2',
          type: 'true_false',
          question:
            'Opening the browser Developer Tools Console reveals exact error clues like file names and line numbers even if you do not know how to code.',
          options: ['True', 'False'],
          correctIndex: 0,
          explanation:
            'True! You do not have to memorize what every error means—knowing where to copy the exact clue turns you into an effective debugger immediately.'
        },
        {
          id: 'q-7-3-3',
          type: 'spot_mistake',
          question:
            'Kiran’s habit tracker shows `NaN` when he submits an empty streak, so he approves a sweeping 400-line AI rewrite that accidentally deletes his dark mode and delete buttons. What should he have done instead?',
          options: [
            'Approved it and asked AI to rebuild dark mode from memory.',
            'Disabled `localStorage` so empty numbers never get saved.',
            'Asked for a plain diagnosis and a minimal fix that leaves working features untouched.',
            'Hidden the `NaN` label with CSS instead of validating input.'
          ],
          correctIndex: 2,
          explanation:
            'Minimal, targeted fixes protect everything that already works! Always review the diff and reject sweeping rewrites for tiny bugs.'
        }
      ]
    },
    {
      id: 'ch-7-4',
      moduleId: 'mod-7-build-app',
      number: 4,
      title: 'Shipping Safely, Backups & Your Zero-to-One Roadmap',
      readMinutes: 5,
      xpReward: 40,
      summary:
        'You have gone from "What even is an LLM?" to understanding websites, stateful apps, and real security hygiene. Lock in your safe-shipping checklist, secret-free backups, and next build.',
      analogy: {
        title: 'The Pilot’s Pre-Flight Card',
        body: 'Even airline captains with 20,000 flight hours still read a calm 6-item pre-flight card before every takeoff—not because they are beginners, because checklists turn safe habits into second nature. Keep your 6-item AI Builder checklist handy every time you ship something new!'
      },
      sections: [
        {
          heading: 'Your 6-Point Safe-Shipping Pre-Flight Checklist',
          body: 'Before sharing ANY website or app with friends, coworkers, or the public internet, breeze through these six calm checks:\n\n1. **Deterministic secrets sweep**: Verify zero API keys in HTML/JS using local checks (`git status`, `git diff`, `git grep`, or a secret scanner like `gitleaks` / GitHub Push Protection) and confirm `.env` is in `.gitignore`.\n2. **Fresh-eyes test**: Open the app in a private/incognito window—does it start cleanly when `localStorage` is empty?\n3. **Weird-input test**: Try tapping Submit with an empty box, a super long name, or a negative number—does it stay polite instead of crashing?\n4. **Mobile check**: Does every button fit cleanly on a narrow phone screen?\n5. **Clean backup & Git checkpoint**: Check `git status` first, then commit and back up without including `.env`.\n6. **Billing & quota check**: If using any paid AI API on a backend, verify prepaid auto-reload is OFF, provider spend limits/alerts are set, and strict API request quotas + `max_tokens` caps are active (remembering postpaid cloud budget alerts alone do NOT stop spend!).',
          callout: {
            type: 'warning',
            title: 'Do NOT ask a cloud AI to "scan my folder for API keys"',
            body: 'Letting an AI agent scan your folder can read `.env` and send live secrets into cloud context logs—and LLM scanning is not deterministic! Exclude `.env` from agent reads and use local tools (`git status`, `git grep`, `gitleaks`, GitHub Push Protection) for secrets checks.'
          }
        },
        {
          heading: 'Simple backups that never leak your secrets',
          body: 'Devices get lost and drives age, so keep clean backups:\n\n• **Option A (Simple folder backup)**: Copy or zip your project folder into cloud storage—**excluding `.env` and credential files**, and storing API keys strictly in a password manager.\n• **Option B (Builder Standard)**: Push your clean commits to a free **private GitHub repository** with GitHub Push Protection enabled. Now every milestone lives safely in the cloud with complete history!',
          callout: {
            type: 'tip',
            title: 'Check `.gitignore` and `git status` BEFORE your first `git push`',
            body: 'Even in a private repo, keeping `.env` ignored builds rock-solid muscle memory so you never risk leaking keys if you collaborate or make a project public later.'
          }
        },
        {
          heading: 'Look how far you have come—and what to build next!',
          body: 'Take a second to appreciate what you now genuinely understand without hiding behind buzzwords: **LLMs & tokens**, **context windows & prompting**, **API billing, quotas & key hygiene**, **harnesses, tool calling, MCP & real permissions**, **AI CLIs & diffs**, **HTML/CSS/JS websites**, and **stateful apps with fearless debugging**.\n\nThe fastest way to cement everything? Pick ONE tiny real itch in your own life this week—a reading tracker, a freelance invoice estimator, a family recipe box, or a personal portfolio—write a 5-line Mini-Spec, and ship Version 1. Welcome to the builder club!',
          callout: {
            type: 'example',
            title: '3 joyful starter projects to build next',
            body: '• **Personal Link-in-Bio + Mini Portfolio**: Plain HTML/CSS deployed free on Netlify Drop.\n• **Home Budget or Split-Bill Calculator**: Frontend JS + `localStorage` saved right to your phone home screen.\n• **Automated Notes Helper**: Use a scoped AI CLI with a lean `CLAUDE.md` to tidy weekly meeting notes into crisp action lists.'
          }
        }
      ],
      keyTakeaways: [
        'Use local deterministic tools (`git status`, `git grep`, `gitleaks`, GitHub Push Protection)—never cloud AI prompts reading `.env`—for your pre-flight secrets sweep.',
        'Back up projects cleanly via private GitHub repos or secret-free zips (storing real API keys only in a password manager), and layer billing quotas + prepaid limits.',
        'Test empty states in incognito, weird inputs, and phone layouts before sharing Version 1.'
      ],
      glossaryTermIds: ['deployment', 'gitignore', 'local-storage', 'mvp', 'commit', 'rate-limit'],
      relatedLabId: 'app-builder',
      quiz: [
        {
          id: 'q-7-4-1',
          type: 'multiple_choice',
          question: 'Why is testing your finished web app inside a fresh Incognito / Private browser window such a smart pre-flight check?',
          options: [
            'Incognito mode automatically runs a secret scanner and strips out any accidental API keys.',
            'It starts with empty `localStorage`, showing what a first-time user sees.',
            'Private windows disable CSS animations so you can verify raw HTML accessibility scores.',
            'Incognito mode simulates a backend database so multi-user syncing works without a server.'
          ],
          correctIndex: 1,
          explanation:
            'Your own browser often holds leftover test data in `localStorage`. Checking an Incognito window reveals the clean first-run experience every brand-new visitor gets!'
        },
        {
          id: 'q-7-4-2',
          type: 'true_false',
          question:
            'Asking a cloud AI agent to scan your entire project folder (including `.env`) for leaked API keys is safer and more reliable than using local `git status`, `git grep`, or `gitleaks`.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! Letting a cloud agent read `.env` sends your live secrets into cloud context/logs, and LLM scans are not deterministic. Exclude `.env` from agent reads and use local secret scanners + GitHub Push Protection.'
        },
        {
          id: 'q-7-4-3',
          type: 'spot_mistake',
          question:
            'Meera finishes her Expense Splitter app, zips the entire folder (including `.env`) to a shared cloud folder, and deploys publicly with a test API key still inside `script.js`. What two safety mistakes did she make?',
          options: [
            'Leaving a key in public `script.js` and backing up `.env` inside a shared zip.',
            'Testing her app in an incognito window and using plain CSS.',
            'Adding `.env` to `.gitignore` and using a password manager.',
            'Forgetting to buy a `.com` domain before checking how buttons fit on a narrow mobile screen.'
          ],
          correctIndex: 0,
          explanation:
            'Keep secret API keys completely out of public browser JS and exclude `.env` from zips and shared folders—store keys in a password manager and verify with local secret checks before shipping!'
        }
      ]
    }
  ],
  masteryCheck: {
    id: 'mc-7-build-app',
    title: 'Unit 7 Mastery Check',
    subtitle: 'Prove you can scope MVPs, pick frontend vs. backend safely, debug from clues, and ship cleanly.',
    passThreshold: 0.75,
    xpReward: 40,
    estimatedMinutes: 2,
    questions: [
      {
        id: 'mc-7-q1',
        type: 'multiple_choice',
        question: 'Which project genuinely requires a backend server (not just browser `localStorage`)?',
        options: [
          'A single-user Pomodoro timer that saves your preferred work interval on one phone.',
          'A public multi-user notes app with logins and calls to your paid AI API key.',
          'A personal offline bill splitter used only at your table.',
          'A private single-device flashcard deck storing study cards locally in your browser.'
        ],
        correctIndex: 1,
        explanation:
          'Multi-user synced accounts and server-side paid API keys require a backend with proper access rules; single-user non-sensitive utilities work cleanly with `localStorage`.'
      },
      {
        id: 'mc-7-q2',
        type: 'multiple_choice',
        question: 'After you tap "Save Expense" with an empty amount, the total shows `NaN` and the console prints `TypeError at app.js:58`. What is the best debugging prompt?',
        options: [
          'Paste the exact steps and console error; ask for a 2-line diagnosis and minimal fix.',
          'Tell the AI "it is broken" and approve a full 400-line rewrite of every file.',
          'Ask the AI to hide `NaN` with white CSS text so users cannot notice the error.',
          'Paste your live `.env` credentials alongside the error so the AI checks billing too.'
        ],
        correctIndex: 0,
        explanation:
          'Exact reproduction steps + verbatim (secret-free) console clue + asking for a diagnosis and minimal targeted fix solves bugs cleanly without breaking working features.'
      },
      {
        id: 'mc-7-q3',
        type: 'spot_mistake',
        question: 'Before launching a small web app that connects to Supabase, a builder asks an AI CLI to read `.env` to verify keys and leaves database tables set to public read/write. What two security flaws exist?',
        options: [
          'Supabase databases only work with open-weights models and cannot store user habits.',
          'Public read/write is safe as long as you test the app once inside an Incognito tab.',
          'Letting a cloud AI read `.env` risks leaking secrets, and public DB tables expose user data.',
          'Database access rules are unnecessary whenever `.env` is listed inside `.gitignore`.'
        ],
        correctIndex: 2,
        explanation:
          'Never feed `.env` into cloud AI prompts (use local deterministic secret checks), and ALWAYS enforce backend database access rules like Row Level Security!'
      },
      {
        id: 'mc-7-q4',
        type: 'multiple_choice',
        question: 'You want to build a personal recipe box app with AI over a weekend. Which build plan gives the highest chance of shipping a working app?',
        options: [
          'Prompt all 14 features—accounts, grocery delivery, photo AI, and sharing—in one giant message.',
          'Skip testing until the final hour so you can write code faster without interruptions.',
          'Back up the entire folder including `.env` into a public GitHub repo before testing.',
          'Define a 3-line item shape and ship one tested MVP slice at a time with Git commits.'
        ],
        correctIndex: 3,
        explanation:
          'Clear data shapes, tiny testable MVP slices, and clean Git checkpoints after each working slice keep complexity small and bugs trivial to fix.'
      }
    ]
  }
};
