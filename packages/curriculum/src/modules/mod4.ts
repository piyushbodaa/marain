import type { CurriculumModule } from '../schema.ts';

export const MODULE_4: CurriculumModule = {
  id: 'mod-4-harnesses-agents',
  number: 4,
  title: 'AI Harnesses, Tools & Agents',
  subtitle: 'Understand the leap from text-only chatbots to AI agents that read files, use tools, and ship real work safely.',
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
          body: 'You have probably heard builders compare Claude Code, Cursor, Windsurf, or Antigravity—even when those tools call the exact same underlying Claude, Gemini, or GPT models. Why do they feel so different?\n\nBecause an **AI Harness** is the complete orchestration program wrapped around the raw model. It controls:\n\n• **What context enters the desk**: Loading the right project files and instructions.\n• **Which tools exist**: Wiring up file reading, editing, terminal commands, or previews.\n• **How steps repeat**: Running the model in a loop until checks actually pass.\n• **Safety guardrails**: Enforcing least-privilege permissions, pausing for your approval before sensitive actions, and keeping context trimmed.',
          callout: {
            type: 'example',
            title: 'Raw model vs. Harnessed agent on one task',
            body: 'Ask a raw chatbot: "Fix the broken signup button in my project." It can only reply with guesses like "Try checking line 20 of your HTML." Ask the exact same model inside a coding harness: it opens your real files, spots the exact typo on line 47, proposes a surgical diff, runs the tests, and confirms the fix.'
          }
        },
        {
          heading: 'Why great harnesses matter just as much as smarter models',
          body: 'Imagine hiring a world-class architect—then locking them in a dark room with no measuring tape, no blueprints, and no phone. Even a genius cannot remodel your kitchen from inside a locked closet!\n\nA well-built harness unlocks the room: it hands the model accurate blueprints (your files), a tape measure (tests and checks), and real permission boundaries so it cannot knock down a load-bearing wall without asking you first.',
          callout: {
            type: 'myth',
            title: 'Myth Buster: "Claude Code is a completely different LLM than Claude"',
            body: 'Claude Code is a **harness** (specifically a command-line agent harness) powered by Claude models. Its power comes from pairing a strong model with file tools, diff reviews, permission controls, and smart context management.'
          }
        },
        {
          heading: 'What makes a beginner-friendly harness',
          body: 'When evaluating any AI tool, look past flashy demos and check four practical harness traits:\n\n1. **Transparency**: Does it show you which files it read and what exact lines it wants to change?\n2. **Permission controls**: Can you scope access tightly and say Yes or No before sensitive reads, edits, or commands run?\n3. **Context hygiene**: Does it help keep long sessions tidy (like `/compact`)?\n4. **Easy undo**: Does it pair smoothly with Git checkpoints so mistakes are easy to inspect and revert?',
          callout: {
            type: 'tip',
            title: 'Quick phone test: spot the harness layer',
            body: 'Next time an AI tool impresses you by searching docs, running code, or showing diffs, ask yourself: "Which part was the raw LLM predicting text, and which part was the harness executing tools?"'
          }
        }
      ],
      keyTakeaways: [
        'The LLM is the engine; the AI Harness is the surrounding software (context loading, tools, execution loop, and permission controls) that turns raw intelligence into real action.',
        'The exact same model can behave dramatically better inside a thoughtful harness than inside a plain text box.',
        'Good harnesses give you clear visibility, explicit approval checkpoints, least-privilege permissions, and clean Git undo.'
      ],
      glossaryTermIds: ['ai-harness', 'ai-agent', 'llm', 'human-in-the-loop'],
      relatedLabId: null,
      quiz: [
        {
          id: 'q-4-1-1',
          type: 'multiple_choice',
          question: 'In the "Engine vs. Car" analogy, what role does the AI Harness play?',
          options: [
            'The surrounding vehicle—tools, context, loop, and safety controls.',
            'The private training corpus used by the lab to tune model weights months earlier.',
            'The billing account and token pricing sheet that tracks your monthly API usage.',
            'The tokenizer dictionary that splits incoming English sentences into numeric IDs.'
          ],
          correctIndex: 0,
          explanation:
            'The LLM is the engine; the AI harness provides the tools, context management, execution loop, and safety controls that let the engine actually inspect files and finish tasks.'
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
            'Ben pastes "Fix my website’s broken navigation menu" into a plain web chatbot without sharing any files, and gets frustrated when it cannot edit his project directly. What is he missing?',
          options: [
            'Web chatbots need temperature 0.0 to reach local folders.',
            'HTML files can only be modified by open-weights models running offline through Ollama.',
            'He forgot to paste his personal API key into the web chat so it could unlock file permissions.',
            'A plain web chat has no local file harness—he must share the code or use a local tool.'
          ],
          correctIndex: 3,
          explanation:
            'A plain browser chatbot is isolated from your local hard drive. To read and edit project files directly, the model needs a local harness with explicit file permissions!'
        }
      ]
    },
    {
      id: 'ch-4-2',
      moduleId: 'mod-4-harnesses-agents',
      number: 2,
      title: 'Tool Calling, MCP & Real Permission Hygiene',
      readMinutes: 5,
      xpReward: 30,
      summary:
        'A language model only outputs text—so how does it read files or query services? Meet Tool Calling and MCP (Model Context Protocol), plus the real security risks of both reads and writes.',
      analogy: {
        title: 'A Brain Passing Request Slips + USB-C Plugs',
        body: 'Imagine a strategist behind a glass wall. They cannot touch a keyboard directly, so they write a structured request slip: "TOOL: read_file, PATH: menu.html" and slide it under the glass. The harness checks permissions, fetches the file, and slides the contents back. MCP standardizes those tool plugs like USB-C so one connector works across many AI apps.'
      },
      sections: [
        {
          heading: 'How tool calling works behind the curtain',
          body: 'Even inside the fanciest agent, an LLM NEVER directly clicks your mouse or modifies disk files. Instead, the harness gives the model a menu of permitted tools—such as `read_file`, `edit_file`, `search_web`, or `run_tests`.\n\nWhen the model needs fresh information, it emits a structured **tool call** (a JSON slip like `{"tool": "read_file", "path": "index.html"}`). The harness catches that slip, checks your permission rules and approval settings, runs the tool, and hands the output back to the model.',
          callout: {
            type: 'example',
            title: 'A three-second tool call in action',
            body: '1. You ask: "How many rows are in sales.csv?"\n2. Model emits tool call: `read_file("sales.csv")`\n3. Harness checks permissions, reads the file, and returns 142 rows.\n4. Model reports the real count instead of guessing.'
          }
        },
        {
          heading: 'The old cable mess—and why MCP was invented',
          body: 'Before 2024, connecting AI to external tools meant custom glue code for every single app—like the days when every phone needed its own proprietary charger.\n\n**MCP (Model Context Protocol)** created one open standard: **"USB-C for AI."** Build an MCP server once for Notion, Google Drive, GitHub, or a database, and any MCP-compatible AI harness can plug straight into it using one shared protocol.',
          callout: {
            type: 'tip',
            title: 'Two halves of an MCP plug',
            body: 'Your AI app is the **MCP Host/Client**. Each connector plugin (like a GitHub or Calendar integration) is a tiny **MCP Server**. Only install MCP servers from publishers you trust, because they execute code with whatever permissions you grant.'
          }
        },
        {
          heading: 'Why BOTH reads and writes need permission guardrails',
          body: 'A common myth is that read-only access is always completely safe. In reality, **both reads and writes carry real risks**:\n\n• **Sensitive reads risk data exfiltration**: If an agent can read `.env`, `~/.ssh`, private emails, or tax files AND also has network or messaging tools, a single trick can leak those secrets out.\n• **Untrusted content carries indirect prompt injection**: Reading a random web page, email, or GitHub issue can smuggle hidden instructions telling the agent to steal data or run commands!\n• **Write/send actions have real-world impact**: Always apply **least privilege** (narrow scopes, exclude secret files, read-only database roles where possible) and keep **human approval ON** for writes, external messages, purchases, and shell commands—even in workflows you use regularly.',
          callout: {
            type: 'warning',
            title: 'Never treat reading untrusted docs or secret files as "harmless"',
            body: 'Block agents from reading `.env` or credential folders, distrust instructions found inside external web pages/emails, and never grant blanket wildcard permissions (`*`) or auto-approve external actions.'
          }
        }
      ],
      keyTakeaways: [
        'Tool calling lets an LLM emit a structured request slip so its harness enforces permissions, executes the tool, and returns real output.',
        'MCP (Model Context Protocol) is "USB-C for AI"—an open standard connecting AI harnesses to external tools and data.',
        'Reads are NOT automatically harmless: protect `.env`/private files from exfiltration, watch for indirect prompt injection in untrusted docs, and keep least-privilege scopes + human approvals active.'
      ],
      glossaryTermIds: ['tool-calling', 'mcp', 'ai-harness', 'human-in-the-loop'],
      relatedLabId: null,
      quiz: [
        {
          id: 'q-4-2-1',
          type: 'multiple_choice',
          question: 'Why is MCP (Model Context Protocol) often nicknamed "USB-C for AI"?',
          options: [
            'It encrypts local `.env` files when a laptop charges.',
            'It replaces the LLM with fixed local scripts.',
            'It offers one open standard so any compatible AI harness can connect to external tools.',
            'It forces every cloud AI provider to bill input and output tokens at the exact same flat rate.'
          ],
          correctIndex: 2,
          explanation:
            'Just like USB-C ended mismatched proprietary chargers, MCP gives AI harnesses and external tools one shared open protocol so integrations work across apps.'
        },
        {
          id: 'q-4-2-2',
          type: 'true_false',
          question:
            'Giving an AI agent read-only access to all your files and the public web is always completely harmless because it cannot edit anything directly.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! Reading `.env` or private files risks leaking secrets, and reading untrusted web pages or emails can trigger indirect prompt injection that hijacks other tools.'
        },
        {
          id: 'q-4-2-3',
          type: 'spot_mistake',
          question:
            'Sam connects an AI agent to his work email and calendar via MCP and turns on "Auto-approve sending emails" after two good test runs. What risk did he overlook?',
          options: [
            'Email MCP servers are unable to read message subjects unless auto-approve is turned off.',
            'Auto-approving external sends lets a misunderstanding or hidden prompt injection fire off real emails unchecked.',
            'Enabling auto-approve forces the harness to switch from a fast model to a slower reasoning tier.',
            'MCP connections automatically expire after five minutes whenever email send permissions are granted.'
          ],
          correctIndex: 1,
          explanation:
            'External actions like sending emails or messages affect real people immediately—and untrusted incoming messages can contain prompt injections. Let AI draft, and keep human approval ON before sending.'
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
        'A regular chatbot speaks once and stops. An AI agent runs in a self-correcting loop—thinking, using a tool, checking real feedback, pausing for your approval, and repeating until the job works.',
      analogy: {
        title: 'Assembling a Bookshelf One Check at a Time',
        body: 'Nobody builds a bookshelf with their eyes closed in one motion. You look at the manual (Think), tighten two screws (Act), give the shelf a gentle wiggle to see if it holds straight (Observe), and tighten a loose bolt before moving on. An AI agent works the same way—checking real feedback after every step instead of guessing blindly.'
      },
      sections: [
        {
          heading: 'Single-shot chat vs. the multi-step Agent Loop',
          body: 'In a traditional one-turn chat, you ask a question and the AI takes a single blind swing. If its first draft has a typo, the chat just ends and leaves you stuck.\n\nAn **AI Agent** wraps the model in a repeating loop:\n\n1. **Think**: Break the goal into the next concrete step.\n2. **Act**: Request a tool call (read a file, edit CSS, run a test).\n3. **Observe**: Read the real output—did the check pass, or did an error appear?\n4. **Repeat (or Finish)**: If an error popped up, adjust the plan and try again; once verified, present a clear summary.',
          callout: {
            type: 'example',
            title: 'Watching an agent fix a real bug in 4 beats',
            body: 'Goal: "Make the newsletter form validate emails."\n• Loop 1: Reads `form.js` to see existing code.\n• Loop 2: Adds email validation + pauses for your diff approval.\n• Loop 3: Runs tests—spots a typo on line 18 in the error output.\n• Loop 4: Fixes line 18, re-runs tests -> All green -> Reports Done.'
          }
        },
        {
          heading: 'Human-in-the-Loop: you stay the pilot',
          body: 'People sometimes picture "AI Agents" as runaway robots doing mysterious things unsupervised. In everyday building, reliable agents work as **collaborative co-pilots** with **Human-in-the-Loop** checkpoints.\n\nWhenever the agent wants to edit a file, install a package, or run a command, it pauses and shows you the exact action. You approve only what makes sense—or redirect it before anything changes.',
          callout: {
            type: 'tip',
            title: 'Give the agent a way to verify its own work',
            body: 'Agents become dramatically more reliable the moment they can **observe** real results. Pairing edits with an automated test or validation check lets the agent catch its own slips immediately.'
          }
        },
        {
          heading: 'When agents get stuck—and how to unstick them fast',
          body: 'Occasionally an agent falls into a spin, trying the same failing fix three times in a row. As the human pilot, stop the loop early and reset direction:\n\n• Ask for a diagnosis first: *"Pause editing. Explain in 3 plain sentences why this error keeps happening."*\n• Shrink the scope to one tiny, verifiable step.\n• Compact or clear cluttered context if the thread has been spinning for a while.',
          callout: {
            type: 'warning',
            title: 'Never leave an unguarded agent looping unattended',
            body: 'Every loop step resends the growing conversation back to the model—multiplying token usage fast. Supervise agents, keep retry/step caps tight, and interrupt early if it repeats itself.'
          }
        }
      ],
      keyTakeaways: [
        'An AI agent runs a repeating Think -> Act -> Observe loop so it can inspect real results and fix mistakes instead of guessing once.',
        'Human-in-the-Loop checkpoints keep you in the driver’s seat, approving edits, installs, and commands before they execute.',
        'If an agent repeats a failing step twice, stop it early to save tokens, ask for a plain-English diagnosis, and narrow the step.'
      ],
      glossaryTermIds: ['ai-agent', 'agent-loop', 'human-in-the-loop', 'tool-calling'],
      relatedLabId: null,
      quiz: [
        {
          id: 'q-4-3-1',
          type: 'multiple_choice',
          question: 'What is the core repeating cycle of a standard AI Agent Loop?',
          options: [
            'Think -> Act via tool -> Observe real output -> Adjust or finish',
            'Retrain weights -> Download new parameters -> Clear memory -> Restart session',
            'Generate full app -> Skip verification -> Deploy live -> Wait for user complaints',
            'Read whole hard drive -> Auto-approve all commands -> Compress files -> Close chat'
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
            'An agent tries the exact same failing command four times in a row while building Leo’s app. Leo walks away for lunch hoping attempt #25 works. What should Leo have done instead?',
          options: [
            'Raised temperature to 1.0 so command syntax varies randomly.',
            'Turned on auto-approve so retries run without pausing.',
            'Deleted the entire Git repository history so the agent starts without seeing earlier checkpoints.',
            'Stopped the loop early, asked for a plain diagnosis, and narrowed the task.'
          ],
          correctIndex: 3,
          explanation:
            'An agent stuck repeating a failed step burns tokens on every turn without progressing. Interrupt early, ask for a plain-English diagnosis, and narrow the step.'
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
        'Tired of repeating your project preferences every session? Learn how plain-English instruction files like `CLAUDE.md`, rules, and reusable skills guide your AI—and where real security boundaries actually live.',
      analogy: {
        title: 'The Fridge Note vs. The Recipe Card Box',
        body: 'Imagine hiring a house-sitter. Taped on the fridge is a short welcome note (`CLAUDE.md` / Rules): "Water the fern on Tuesdays, use plain styling, explain changes simply." Tucked in a drawer is a recipe card box (Skills): specialized checklists opened only when needed. Crucially, a fridge note is a friendly reminder—real security still comes from actual door locks (harness permissions & sandboxing).'
      },
      sections: [
        {
          heading: 'What is `CLAUDE.md` (or `AGENTS.md`)?',
          body: 'Because every fresh AI session starts with a clean desk, repeating *"This site uses plain HTML and CSS, keep explanations jargon-free, and always run tests"* gets old fast.\n\nModern AI harnesses solve this with a plain-English markdown file at the root of your project—called **`CLAUDE.md`** in Claude Code (and `AGENTS.md` or rules files in other tools). Whenever you start a new session in that folder, the harness loads those conventions automatically onto the AI’s desk.',
          callout: {
            type: 'example',
            title: 'A clean, beginner-friendly `CLAUDE.md` in 5 lines',
            body: '```markdown\n# My Cafe Website\n- Built with plain HTML, CSS, and vanilla JS (no extra frameworks).\n- Warm cream background (#FFFBF5) and dark espresso text.\n- Explain every edit in clear, jargon-free English.\n- Ask before installing any package, and explain how to verify each change.\n```'
          }
        },
        {
          heading: 'Rules vs. Skills—and what `CLAUDE.md` CANNOT enforce',
          body: 'As projects grow, dumping 500 lines into one always-on file clogs the context window on every single turn. Split instructions into two clean buckets:\n\n• **Rules (always-on)**: Short, universal project conventions (stack, style, test command). Keep them lean!\n• **Skills (on-demand playbooks)**: Detailed step-by-step checklists loaded ONLY when relevant—like a "Pre-Deploy QA Checklist" or "Accessibility Contrast Audit."\n\nJust as important: **`CLAUDE.md` is soft guidance, NOT a security sandbox!** Writing "never read `.env`" in markdown is a helpful hint, yet an LLM can forget or be tricked by prompt injection. Real security comes from **harness deny-lists, OS/container isolation, least-privilege tokens, and human approval**.',
          callout: {
            type: 'warning',
            title: 'Markdown instructions are conventions—not hard locks',
            body: 'Never rely solely on a line in `CLAUDE.md` to protect API keys, production databases, or files outside your folder. Enforce real boundaries in your harness permission settings and OS/account scopes.'
          }
        },
        {
          heading: 'Keep instruction files short and evolving',
          body: 'You do not have to write a perfect instruction file on day one. Many CLIs offer a starter command (like `/init`) that scans your project layout and drafts a concise starting note you can trim.\n\nWhenever the AI repeats a style mistake—such as adding an unnecessary library—add one clear bullet to `CLAUDE.md`. Concise, concrete plain English beats a 20-page manual every time.',
          callout: {
            type: 'myth',
            title: 'Myth Buster: "Instruction files have to be written in special computer code"',
            body: 'Not at all! `CLAUDE.md`, rules, and skills are ordinary, clear English bullet points. If a smart human teammate would understand your note in 30 seconds, your AI tool will too.'
          }
        }
      ],
      keyTakeaways: [
        '`CLAUDE.md` (or `AGENTS.md`) automatically gives your AI harness your project layout, style, and workflow conventions at the start of every session.',
        'Keep always-on Rules lean so they do not bloat the context window, and place specialized checklists into on-demand Skills.',
        'Treat instruction files as soft guidance—enforce real security with harness permission rules, scoped credentials, and OS isolation.'
      ],
      glossaryTermIds: ['claude-md', 'skills-and-rules', 'system-prompt', 'context-window'],
      relatedLabId: 'harness-agent',
      quiz: [
        {
          id: 'q-4-4-1',
          type: 'multiple_choice',
          question: 'Why should you NEVER rely solely on a line in `CLAUDE.md` saying "Never read `.env` or run destructive commands" as your only security protection?',
          options: [
            'Markdown files are ignored by AI harnesses unless every rule is written in JSON syntax.',
            'Instruction files are soft prompt guidance, whereas real enforcement needs harness and OS permissions.',
            'Harnesses only read `CLAUDE.md` after finishing all edits, never at the start of a session.',
            'Adding security rules to `CLAUDE.md` automatically disables Git checkpoints for the folder.'
          ],
          correctIndex: 1,
          explanation:
            'Prompt instructions like `CLAUDE.md` guide style and habits, but models can misread or be steered by prompt injection. Real security requires harness permission deny-rules, scoped credentials, and OS/folder isolation.'
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
            'Harnesses reject any markdown file longer than twenty lines and refuse to launch the session.',
            'It bloats every turn with irrelevant tokens—keep rules short and move niche guides to Skills.',
            'The AI automatically uploads the entire `CLAUDE.md` file to public GitHub when saving diffs.',
            'Large instruction files force the model into high-temperature brainstorming mode on every prompt.'
          ],
          correctIndex: 1,
          explanation:
            'Always-on instructions occupy the working desk on every turn! Keep `CLAUDE.md` lean and focused, and move specialized step-by-step guides into Skills loaded only when needed.'
        }
      ]
    }
  ],
  masteryCheck: {
    id: 'mc-4-harnesses-agents',
    title: 'Unit 4 Mastery Check',
    subtitle: 'Prove you understand harnesses, tool calling, MCP, and real agent permission boundaries.',
    passThreshold: 0.75,
    xpReward: 40,
    estimatedMinutes: 2,
    questions: [
      {
        id: 'mc-4-q1',
        type: 'multiple_choice',
        question: 'Two coding tools call the exact same underlying LLM, yet Tool A reliably fixes bugs while Tool B keeps hallucinating line numbers. What best explains the gap?',
        options: [
          'Tool A’s harness loads real files, runs tests, and feeds real output back in a loop.',
          'Tool A secretly retrains the model’s frozen weights every time you press Enter.',
          'Tool B uses a slower Wi-Fi connection that drops half the model’s vocabulary tokens.',
          'Tool A turns off all human approval checkpoints so the model skips reading files.'
        ],
        correctIndex: 0,
        explanation:
          'Harness quality—how context is selected, which tools are wired up, and how test feedback enters the Think-Act-Observe loop—drives huge differences even on the exact same model.'
      },
      {
        id: 'mc-4-q2',
        type: 'spot_mistake',
        question: 'A teammate gives an AI agent unrestricted read access to his home directory and web browser, saying "Read-only permissions can never cause security harm." What are the real risks?',
        options: [
          'Read-only tools use ten times more output tokens than write tools on every request.',
          'Reading `.env` or `~/.ssh` risks secret exfiltration, and untrusted pages carry prompt injection.',
          'MCP servers automatically upgrade read-only permissions into admin access after ten minutes.',
          'Read-only access stops the agent from seeing error logs whenever unit tests fail.'
        ],
        correctIndex: 1,
        explanation:
          'Confidentiality and prompt injection matter even with read tools: sensitive files like `.env` or SSH keys can be exfiltrated via other tools, and untrusted web/repo text can smuggle hidden instructions.'
      },
      {
        id: 'mc-4-q3',
        type: 'multiple_choice',
        question: 'Where should a hard rule blocking an AI agent from reading `.env` or running destructive commands be enforced?',
        options: [
          'Only as an uppercase rule inside `CLAUDE.md`.',
          'Inside a CSS comment in `styles.css` so the harness skips secret files automatically.',
          'In harness permission rules, scoped tokens, and OS/folder isolation.',
          'By raising the model’s temperature dial above 0.8 so it avoids risky defaults.'
        ],
        correctIndex: 2,
        explanation:
          '`CLAUDE.md` is helpful soft guidance for coding conventions, not a security wall. Enforce hard boundaries in harness permissions, least-privilege credentials, and OS/sandbox controls.'
      },
      {
        id: 'mc-4-q4',
        type: 'multiple_choice',
        question: 'Your team has 40 pages of specialized deployment steps used only once a month. Where should those instructions live?',
        options: [
          'Pasted into `CLAUDE.md` so every single chat turn carries all 40 pages automatically.',
          'Hardcoded inside the system prompt of every unrelated customer-support chatbot.',
          'Deleted completely because AI agents work best with zero written checklists.',
          'In an on-demand Skill loaded only when running a deployment.'
        ],
        correctIndex: 3,
        explanation:
          'Keep always-on Rules (`CLAUDE.md`) brief and universal; place specialized playbooks into on-demand Skills so they do not bloat everyday context windows.'
      }
    ]
  }
};
