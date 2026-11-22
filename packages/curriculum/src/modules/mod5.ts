import type { CurriculumModule } from '../schema.ts';

export const MODULE_5: CurriculumModule = {
  id: 'mod-5-claude-cli',
  number: 5,
  title: 'Using Claude Code & AI CLIs',
  subtitle: 'Conquer terminal anxiety in minutes and learn how to partner with Claude Code CLI right inside your project folder.',
  icon: 'terminal',
  accentHex: '#EC4899',
  estimatedMinutes: 18,
  recommendedLabId: 'claude-cli',
  chapters: [
    {
      id: 'ch-5-1',
      moduleId: 'mod-5-claude-cli',
      number: 1,
      title: 'No-Fear Intro to the Terminal (CLI)',
      readMinutes: 4,
      xpReward: 30,
      summary:
        'Movies make the black terminal window look like hacker magic, yet it is just a polite text-based file browser. Learn the only four everyday commands you need to feel right at home.',
      analogy: {
        title: 'Pointing at Menu Pictures vs. Ordering by Name',
        body: 'Clicking icons in Finder or File Explorer is like pointing at glossy photos on a restaurant menu. Typing inside a terminal (CLI) is simply saying "One masala chai, please" out loud. Same kitchen, same computer—just faster, clearer, and able to talk directly to powerful AI assistants.'
      },
      sections: [
        {
          heading: 'What the terminal really is (and why you will not break your computer)',
          body: 'If opening a dark window with a blinking cursor makes your stomach drop, you are in great company! Almost everyone feels that way at first because Hollywood only shows terminals during bank heists.\n\nHere is the reassuring truth: the **Terminal** (also called Command Line or Shell) is simply a text conversation with your computer’s folders. You cannot accidentally "blow up your computer" by typing normal navigation commands—and anything destructive always requires explicitly asking for it.',
          callout: {
            type: 'myth',
            title: 'Myth Buster: "You must memorize 100 cryptic commands to use a terminal"',
            body: 'Not even close! Most beginners—and plenty of seasoned builders—use just **four** navigation commands 95% of the time, and let AI explain or suggest any other command on demand.'
          }
        },
        {
          heading: 'The Fabulous Four commands (learn them in 60 seconds)',
          body: 'Picture your computer’s folders as rooms inside a house. These four tiny commands let you walk around effortlessly:\n\n• **`pwd`** (*Print Working Directory*): "Which room am I standing in right now?"\n• **`ls`** (*List*): "What files and subfolders are inside this room?"\n• **`cd folder-name`** (*Change Directory*): "Walk into that subfolder." (Type `cd ..` to step back out one level.)\n• **`mkdir my-project`** (*Make Directory*): "Create a brand-new empty folder named `my-project`."',
          callout: {
            type: 'example',
            title: 'A complete 10-second walk into a project folder',
            body: '1. Type `pwd` -> `/home/you`\n2. Type `mkdir my-site` -> creates a clean new folder\n3. Type `cd my-site` -> steps inside\n4. Type `ls` -> sees everything inside `my-site`\nThat is genuinely all it takes to get oriented!'
          }
        },
        {
          heading: 'Three comfort shortcuts that make the terminal feel cozy',
          body: 'Once you know the Fabulous Four, three keyboard habits turn the terminal from awkward into joyful:\n\n1. **Up Arrow (`↑`)**: Cycles back through commands you already typed so you never retype long paths.\n2. **Tab key (`Tab`)**: Auto-completes long folder and file names after just 2–3 letters (zero typos!).\n3. **`Ctrl + C`**: The universal polite panic brake! If a command is running too long or you want to cancel a line you started typing, press `Ctrl + C` to stop immediately and get a clean prompt back.',
          callout: {
            type: 'tip',
            title: 'Practice zero-risk inside the CLI Dojo',
            body: 'Marain includes a Guided Safe Terminal Dojo where you can type `pwd`, `ls`, `cd`, and `claude` with clickable hints and zero chance of touching real system files!'
          }
        }
      ],
      keyTakeaways: [
        'The terminal (CLI) is simply a text-based way to open folders and launch programs—nothing mysterious or fragile.',
        'Four simple commands cover nearly everything you need: `pwd` (where am I?), `ls` (what is here?), `cd` (move folder), and `mkdir` (create folder).',
        'Press `Tab` to autocomplete names, `Up Arrow` to repeat commands, and `Ctrl + C` anytime to cancel cleanly.'
      ],
      glossaryTermIds: ['terminal', 'cli', 'working-directory'],
      relatedLabId: 'claude-cli',
      quiz: [
        {
          id: 'q-5-1-1',
          type: 'multiple_choice',
          question: 'You just opened your terminal and want to check which folder you are currently inside. Which command do you type?',
          options: ['mkdir', 'pwd', 'exit', 'delete'],
          correctIndex: 1,
          explanation:
            '`pwd` stands for Print Working Directory—it immediately prints the exact folder path your terminal is currently standing inside.'
        },
        {
          id: 'q-5-1-2',
          type: 'true_false',
          question:
            'Pressing `Ctrl + C` in the terminal safely interrupts a stuck command or clears the current line so you get a fresh prompt back.',
          options: ['True', 'False'],
          correctIndex: 0,
          explanation:
            'True! `Ctrl + C` is your friendly emergency brake in almost every terminal program.'
        },
        {
          id: 'q-5-1-3',
          type: 'spot_mistake',
          question:
            'Maya wants to list the files inside her `portfolio` folder, so she opens the terminal in her home folder and types `ls` without ever running `cd portfolio`. Why does she not see `index.html`?',
          options: [
            'Her working directory is still her home folder—she needs to walk into the project first using `cd portfolio`, then run `ls`.',
            '`ls` cannot show HTML files.',
            'HTML files are always invisible in Linux.',
            'She needed to reboot before running `ls`.'
          ],
          correctIndex: 0,
          explanation:
            'Terminal commands always act on your current working directory! Always check `pwd` and `cd` into your project folder before inspecting files or launching an AI CLI.'
        }
      ]
    },
    {
      id: 'ch-5-2',
      moduleId: 'mod-5-claude-cli',
      number: 2,
      title: 'What Is Claude Code CLI & How to Install / Auth It',
      readMinutes: 4,
      xpReward: 30,
      summary:
        'Claude Code (and sibling AI CLIs like Gemini CLI and Codex CLI) puts an AI agent directly inside your project folder—no more copy-pasting code back and forth from browser tabs.',
      analogy: {
        title: 'Inviting the Carpenter Inside the Workshop',
        body: 'Using a browser chatbot to build software is like taking photos of a wobbly table, texting them to a carpenter across town, reading their reply, and sawing the wood yourself. Using Claude Code CLI is inviting the carpenter right into your workshop: they look directly at the real table, measure the legs, propose exact cuts for your approval, and double-check that it stands level.'
      },
      sections: [
        {
          heading: 'Why AI CLIs changed everything for non-coders',
          body: 'For the first two years of ChatGPT, non-technical beginners hit the same frustrating wall: copy code from chat -> paste into the wrong file -> miss one curly bracket -> paste the whole file back -> repeat 30 times until giving up.\n\n**Claude Code CLI** (built by Anthropic—with similar terminal agents like Gemini CLI and OpenAI Codex CLI) eliminated copy-paste gymnastics completely. Because it runs right inside your project folder, it can:\n\n• Read all your files automatically so it understands the whole project\n• Propose clean surgical edits with a red/green preview diff\n• Run tests or check errors right in the terminal\n• Wait calmly for your **Yes / No** before touching anything',
          callout: {
            type: 'example',
            title: 'The entire magic starts with one word',
            body: 'Once installed, you walk into any project folder (`cd my-website`) and type a single word:\n`claude`\nAn interactive chat prompt opens right inside your terminal—already connected to that folder!'
          }
        },
        {
          heading: 'How installation and sign-in actually work',
          body: 'Setting up an AI CLI takes about two minutes on Linux, macOS, or Windows (via WSL/PowerShell):\n\n1. **Install the CLI**: For Claude Code, Anthropic provides a one-line official installer (or `npm install -g @anthropic-ai/claude-code` if you have Node.js installed).\n2. **Authenticate once**: The first time you run `claude`, it opens a normal browser login screen so you can sign in with either your eligible Claude subscription OR connect your pay-as-you-go Anthropic API key.\n3. **Confirm folder trust**: When you launch `claude` in a new folder, it asks *"Do you trust the files in this folder?"*—confirm only inside your own project folders, never random downloads!',
          callout: {
            type: 'warning',
            title: 'Always `cd` into a dedicated project folder first!',
            body: 'Never launch an AI coding CLI directly inside your giant home folder (`/home/you`) or root folder (`/`). Create a neat subfolder like `~/Marain-Projects/my-first-site`, `cd` into it, and launch `claude` there so its workspace stays tightly focused.'
          }
        },
        {
          heading: 'You can use the same mental model across every AI CLI',
          body: 'Even though this module highlights **Claude Code CLI** because of its crisp diff workflow and beginner clarity, every skill you learn here transfers directly to **Gemini CLI**, **Codex CLI**, **OpenCode**, and visual editors like **Cursor** or **Antigravity**. All of them share the same core heartbeat: stand in a project folder -> explain what you want -> review diffs -> verify -> save a Git checkpoint.',
          callout: {
            type: 'tip',
            title: 'No account needed to practice right now',
            body: 'You do not need to pay a cent or install Claude Code today to master the workflow—Marain’s Claude Code CLI Dojo lets you run through all 6 real-world CLI missions safely in Practice Mode first!'
          }
        }
      ],
      keyTakeaways: [
        'Claude Code CLI runs an AI agent directly inside your project folder, eliminating painful copy-paste cycles from browser tabs.',
        'Always `cd` into a dedicated project subfolder before running `claude` so the agent stays neatly scoped to that project.',
        'The core workflow—prompt, review diff, approve, verify, commit—transfers cleanly across Claude Code, Gemini CLI, Codex CLI, and AI editors.'
      ],
      glossaryTermIds: ['claude-code', 'cli', 'ai-harness', 'working-directory'],
      relatedLabId: 'claude-cli',
      quiz: [
        {
          id: 'q-5-2-1',
          type: 'multiple_choice',
          question: 'What is the biggest advantage of using an AI CLI like Claude Code inside your project folder instead of a plain browser chat?',
          options: [
            'It works without needing electricity.',
            'It makes all cloud APIs permanently free.',
            'It replaces your web browser.',
            'It can read your actual project files, propose clean diff edits, and run verification checks directly without manual copy-pasting.'
          ],
          correctIndex: 3,
          explanation:
            'Running inside your folder lets the AI harness inspect real files, make exact surgical edits with your approval, and verify changes directly—removing tedious copy-paste errors.'
        },
        {
          id: 'q-5-2-2',
          type: 'true_false',
          question:
            'Best practice is to `cd` into a dedicated project folder (such as `~/Marain-Projects/my-site`) before launching `claude`.',
          options: ['True', 'False'],
          correctIndex: 0,
          explanation:
            'True! Launching inside a dedicated project folder keeps the AI focused strictly on that project’s files and away from unrelated personal documents.'
        },
        {
          id: 'q-5-2-3',
          type: 'spot_mistake',
          question:
            'Devon opens his terminal (standing inside his entire `/home/devon` directory with personal tax PDFs and photos) and immediately runs `claude` saying "Clean up old unused files." Why is that a dangerous move?',
          options: [
            'Claude cannot run in Linux home folders.',
            'Tax PDFs break tokenizers.',
            'Running an agent from the top-level home folder gives it visibility into unrelated personal folders—always isolate projects inside their own dedicated subfolder.',
            'The terminal only works inside the Desktop folder.'
          ],
          correctIndex: 2,
          explanation:
            'Scope matters! Always keep each website or app in its own clean subfolder and `cd` into it before launching an AI coding CLI.'
        }
      ]
    },
    {
      id: 'ch-5-3',
      moduleId: 'mod-5-claude-cli',
      number: 3,
      title: 'Your First AI CLI Session: Explain, Edit, Review Diff & Undo',
      readMinutes: 5,
      xpReward: 35,
      summary:
        'Follow the gentle four-beat rhythm every confident AI builder uses: ask the AI to explain first, request one small edit, read the red-and-green diff before approving, and know how to undo in one second.',
      analogy: {
        title: 'Track Changes in Google Docs',
        body: 'If an editor suggests changes to your essay in Google Docs, old words show struck through in red and new words appear in green, with a neat Accept / Reject button on the side. An AI CLI **diff** works the exact same way—you never have to guess what changed or blindly accept edits.'
      },
      sections: [
        {
          heading: 'Step 1: Start by asking the AI to EXPLAIN before editing',
          body: 'When you open a project folder with `claude`, your very best opening prompt is NOT "rewrite everything." Start with curiosity:\n\n*"Explain what files are in this folder and what each one does, in plain English for a beginner."*\n\nIn five seconds, the agent reads the folder and hands you a friendly map. Asking for explanations first builds your confidence AND verifies that the AI actually sees the right files.',
          callout: {
            type: 'tip',
            title: 'You are allowed to ask "dumb" questions—all day long!',
            body: 'Never feel shy asking your CLI: "What does line 14 of styles.css do?" or "Explain why you suggested adding this button before making any edits." The terminal never judges you!'
          }
        },
        {
          heading: 'Step 2 & 3: Request one focused edit and read the Diff',
          body: 'Next, ask for ONE concrete improvement at a time—for instance: *"Add a welcoming hero banner at the top of `index.html` with a green Get Started button."*\n\nBefore saving anything, Claude Code pauses and displays a **Diff**:\n• Lines starting with **`-`** in **red** are lines being removed or replaced.\n• Lines starting with **`+`** in **green** are brand-new lines being added.\n• Unchanged lines sit around them in neutral gray for context.\n\nEven if you do not know every code keyword, you can scan the text strings, titles, colors, and file name! Confirm it is touching the file you expect, then press **Yes (`y`)** to approve—or **No (`n`)** to ask for a tweak.',
          callout: {
            type: 'example',
            title: 'Reading a 4-line diff takes 3 seconds',
            body: '```diff\n  <header>\n-   <h1>My Site</h1>\n+   <h1>Welcome to Bean & Book Cafe</h1>\n+   <a class="btn-green" href="#menu">Explore Menu</a>\n  </header>\n```\nRed = old title removed. Green = warm new title and button added. Clean, predictable, safe!'
          }
        },
        {
          heading: 'Step 4: The safety net—how Undo works with Git',
          body: 'What if you approve an edit, open the website in your browser, and think *"Hmm, actually that looked better five minutes ago"*?\n\nMeet **Git**, the free time machine built into almost every developer machine. If you initialize Git once (`git init`) and save a quick checkpoint (`git add . && git commit -m "Working homepage"`) whenever your project looks good, you unlock instant undo:\n\n• **`git status`** -> Shows exactly which files were modified since your last save point.\n• **`git diff`** -> Re-shows every red/green change made so far.\n• **`git checkout -- index.html`** -> Instantly restores `index.html` back to your clean saved version!\n\nOr even simpler: tell Claude Code itself, *"Undo the last change to index.html and explain what you reverted."*',
          callout: {
            type: 'warning',
            title: 'Save a Git checkpoint BEFORE asking for big redesigns',
            body: 'Just like saving your video game right before entering a boss room, running a quick Git commit before big layout experiments guarantees you can ALWAYS roll back with zero stress.'
          }
        }
      ],
      keyTakeaways: [
        'Start sessions by asking the AI CLI to explain the folder in plain English before changing anything.',
        'Read the red (`-` removed) and green (`+` added) Diff carefully to confirm which file is changing before pressing Approve.',
        'Git acts as an unlimited save-slot time machine: `git status` shows modified files and checkpoints let you undo any experiment cleanly.'
      ],
      glossaryTermIds: ['diff', 'claude-code', 'git', 'commit', 'human-in-the-loop'],
      relatedLabId: 'claude-cli',
      quiz: [
        {
          id: 'q-5-3-1',
          type: 'multiple_choice',
          question: 'When an AI CLI shows you a Diff preview before editing a file, what do green lines marked with `+` mean?',
          options: [
            'Lines that caused an internet error.',
            'New lines that will be added to the file if you approve.',
            'Old lines being permanently deleted.',
            'Secret API keys.'
          ],
          correctIndex: 1,
          explanation:
            'In every standard Diff view, red `-` lines are removals and green `+` lines are additions—just like Track Changes in a document.'
        },
        {
          id: 'q-5-3-2',
          type: 'true_false',
          question:
            'Saving a Git commit right before trying a big redesign lets you roll back easily if the new experiment does not look right.',
          options: ['True', 'False'],
          correctIndex: 0,
          explanation:
            'True! A Git commit is a clean, permanent save point you can inspect or restore at any time.'
        },
        {
          id: 'q-5-3-3',
          type: 'spot_mistake',
          question:
            'Chris opens Claude Code in a folder with 12 files and clicks "Auto-approve all edits" without reading diffs or creating a Git checkpoint. Halfway through, the site breaks and he cannot remember what changed. What two habits would have protected him?',
          options: [
            'Saving a Git commit first and reviewing small focused diffs one step at a time.',
            'Increasing font size and unplugging Wi-Fi.',
            'Deleting `index.html` before starting.',
            'Using ALL CAPS in prompts.'
          ],
          correctIndex: 0,
          explanation:
            'Small edits + reading diffs + Git checkpoints turn AI building into a calm, reversible creative process where mistakes never hurt!'
        }
      ]
    },
    {
      id: 'ch-5-4',
      moduleId: 'mod-5-claude-cli',
      number: 4,
      title: 'Power Workflows: Planning, Pasting Errors, `/compact` & Git Safety',
      readMinutes: 5,
      xpReward: 35,
      summary:
        'Level up from curious beginner to smooth AI builder with four effortless everyday workflows: Plan-before-edit, pasting exact errors or screenshots, compacting memory, and keeping Git tidy.',
      analogy: {
        title: 'Measure Twice, Cut Once—With a Tidy Workbench',
        body: 'Great woodworkers do not grab a saw the instant they walk in. They sketch a quick plan on paper (Plan Mode), snap a photo when a joint looks crooked (Screenshots & Exact Errors), sweep sawdust off the bench between projects (`/compact`), and double-check their work before gluing (Git Safety).'
      },
      sections: [
        {
          heading: 'Workflow 1: Plan first, edit second',
          body: 'When you want something bigger than a tiny tweak—say, adding a dark mode toggle plus saving the user’s preference—do NOT ask the AI to jump straight into editing five files at once.\n\nInstead, ask for a **plan first**: *"Do not edit any files yet. Propose a simple 3-step plan for adding a dark mode toggle and list which files you will touch."* Many CLIs (including Claude Code) even have a dedicated **Plan Mode** toggle! Reviewing a 5-line plan takes ten seconds and prevents 90% of messy detours.',
          callout: {
            type: 'tip',
            title: 'The magic phrase for calm building',
            body: 'Start bigger requests with: **"Before changing code, explain your plan in 4 short bullets and wait for my go-ahead."** You will feel like a real tech lead immediately!'
          }
        },
        {
          heading: 'Workflow 2: Paste exact error messages & screenshots—never vague summaries',
          body: 'Remember how multimodal modern models are? When something looks crooked on your webpage or throws a red error, avoid typing *"It broke, please fix it."*\n\nGive the AI two golden clues instead:\n1. **Copy-paste the exact error text** from your terminal or browser console word for word.\n2. **Paste a screenshot** right into the CLI or chat so the AI can literally see the misaligned button or squished mobile layout with its own eyes!',
          callout: {
            type: 'example',
            title: 'Vague report vs. Pro bug report',
            body: 'Vague: "The button doesn’t work."\nPro: "When I click Calculate, nothing happens and the browser console shows: `TypeError: Cannot read properties of null (reading value) at script.js:29`. Please explain why and fix it."'
          }
        },
        {
          heading: 'Workflow 3 & 4: Sweep the desk with `/compact` & protect your work with Git',
          body: 'After finishing one feature—like your homepage navigation—your terminal conversation may have piled up dozens of file reads and diffs. Running **`/compact`** summarizes the key decisions and wipes away old clutter from the context window, making your next feature faster, smarter, and cheaper! (And `/clear` starts an even fresher slate when jumping to a totally different task.)\n\nPair that with one quick Git habit after every small milestone: ask your CLI *"Show `git status`, make sure `.env` is ignored, and commit this working milestone with a clear message."* Clean desk + saved checkpoint = unstoppable momentum.',
          callout: {
            type: 'warning',
            title: 'One golden boundary for terminal commands',
            body: 'If an AI CLI ever asks to run a command containing `rm -rf`, `sudo`, or uploading secrets outside your project folder, always pause and hit **No** unless you completely understand what it does.'
          }
        }
      ],
      keyTakeaways: [
        'Ask your AI CLI for a short plain-English plan BEFORE editing multiple files ("Measure twice, cut once").',
        'Always share exact error text and screenshots instead of vague descriptions like "it broke."',
        'Use `/compact` between milestones to keep the context window crisp and cheap, and commit working milestones in Git.'
      ],
      glossaryTermIds: ['compact-command', 'claude-code', 'git', 'console-error', 'multimodal'],
      relatedLabId: 'claude-cli',
      quiz: [
        {
          id: 'q-5-4-1',
          type: 'multiple_choice',
          question: 'When is the best time to run `/compact` during a long Claude Code CLI session?',
          options: [
            'Never—it deletes your actual website files.',
            'Only when your computer battery is below 10%.',
            'Before installing the terminal.',
            'Right after finishing a milestone (like the header) so old clutter is summarized and the context window stays sharp and affordable.'
          ],
          correctIndex: 3,
          explanation:
            '`/compact` leaves all your real files untouched—it simply summarizes the chat history to clear clutter off the AI’s working desk between milestones.'
        },
        {
          id: 'q-5-4-2',
          type: 'true_false',
          question:
            'Asking an AI CLI to outline a short plan before editing files helps prevent messy unintended changes.',
          options: ['True', 'False'],
          correctIndex: 0,
          explanation:
            'True! Catching a misunderstanding in a 4-bullet plan takes seconds, whereas untangling unnecessary edits across six files takes much longer.'
        },
        {
          id: 'q-5-4-3',
          type: 'spot_mistake',
          question:
            'Aisha’s contact form button looks overlapping on her phone screen, so she types into Claude Code: "The page looks kinda ugly, fix it." How could she get a 10× better fix in one try?',
          options: [
            'Type the exact same sentence three times.',
            'Delete the CSS file completely.',
            'Paste a screenshot of the overlapping button and state specifically: "On mobile width, the Submit button overlaps the email field—stack them vertically with 12px spacing."',
            'Turn off Git.'
          ],
          correctIndex: 2,
          explanation:
            'Specific visual details plus a screenshot tell the AI the exact problem and exact desired fix—leading to a surgical 3-line CSS improvement on the first attempt.'
        }
      ]
    }
  ]
};
