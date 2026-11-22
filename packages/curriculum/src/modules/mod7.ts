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
        'A brochure website shows the same page to everyone. A real app responds to your clicks, updates live data (State), and remembers it tomorrow (Storage). Learn when you need a backend—and when you do not!',
      analogy: {
        title: 'The Printed Menu vs. The Live Order Whiteboard',
        body: 'A static website is a printed cafe menu taped in the window: every passerby reads the exact same dishes and prices. An **app** is the live order whiteboard inside the kitchen: customers add items, check off finished drinks, see updated totals instantly (**State**), and save today’s tallies in a ledger (**Storage**) so nothing vanishes if the power blinks.'
      },
      sections: [
        {
          heading: 'What turns a webpage into a real app: State + Storage',
          body: 'You can build genuinely useful personal apps—Habit Trackers, Expense Splitters, Flashcard Decks, Pomodoro Timers, Budget Planners—using the exact same HTML, CSS, and JavaScript you met in Module 6! Two new concepts power the leap:\n\n• **State**: The app’s live memory right now (for example, your list of habits, which boxes are checked today, and your current streak count). Whenever you click a button, JavaScript updates State and immediately redraws the screen to match.\n• **Storage**: Saving that State somewhere permanent so refreshing the browser does NOT wipe out your habits! For single-person tools, your browser already has a built-in personal notebook called **`localStorage`**—zero server required!',
          callout: {
            type: 'example',
            title: 'Watching State and Storage team up',
            body: '1. You type "Drink 2L Water" and click Add.\n2. JavaScript appends that habit to your `habits` array (**State**).\n3. The UI redraws to display the new row.\n4. JavaScript saves the updated list into `localStorage` (**Storage**) so tomorrow morning your habit is still right there!'
          }
        },
        {
          heading: 'Frontend vs. Backend: when do you actually need a server?',
          body: 'Beginners often panic thinking every app requires complex cloud databases and login systems. Here is the clean rule of thumb:\n\n• **Frontend-only (HTML/CSS/JS + `localStorage`) is ENOUGH when**: The app is for one person at a time on their own device (Habit Tracker, Flashcards, Calculator, Expense Splitter for a dinner table, Note Scratchpad). It is free, fast, private, and trivially easy to build with AI!\n• **Add a Backend server + Database ONLY when**: Multiple people must share live data across different devices (a team chat, marketplace, or multi-device synced notes), OR when you need user logins, payments, or secret server-side AI API keys.',
          callout: {
            type: 'tip',
            title: 'Start frontend-first—upgrade later!',
            body: 'Build your first 2 or 3 working apps purely frontend + `localStorage`. You will ship real tools in an afternoon instead of getting tangled in database passwords on day one!'
          }
        },
        {
          heading: 'Meet "Backend-in-a-Box" when you are ready for Version 2',
          body: 'Whenever your app eventually outgrows `localStorage` and genuinely needs accounts or shared data across devices, you still do not have to build a server from scratch! Modern beginner-friendly platforms like **Supabase** or **Firebase** give you ready-made login buttons and cloud databases that your AI coding assistant knows how to wire up cleanly.',
          callout: {
            type: 'myth',
            title: 'Myth Buster: "An app only counts if it is in the Apple App Store"',
            body: 'A responsive web app works on iPhone, Android, Linux, Mac, and Windows immediately from one link—and users can even tap "Add to Home Screen" so it launches with an icon like a native app!'
          }
        }
      ],
      keyTakeaways: [
        'Apps differ from brochure websites by managing live changing data (**State**) and remembering it across reloads (**Storage**).',
        'Single-user personal apps work wonderfully with browser `localStorage`—zero backend server, zero monthly hosting fee.',
        'Add a backend/database only when you genuinely need multi-user syncing, accounts, payments, or hidden server-side API keys.'
      ],
      glossaryTermIds: ['state', 'local-storage', 'frontend-backend', 'javascript'],
      relatedLabId: 'app-builder',
      quiz: [
        {
          id: 'q-7-1-1',
          type: 'multiple_choice',
          question: 'If you build a Daily Habit Tracker and forget to save its state to `localStorage` (or a database), what happens when the user refreshes the page?',
          options: [
            'The habits turn into PDFs.',
            'Nothing—browsers always guess what you typed.',
            'The browser deletes the HTML file.',
            'All the habits and checkmarks added during that session disappear back to the initial empty state.'
          ],
          correctIndex: 3,
          explanation:
            'In-memory State lives only while the page is open. Saving State to `localStorage` (or a database) persists user data safely across page reloads!'
        },
        {
          id: 'q-7-1-2',
          type: 'true_false',
          question:
            'Every interactive personal utility app—like a Flashcard deck or Dinner Bill Splitter—requires a paid cloud backend server and login screen.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! Frontend-only apps using browser `localStorage` run completely free with zero servers and zero logins, making them the ideal first apps to build.'
        },
        {
          id: 'q-7-1-3',
          type: 'spot_mistake',
          question:
            'Priya wants to build a public app where strangers click a button that calls her paid OpenAI API key, and decides to skip a backend by storing her secret key inside browser `localStorage`. Spot the danger.',
          options: [
            '`localStorage` cannot store text strings.',
            'OpenAI only works in `index.html`.',
            'Anything running in a visitor’s browser is visible to the visitor—public multi-user apps calling YOUR paid API key need a backend server so the key stays private.',
            'Backends are banned for web apps.'
          ],
          correctIndex: 2,
          explanation:
            'Browser code and `localStorage` belong to the visitor’s machine! Use a backend server to protect shared secret API keys—or let users supply their own key in BYOK mode.'
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
          body: 'When beginners ask AI *"Build a full fitness app with user logins, social feed, AI meal scanner, push notifications, Stripe billing, and Apple Watch sync,"* the AI tries to juggle twenty interlocking systems at once. Dozens of files appear, half the buttons are fake stubs, and when something breaks you have zero clue where to look.\n\nInstead, top AI builders shrink the idea to its beating heart—the **MVP (Minimum Viable Product)**: the smallest working version that actually solves ONE core problem cleanly.',
          callout: {
            type: 'example',
            title: 'Shrinking a "Dream Expense App" into a 15-minute MVP',
            body: 'Dream wish-list: Bank sync, receipt OCR camera, 12 currencies, group chats, monthly PDF tax exports.\n**Crisp MVP (Version 1)**:\n1. Add an expense (Item name + Amount + Who paid).\n2. Show the clean list of expenses + total spent.\n3. Calculate "Who owes whom" equally with one click.\n4. Save automatically in `localStorage` + a Reset Trip button.'
          }
        },
        {
          heading: 'The 3-Slice Build Ladder',
          body: 'Once your MVP fits on 4 bullet points, build it in three calm, testable slices—never jumping to Slice 2 until Slice 1 genuinely works when you click it:\n\n• **Slice 1 (Data + Core Action)**: Can I add an item and see it appear on screen?\n• **Slice 2 (Persistence + Polish)**: Does it survive hitting Refresh (`localStorage`), let me delete/check off items, and look crisp on mobile?\n• **Slice 3 (One Delightful Extra)**: Add a search filter, dark mode, CSV export, or celebration banner!',
          callout: {
            type: 'tip',
            title: 'Write a 3-line "Data Model" in plain English',
            body: 'Telling AI what ONE item looks like works wonders: *"Each Habit item has: an `id`, a `name` (text), `completedToday` (true/false), and `streak` (number)."* Clear data shapes produce rock-solid, bug-free apps!'
          }
        },
        {
          heading: 'Save a working checkpoint after EVERY single slice',
          body: 'Finished Slice 1 and the Add button works smoothly? Save a Git commit (or export a backup copy)! Now Slice 2 is 100% risk-free—because even if Slice 2 gets weird, your working Slice 1 is safely locked in history.',
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
      relatedLabId: 'app-builder',
      quiz: [
        {
          id: 'q-7-2-1',
          type: 'multiple_choice',
          question: 'You want to build a Study Flashcards app with AI. Which scope is the best MVP for Version 1?',
          options: [
            'Multiplayer leaderboards, video calls, paid subscriptions, and a custom 3D avatar store.',
            'Add a card (Front + Back), click to flip it, mark "Got It / Study Again", and save cards in `localStorage`.',
            'A blank page with no buttons yet.',
            'Training your own custom LLM from scratch.'
          ],
          correctIndex: 1,
          explanation:
            'A focused V1 nails the real study loop immediately in minutes—you can actually study with it today and layer extra features on safely tomorrow!'
        },
        {
          id: 'q-7-2-2',
          type: 'true_false',
          question:
            'You should test that Slice 1 works properly by clicking the buttons before asking AI to pile Slice 2 and Slice 3 on top.',
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
            'Scoping a tiny 3–4 bullet MVP first, specifying the simple data shape, and adding one tested slice at a time with checkpoints.',
            'Asking for 30 features instead of 15.',
            'Switching all text to italics.',
            'Turning off `localStorage`.'
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
          body: 'Every beginner freezes the first time a button stops responding or a block of angry red text flashes in the Console. Take a slow breath and reframe it: **silent bugs are hard; loud red error messages are a gift!**\n\nInside any web browser, pressing `F12` (or Right-Click -> **Inspect** -> **Console** tab) opens the secret diagnostic log. Almost every error tells you three priceless facts:\n\n1. **What went wrong** (e.g., `TypeError: Cannot read properties of null`)\n2. **Which exact file** (e.g., `app.js`)\n3. **Which exact line number** (e.g., `line 42`)',
          callout: {
            type: 'example',
            title: 'Translating a scary error into plain English',
            body: 'Scary raw message: `TypeError: Cannot read properties of null (reading "value") at app.js:42`\nPlain English translation: *"On line 42 of app.js, the code tried to read text from an input box that it could not find—probably because the button or input ID has a typo!"*'
          }
        },
        {
          heading: 'The Calm 3-Step Non-Coder Debugging Loop',
          body: 'Whenever something breaks in an app you are building with AI, follow this exact 3-step recipe:\n\n1. **Reproduce & Notice**: Write down the exact click that broke it (*"When I leave the Amount box blank and click Split, the total turns into `NaN`"*).\n2. **Grab the Exact Clue**: Open the Console tab and copy the exact red error message (plus a screenshot if the layout looks strange).\n3. **Ask AI to Diagnose FIRST, Patch SECOND**: Paste the error and say: *"Here is what I clicked and the exact console error. First explain in 2 simple sentences why this happened, then apply the smallest possible fix without changing unrelated features."*',
          callout: {
            type: 'tip',
            title: 'Practice fixing a real bug hands-on!',
            body: 'Inside Marain’s **App Builder & Debug Studio**, click **"Inject Realistic Bug"** to trigger a genuine live console error, inspect the clue, and watch how the exact 3-step prompt patches it cleanly!'
          }
        },
        {
          heading: 'What to do if a fix does not work on try #1',
          body: 'If AI tries one fix and the bug is still there, do NOT keep pasting "still broken" five times. Give it fresher evidence!\n\n• Ask it to add a temporary `console.log` print statement so you can see what value the button actually received.\n• Check if the browser is showing a cached old version (try a Hard Refresh: `Ctrl + Shift + R` or `Cmd + Shift + R`).\n• If a messy repair spiral starts, roll back cleanly to your last working Git commit and ask for a simpler approach!',
          callout: {
            type: 'warning',
            title: 'Watch out for "band-aid rewrites"',
            body: 'If an AI proposes deleting and rewriting 300 lines of working code just to fix one broken button, pause and say: "Stop—keep the working parts and make a minimal targeted fix for line 42 only."'
          }
        }
      ],
      keyTakeaways: [
        'Console error messages are helpful diagnostic clues pointing directly to the file, line number, and cause—never something to fear.',
        'Always give AI three inputs when debugging: exact steps you clicked, exact copied error text, and a request for a plain-English explanation + minimal fix.',
        'Use hard refresh (`Ctrl+Shift+R`), `console.log` clues, or a clean Git rollback whenever a bug resists the first fix.'
      ],
      glossaryTermIds: ['console-error', 'state', 'diff', 'git'],
      relatedLabId: 'app-builder',
      quiz: [
        {
          id: 'q-7-3-1',
          type: 'multiple_choice',
          question: 'A button in your app stopped working. What is the single best thing to send your AI assistant so it fixes the real bug quickly?',
          options: [
            'Just type "fix it please" with zero details.',
            'Turn up the temperature to 1.0.',
            'Rewrite your entire Mini-Spec from scratch.',
            'Describe the exact click you made, paste the exact red error message from the browser Console, and ask it to explain the cause before making a minimal fix.'
          ],
          correctIndex: 3,
          explanation:
            'Exact reproduction steps plus the verbatim console error pinpoint the exact file and line immediately—turning guesswork into a surgical 5-second fix.'
        },
        {
          id: 'q-7-3-2',
          type: 'true_false',
          question:
            'Opening the browser Developer Tools Console (`F12` -> Console) reveals exact error clues like file names and line numbers even if you do not know how to code.',
          options: ['True', 'False'],
          correctIndex: 0,
          explanation:
            'True! You do not have to memorize what every error means—just knowing where to copy the exact clue turns you into an effective debugger immediately.'
        },
        {
          id: 'q-7-3-3',
          type: 'spot_mistake',
          question:
            'Kiran’s habit tracker shows `NaN` when he adds an empty streak, so he asks AI to fix it—and approves a huge 400-line rewrite that accidentally erases his dark mode and delete buttons. What should he have asked instead?',
          options: [
            'Ask the AI to rewrite 800 lines instead.',
            'Ignore `NaN` and tell users not to look at it.',
            'Ask for a plain-English diagnosis and the smallest targeted fix for empty input handling while leaving existing dark mode and delete features untouched.',
            'Remove CSS from the project.'
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
        'You have gone from "What even is an LLM?" to shipping real websites and stateful apps! Lock in your safe-shipping checklist, simple backups, and a joyful plan for what to build next.',
      analogy: {
        title: 'The Pilot’s Pre-Flight Card',
        body: 'Even airline captains with 20,000 flight hours still read a calm 6-item pre-flight card before every takeoff—not because they are beginners, because checklists turn safe habits into second nature. Keep your 6-item AI Builder checklist handy every time you ship something new!'
      },
      sections: [
        {
          heading: 'Your 6-Point Safe-Shipping Pre-Flight Checklist',
          body: 'Before sharing ANY website or app with friends, coworkers, or the public internet, breeze through these six calm checks:\n\n1. **Secrets sweep**: Zero API keys in HTML/JS; `.env` is strictly inside `.gitignore`.\n2. **Fresh-eyes test**: Open the app in a private/incognito window—does it start cleanly when `localStorage` is empty?\n3. **Weird-input test**: Try clicking Submit with an empty box, a super long name, or a negative number—does it stay polite instead of crashing?\n4. **Mobile check**: Does every button fit cleanly on a narrow phone screen?\n5. **Backup & Git checkpoint**: Save a labeled Git commit (and push to a private GitHub repo if you want cloud backup!).\n6. **Spending cap check**: If using any paid AI API, verify your $5–$10 hard monthly limit is active.',
          callout: {
            type: 'tip',
            title: 'You can even ask AI to run an automated review!',
            body: 'Before publishing, paste this prompt into your AI CLI: *"Act as a friendly security & QA reviewer. Check my files for exposed secrets, empty-input edge cases, broken links, and mobile layout issues—list anything to fix before I deploy."*'
          }
        },
        {
          heading: 'Simple backups so you never lose a project you love',
          body: 'Laptops get spilled on and hard drives age. Keeping your work safe takes thirty seconds:\n\n• **Option A (Simplest)**: Copy your finished project folder into a synced cloud folder (Google Drive, Proton Drive, or iCloud) or zip it with today’s date.\n• **Option B (Builder Standard)**: Create a free **private GitHub repository** and run `git push`. Now every single milestone commit lives safely in the cloud with complete history!',
          callout: {
            type: 'warning',
            title: 'Check `.gitignore` BEFORE your very first `git push`',
            body: 'Even in a private repo, keeping `.env` inside `.gitignore` builds rock-solid muscle memory so you can make a project public later without ever risking a leaked key.'
          }
        },
        {
          heading: 'Look how far you have come—and what to build next!',
          body: 'Take a second to appreciate what you now genuinely understand without hiding behind buzzwords: **LLMs & tokens**, **context windows & prompting**, **AI credits & safe API keys**, **harnesses, tool calling & MCP**, **Claude Code CLI & diffs**, **HTML/CSS/JS websites**, and **stateful apps with fearless debugging**.\n\nThe fastest way to cement everything? Pick ONE tiny real itch in your own life this weekend—a reading tracker, a freelance invoice estimator, a family recipe box, or a personal portfolio—write a 5-line Mini-Spec, and ship Version 1 in an afternoon. Welcome to the builder club!',
          callout: {
            type: 'example',
            title: '3 joyful weekend starter projects to build next',
            body: '• **Personal Link-in-Bio + Mini Portfolio**: Plain HTML/CSS deployed free on Netlify Drop.\n• **Home Budget or Split-Bill Calculator**: Frontend JS + `localStorage` saved right to your phone home screen.\n• **Automated Notes Helper**: Use Claude Code CLI with a custom `CLAUDE.md` to tidy your weekly meeting notes into crisp action lists.'
          }
        }
      ],
      keyTakeaways: [
        'Run a quick 6-point pre-flight check before shipping: secrets sweep, empty-state incognito test, weird-input test, mobile view, Git backup, and spending cap.',
        'Back up projects effortlessly with dated zips or a free private GitHub repository (always keeping `.env` in `.gitignore`).',
        'Real mastery clicks when you solve one small real problem in your own life—write a 5-bullet Mini-Spec and ship Version 1 this week!'
      ],
      glossaryTermIds: ['deployment', 'gitignore', 'local-storage', 'mvp', 'commit', 'rate-limit'],
      relatedLabId: 'app-builder',
      quiz: [
        {
          id: 'q-7-4-1',
          type: 'multiple_choice',
          question: 'Why is testing your finished web app inside a fresh Incognito / Private browser window such a smart pre-flight check?',
          options: [
            'Incognito mode writes CSS automatically.',
            'It starts with completely empty `localStorage`, letting you verify what a brand-new first-time visitor actually sees without leftover test data.',
            'Incognito mode connects to paid databases for free.',
            'Normal browser windows cannot open HTML files.'
          ],
          correctIndex: 1,
          explanation:
            'Your own browser often holds messy test items in `localStorage`. Checking an Incognito window reveals the clean first-run experience every brand-new user will see!'
        },
        {
          id: 'q-7-4-2',
          type: 'true_false',
          question:
            'Testing weird inputs—like clicking Add with an empty text box or typing a negative number—helps catch silly crashes before sharing your app with others.',
          options: ['True', 'False'],
          correctIndex: 0,
          explanation:
            'True! Real users always click buttons in unexpected orders—a 30-second edge-case test catches almost all beginner bugs before anyone else sees them.'
        },
        {
          id: 'q-7-4-3',
          type: 'spot_mistake',
          question:
            'Meera finishes her awesome Expense Splitter app, leaves a test API key hardcoded in `script.js`, never backs up the folder, and posts it publicly. Which two pre-flight checklist steps did she skip?',
          options: [
            'Running a secrets sweep (removing any hardcoded API key) and saving a clean Git / cloud backup before shipping.',
            'Changing her monitor wallpaper and buying an Apple Watch.',
            'Adding Lorem Ipsum text and turning off mobile responsiveness.',
            'Deleting `index.html` and turning off HTTPS.'
          ],
          correctIndex: 0,
          explanation:
            'Always sweep for stray secrets before going public and keep a clean backup or Git commit so your hard work is permanently protected!'
        }
      ]
    }
  ]
};
