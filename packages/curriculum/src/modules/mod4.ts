import type { CurriculumModule } from '../schema.ts';

export const MODULE_4: CurriculumModule = {
  id: 'mod-4-harnesses-agents',
  number: 4,
  title: 'AI Harnesses, Tools & Agents',
  subtitle: 'Understand the leap from text-only chatbots to AI agents that read files, use tools, and ship real work.',
  icon: 'cpu',
  accentHex: '#8B5CF6',
  estimatedMinutes: 18,
  recommendedLabId: 'harness-agent',
  chapters: [
    {
      id: 'ch-4-1',
      moduleId: 'mod-4-harnesses-agents',
      number: 1,
      title: 'Model vs. Harness: The Engine and the Car',
      readMinutes: 4,
      xpReward: 30,
      summary:
        'Why does the exact same AI model feel mediocre in one app and magical in another? The secret is the AI Harness—the software body wrapped around the model.',
      analogy: {
        title: 'Same Engine, Completely Different Vehicles',
        body: 'Put the exact same powerful engine inside a bare go-kart with no headlights or steering wheel, and you barely leave the driveway. Put that exact same engine inside a finely tuned rally car with GPS, brakes, suspension, and a dashboard, and you conquer mountain roads. In AI, the LLM is the engine and the AI Harness is the car.'
      },
      sections: [
        {
          heading: 'What an AI Harness actually does',
          body: 'You have probably heard builders argue about Claude Code, Cursor, Windsurf, or Antigravity—even when those tools all call the exact same underlying Claude, Gemini, or GPT models! Why do they feel so different?\n\nBecause an **AI Harness** is the complete orchestration program wrapped around the raw model. It controls:\n\n• **What context enters the desk**: Automatically loading the right project files and instructions.\n• **Which tools exist**: Wiring up file reading, editing, terminal commands, or browser previews.\n• **How steps repeat**: Running the model in a loop until tests actually pass.\n• **Safety guardrails**: Pausing for your approval before running risky actions and keeping context trimmed.',
          callout: {
            type: 'example',
            title: 'Raw model vs. Harnessed agent on one task',
            body: 'Ask a raw chatbot: "Fix the broken signup button in my project." It can only reply with guesses like "Try checking line 20 of your HTML." Ask the exact same model inside a coding harness: it opens your real files, spots the exact typo on line 47, edits it, runs the test suite, and confirms the button works!'
          }
        },
        {
          heading: 'Why great harnesses matter just as much as smarter models',
          body: 'Imagine hiring a world-class architect—then locking them in a dark room with no measuring tape, no blueprints, and no phone. Even a genius cannot remodel your kitchen from inside a locked closet!\n\nA well-built harness unlocks the room: it hands the model accurate blueprints (your files), a tape measure (tests and terminal checks), and clean safety locks so it cannot knock down a load-bearing wall without asking you first.',
          callout: {
            type: 'myth',
            title: 'Myth Buster: "Claude Code is a completely different LLM than Claude"',
            body: 'Claude Code is a **harness** (specifically a command-line agent harness) powered by Claude models. The magic comes from combining a strong model with great file tools, clear diff reviews, and smart context management.'
          }
        },
        {
          heading: 'What makes a beginner-friendly harness',
          body: 'When evaluating any AI tool, look past flashy demos and check four practical harness traits:\n\n1. **Transparency**: Does it show you which files it read and what lines it wants to change?\n2. **Approval controls**: Can you say Yes or No before edits or commands run?\n3. **Context hygiene**: Does it help keep long sessions tidy (like `/compact`)?\n4. **Easy undo**: Does it work smoothly with Git or checkpoints so mistakes take one second to reverse?',
          callout: {
            type: 'tip',
            title: 'Experience it side by side',
            body: 'In the Harness & Agent Simulator lab, you can run the exact same bug-fix mission first with a Raw Model (zero tools) and then with Harness capabilities toggled on—you will immediately see the Engine vs. Car difference.'
          }
        }
      ],
      keyTakeaways: [
        'The LLM is the engine; the AI Harness is the surrounding software (context loading, tools, execution loop, and safety controls) that turns raw intelligence into real action.',
        'The exact same model can behave dramatically better inside a thoughtful harness than inside a plain text box.',
        'Good harnesses give you clear visibility, approval prompts before changes, and safe undo.'
      ],
      glossaryTermIds: ['ai-harness', 'ai-agent', 'llm', 'human-in-the-loop'],
      relatedLabId: 'harness-agent',
      quiz: [
        {
          id: 'q-4-1-1',
          type: 'multiple_choice',
          question: 'In the "Engine vs. Car" analogy, what role does the AI Harness play?',
          options: [
            'The complete surrounding vehicle—tools, context manager, execution loop, and safety brakes—that lets the raw model get real work done.',
            'The fuel bill you pay every month.',
            'The training dataset used years ago.',
            'Your internet router.'
          ],
          correctIndex: 0,
          explanation:
            'The LLM is the engine; the AI harness provides the steering, tools, context management, and safety checks that let the engine actually inspect files and finish tasks.'
        },
        {
          id: 'q-4-1-2',
          type: 'true_false',
          question:
            'Two different AI coding apps using the exact same underlying model can produce very different results depending on the quality of their harness.',
          options: ['True', 'False'],
          correctIndex: 0,
          explanation:
            'True! How a harness selects files, formats tool outputs, runs verification tests, and manages the context window makes a massive difference in real-world reliability.'
        },
        {
          id: 'q-4-1-3',
          type: 'spot_mistake',
          question:
            'Ben pastes "Fix my website’s broken navigation menu" into a plain web chatbot without sharing any files, and gets frustrated when the AI cannot edit his laptop directly. What is he missing?',
          options: [
            'He forgot to upgrade his Wi-Fi speed.',
            'AI models are legally blocked from editing HTML.',
            'Websites cannot have navigation menus.',
            'A plain web chatbot has no local file-editing harness—he either needs to paste the files in or use a local harness like Claude Code CLI that has tools to inspect and edit his folder.'
          ],
          correctIndex: 3,
          explanation:
            'A raw chat box in your browser is sandboxed away from your local hard drive. To read and patch project files directly, the model needs a harness equipped with file tools!'
        }
      ]
    },
    {
      id: 'ch-4-2',
      moduleId: 'mod-4-harnesses-agents',
      number: 2,
      title: 'Tool Calling & MCP: The "USB-C" for AI',
      readMinutes: 5,
      xpReward: 30,
      summary:
        'A language model only outputs text—so how on earth does it read files, check calendars, or search databases? Meet Tool Calling and MCP (Model Context Protocol), the universal plug connecting AI to your world.',
      analogy: {
        title: 'A Brain Passing Request Slips + USB-C Plugs',
        body: 'Imagine a brilliant strategist sitting behind a glass wall. They cannot touch a keyboard directly, so they write a structured request slip: "TOOL: read_file, PATH: menu.html" and slide it under the glass. The harness reads the slip, fetches the file, and slides the contents back! MCP is like standardizing all those tools onto USB-C so one universal cable plugs into any AI app.'
      },
      sections: [
        {
          heading: 'How tool calling works behind the curtain',
          body: 'Even inside the fanciest agent, an LLM still NEVER directly clicks your mouse or edits your hard drive. Instead, the harness sends the model a menu of available tools in its system prompt—such as `read_file`, `edit_file`, `search_web`, or `run_tests`.\n\nWhen the model realizes it needs fresh information, it pauses normal chat and emits a structured **tool call** (a tiny JSON slip like `{"tool": "read_file", "path": "index.html"}`). The harness catches that slip, checks permissions, executes the real tool, and hands the exact result back to the model as the next message!',
          callout: {
            type: 'example',
            title: 'A three-second tool call in action',
            body: '1. You ask: "How many rows are in sales.csv?"\n2. Model emits tool call: `read_file("sales.csv")`\n3. Harness reads the real file from disk and returns 142 rows.\n4. Model counts accurately (or runs a tiny script) and answers: "There are 142 rows—zero guessing!"'
          }
        },
        {
          heading: 'The old cable mess—and why MCP was invented',
          body: 'Before 2024, connecting AI to external tools was a nightmare. If you built a Slack integration for ChatGPT, it would not work in Claude or VS Code—every single app needed its own custom glue code. It was like the old days when every Nokia, Sony, and camera needed a completely different charger.\n\n**MCP (Model Context Protocol)** solved this with one open standard: **"USB-C for AI."** Build an MCP server once for Notion, Google Drive, GitHub, Figma, or a database, and ANY MCP-compatible AI harness can plug straight into it in seconds.',
          callout: {
            type: 'tip',
            title: 'Two halves of an MCP plug',
            body: 'Your AI app (like Claude Code, Claude Desktop, or an IDE) is the **MCP Host/Client**. Each tool connector (like a GitHub or Google Calendar plugin) is a tiny **MCP Server**. Plug them together and your AI immediately learns new capabilities.'
          }
        },
        {
          heading: 'Staying safe when connecting tools',
          body: 'Connecting AI to real tools is exhilarating—and deserves common-sense guardrails. Give tools the **minimum permissions** they need: start with read-only access (reading calendar or files) before granting write/send access (sending emails or deleting files).\n\nAlso keep your eyes open for untrusted text from the internet: never let an agent automatically run purchases, send emails to strangers, or delete folders without your explicit human approval.',
          callout: {
            type: 'warning',
            title: 'Read-only vs. Write actions',
            body: 'Reading a file or searching docs is harmless. Editing files, sending Slack messages, or running terminal commands changes the real world—keep approval prompts ON for write actions until you trust the workflow!'
          }
        }
      ],
      keyTakeaways: [
        'Tool calling lets an LLM output a structured request slip asking its harness to read files, search the web, or run commands and return real results.',
        'MCP (Model Context Protocol) is "USB-C for AI"—one universal open standard letting any AI harness connect cleanly to external tools and data.',
        'Start with read-only permissions and keep human approval enabled for actions that edit, delete, or send messages.'
      ],
      glossaryTermIds: ['tool-calling', 'mcp', 'ai-harness', 'human-in-the-loop'],
      relatedLabId: 'harness-agent',
      quiz: [
        {
          id: 'q-4-2-1',
          type: 'multiple_choice',
          question: 'Why is MCP (Model Context Protocol) often nicknamed "USB-C for AI"?',
          options: [
            'It charges your laptop faster while chatting with AI.',
            'It only works with physical USB cables.',
            'It provides one open universal standard so any compatible AI app can plug into external tools and data sources without custom one-off connectors.',
            'It replaces the need for an LLM.'
          ],
          correctIndex: 2,
          explanation:
            'Just like USB-C ended the drawer full of mismatched chargers, MCP gives every AI harness and tool provider one shared way to connect cleanly.'
        },
        {
          id: 'q-4-2-2',
          type: 'true_false',
          question:
            'During tool calling, the raw AI model secretly bypasses the harness and edits files directly on your computer without the harness knowing.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! The model only outputs a structured text request asking for a tool. The harness receives that request, enforces your permissions/approvals, runs the tool, and sends the result back.'
        },
        {
          id: 'q-4-2-3',
          type: 'spot_mistake',
          question:
            'On day one, Sam connects his AI assistant to his work email MCP server and sets "Auto-approve sending emails without asking me." What risk did he overlook?',
          options: [
            'MCP does not support email.',
            'Giving auto-approve write/send permission lets a single misunderstood instruction or hallucination fire off real emails to coworkers before Sam can review them.',
            'Email requires open-weights models.',
            'Auto-approve uses 100× more tokens.'
          ],
          correctIndex: 1,
          explanation:
            'Always separate read-only convenience from real-world write actions! Let AI draft emails freely, and keep a human-in-the-loop "Approve Send" button turned on.'
        }
      ]
    },
    {
      id: 'ch-4-3',
      moduleId: 'mod-4-harnesses-agents',
      number: 3,
      title: 'How AI Agents Loop: Think, Act, Observe, Approve',
      readMinutes: 4,
      xpReward: 30,
      summary:
        'A regular chatbot speaks once and stops. An AI agent runs in a self-correcting loop—thinking, using a tool, checking real feedback, pausing for your approval, and repeating until the job actually works.',
      analogy: {
        title: 'Assembling a Bookshelf One Check at a Time',
        body: 'Nobody builds a bookshelf with their eyes closed in one motion. You look at the manual (Think), tighten two screws (Act), give the shelf a gentle wiggle to see if it holds straight (Observe), and tighten a loose bolt before moving on. An AI agent works the exact same way—checking real feedback after every step instead of guessing blindly.'
      },
      sections: [
        {
          heading: 'Single-shot chat vs. the multi-step Agent Loop',
          body: 'In a traditional one-turn chat, you ask a question and the AI takes a single blind swing. If its first draft of code has a tiny typo, the chat just ends and leaves you stuck.\n\nAn **AI Agent** wraps the model in a repeating loop:\n\n1. **Think**: Break the goal into the next concrete step.\n2. **Act**: Call a tool (read a file, edit CSS, run a test).\n3. **Observe**: Read the real output—did the test pass, or did an error appear?\n4. **Repeat (or Finish)**: If an error popped up, adjust the plan and try again; once checks pass, present a clear summary to you!',
          callout: {
            type: 'example',
            title: 'Watching an agent fix a real bug in 4 beats',
            body: 'Goal: "Make the newsletter form validate emails."\n• Loop 1: Reads `form.js` to see existing code.\n• Loop 2: Adds email validation + asks you to approve the diff.\n• Loop 3: Runs tests—spots a typo on line 18 in the error output!\n• Loop 4: Fixes line 18, re-runs tests -> All green -> Reports Done!'
          }
        },
        {
          heading: 'Human-in-the-Loop: you stay the pilot',
          body: 'People sometimes picture "AI Agents" as runaway robots doing mysterious things while you sleep. In everyday beginner building, the best agents are **collaborative co-pilots** with built-in **Human-in-the-Loop** checkpoints.\n\nWhenever the agent wants to edit a file, install software, or run a shell command, it pauses and shows you exactly what it plans to do. You click **Approve** (or say *"Wait, keep the button blue instead"*). You never lose control of your project.',
          callout: {
            type: 'tip',
            title: 'Give the agent a way to verify its own work',
            body: 'Agents get 10× smarter the moment they can **observe** reality! Telling an agent "Run the test command after editing" or "Check the live preview" lets it catch and fix its own tiny slips automatically.'
          }
        },
        {
          heading: 'When agents get stuck—and how to unstick them in 10 seconds',
          body: 'Occasionally an agent falls into a spin: trying the same broken fix three times in a row. As the human pilot, spotting a loop is easy—just press Stop (or `Esc` / `Ctrl+C`) and nudge it out:\n\n• Ask it to step back: *"Pause editing. Explain in 3 plain sentences why this error keeps happening."*\n• Shrink the step: break a huge request into one tiny verifiable piece.\n• Clear cluttered context if the thread has been spinning for a long time.',
          callout: {
            type: 'warning',
            title: 'Never leave an unguarded agent looping forever',
            body: 'Every loop step sends the conversation back to the model—which consumes tokens! Always supervise agents on new tasks, set billing caps, and interrupt early if you see it repeating itself.'
          }
        }
      ],
      keyTakeaways: [
        'An AI agent runs a repeating Think -> Act -> Observe loop so it can inspect real results and fix mistakes instead of guessing once.',
        'Human-in-the-Loop checkpoints keep you in the driver’s seat, letting you approve edits and steer direction at every key step.',
        'If an agent repeats a failing step twice, pause it, ask for a plain-English diagnosis, or break the goal into a smaller step.'
      ],
      glossaryTermIds: ['ai-agent', 'agent-loop', 'human-in-the-loop', 'tool-calling'],
      relatedLabId: 'harness-agent',
      quiz: [
        {
          id: 'q-4-3-1',
          type: 'multiple_choice',
          question: 'What is the correct repeating sequence of a standard AI Agent Loop?',
          options: [
            'Think -> Act (call a tool) -> Observe (read real output) -> Adjust or Finish',
            'Guess -> Delete -> Reboot',
            'Train -> Publish -> Forget',
            'Ask once -> Never check if it worked'
          ],
          correctIndex: 0,
          explanation:
            'The power of an agent comes from observing real feedback (file contents, error logs, test results) after each action and adapting until the goal is verified.'
        },
        {
          id: 'q-4-3-2',
          type: 'true_false',
          question:
            'Using an AI agent means you must let it make unlimited changes automatically without ever reviewing or approving its actions.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! Human-in-the-Loop approvals are a core feature of safe AI harnesses—you stay in charge and approve file edits or commands as you go.'
        },
        {
          id: 'q-4-3-3',
          type: 'spot_mistake',
          question:
            'An agent tries the exact same broken command four times in a row while building Leo’s app. Leo walks away for lunch hoping attempt #25 works. What should Leo have done instead?',
          options: [
            'Bought a faster mouse.',
            'Deleted the entire project.',
            'Raised the temperature to 2.0.',
            'Stopped the loop right away (saving tokens), asked the agent to diagnose the root cause in plain English, or narrowed the task to one smaller step.'
          ],
          correctIndex: 3,
          explanation:
            'An agent stuck repeating a failed step burns tokens without making progress. Interrupt early, ask for a plain-English diagnosis, and give it a cleaner clue or smaller step!'
        }
      ]
    },
    {
      id: 'ch-4-4',
      moduleId: 'mod-4-harnesses-agents',
      number: 4,
      title: 'Instruction Files (`CLAUDE.md`), Rules & Skills',
      readMinutes: 4,
      xpReward: 30,
      summary:
        'Tired of repeating your project preferences every time you start a new chat? Learn how plain-English instruction files like `CLAUDE.md`, rules, and reusable skills give your AI permanent house manners.',
      analogy: {
        title: 'The Fridge Note vs. The Recipe Card Box',
        body: 'Imagine hiring a helpful house-sitter. Taped right on the fridge is a short welcome note (`CLAUDE.md` / Rules): "Lock the back porch, feed the cat half a scoop, never touch the breaker box." Tucked in a drawer is a recipe card box (Skills): they only pull out the "How to Restart the Wi-Fi Router" card on the rare day the internet drops.'
      },
      sections: [
        {
          heading: 'What is `CLAUDE.md` (or `AGENTS.md`)?',
          body: 'Because every fresh AI session starts with a clean desk, repeating *"This is a beginner site using plain HTML and CSS, please keep design warm and minimal, and always explain changes simply"* gets old fast.\n\nModern AI harnesses solve this with a plain-English markdown file sitting right at the top of your project folder—called **`CLAUDE.md`** in Claude Code (and `AGENTS.md` or `.cursorrules` in other tools). The instant you start a new session in that folder, the harness automatically reads that note onto the AI’s working desk!',
          callout: {
            type: 'example',
            title: 'A real, beginner-friendly `CLAUDE.md` in 6 lines',
            body: '```markdown\n# My Cafe Website\n- Built with plain HTML, CSS, and vanilla JS (no complex frameworks).\n- Warm cream background (#FFFBF5) and dark espresso text.\n- Explain every edit to me in simple, jargon-free English.\n- Never touch files outside this folder or hardcode API keys.\n- After editing, tell me how to preview my change in the browser.\n```'
          }
        },
        {
          heading: 'Rules vs. Skills: knowing what goes where',
          body: 'As your projects grow, putting 500 lines of instructions into one fridge note crowds the AI’s working desk on every single turn. That is why modern harnesses split instructions cleanly into two buckets:\n\n• **Rules (always-on)**: Short, universal house manners that apply to EVERY task—your project stack, tone, safety boundaries, and naming style. Keep them brief and punchy!\n• **Skills (on-demand playbooks)**: Detailed step-by-step guides stored separately and loaded ONLY when relevant—like a "Deploy to Netlify" checklist or an "Accessible Color Audit" playbook.',
          callout: {
            type: 'tip',
            title: 'Update your `CLAUDE.md` whenever the AI repeats a mistake',
            body: 'Did the AI install a giant library you did not ask for, or switch fonts without permission? Add one calm bullet to `CLAUDE.md` ("Ask before adding any new npm package"). You just prevented that mistake forever!'
          }
        },
        {
          heading: 'You do not even have to write it from scratch',
          body: 'Even better: tools like Claude Code include a one-word command (`/init`) that scans your project folder and drafts a tidy starter `CLAUDE.md` for you! You simply read it in plain English, trim anything unnecessary, and add two or three personal preferences.\n\nKeeping instruction files short, concrete, and human-readable is one of the highest-leverage habits in all of AI building.',
          callout: {
            type: 'myth',
            title: 'Myth Buster: "Instruction files have to be written in special computer code"',
            body: 'Not at all! `CLAUDE.md`, rules, and skills are written in ordinary, clear English bullet points. If a bright human teammate would understand your note, your AI agent will too.'
          }
        }
      ],
      keyTakeaways: [
        'A `CLAUDE.md` (or `AGENTS.md`) file sits in your project folder and automatically tells your AI harness your project layout, style, and boundaries every session.',
        'Keep always-on Rules short and universal so they do not bloat the context window; store specialized step-by-step checklists as on-demand Skills.',
        'Instruction files are just plain English—whenever an AI makes a recurring mistake, add one clear bullet rule to prevent it permanently.'
      ],
      glossaryTermIds: ['claude-md', 'skills-and-rules', 'system-prompt', 'context-window'],
      relatedLabId: 'harness-agent',
      quiz: [
        {
          id: 'q-4-4-1',
          type: 'multiple_choice',
          question: 'Why is a `CLAUDE.md` file placed at the root of a project folder so useful?',
          options: [
            'It automatically pays your API bill.',
            'It turns HTML into a mobile app overnight.',
            'The AI harness reads it automatically at the start of every session so you never have to re-explain your project rules and preferences.',
            'It hides your folder from the operating system.'
          ],
          correctIndex: 2,
          explanation:
            '`CLAUDE.md` acts like a permanent welcome brief for your project—loaded automatically so every fresh AI session respects your style, tools, and boundaries from message #1.'
        },
        {
          id: 'q-4-4-2',
          type: 'true_false',
          question:
            'You need to know a special programming language to write a helpful `CLAUDE.md` or Skill file.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! Clear, concise everyday English bullet points are the very best format for `CLAUDE.md`, rules, and skills.'
        },
        {
          id: 'q-4-4-3',
          type: 'spot_mistake',
          question:
            'Elena pastes a 25-page company handbook covering ten unrelated projects into her `CLAUDE.md` file so the AI "knows everything." What problem will that create?',
          options: [
            'Markdown files cannot exceed 10 lines.',
            'Loading 25 irrelevant pages on every single message wastes tokens and clutters the context window—keep always-on rules short and put niche playbooks into on-demand Skills.',
            'The AI will refuse to read files over 1 page.',
            'It deletes her Git history.'
          ],
          correctIndex: 1,
          explanation:
            'Always-on instructions occupy the working desk on every turn! Keep `CLAUDE.md` lean and focused, and move specialized step-by-step guides into Skills loaded only when needed.'
        }
      ]
    }
  ]
};
