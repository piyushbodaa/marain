import type { GlossaryTerm } from './schema.ts';

export const GLOSSARY: GlossaryTerm[] = [
  // FOUNDATIONS (8)
  {
    id: 'ai',
    term: 'AI (Artificial Intelligence)',
    shortDef:
      'Software that learns patterns from examples instead of following a rigid list of hand-written if/then rules.',
    analogy:
      'Regular software is like a vending machine following fixed wiring; AI is like a seasoned chef who tasted ten thousand dishes and knows how flavors fit together.',
    category: 'foundations',
    example:
      'Sorting spam emails by learning what shady messages usually look like, rather than blocking only one exact word.'
  },
  {
    id: 'llm',
    term: 'LLM (Large Language Model)',
    shortDef:
      'A type of AI trained on vast amounts of text and code to predict the most useful next chunk of text in a conversation.',
    analogy:
      'Think of it as the world’s most well-read autocomplete—except it read so many books, manuals, and conversations that completing patterns looks like reasoning.',
    category: 'foundations',
    example:
      'Claude, Gemini, GPT, Llama, and DeepSeek are all families of Large Language Models.'
  },
  {
    id: 'next-token-prediction',
    term: 'Next-Token Prediction',
    shortDef:
      'The core mechanism inside an LLM: guessing the single most likely next word-piece, one piece at a time, until a full reply is formed.',
    analogy:
      'Like finishing a friend’s sentence when they say "Peanut butter and ___"—except done thousands of times in a row while checking the whole page.',
    category: 'foundations',
    example:
      'Given "The capital of Japan is", the model gives "Tokyo" a 99% probability and picks it as the next token.'
  },
  {
    id: 'model-weights',
    term: 'Model Weights (Parameters)',
    shortDef:
      'Billions of tuned numbers stored inside an AI model file that capture everything it learned during training.',
    analogy:
      'Imagine a giant mixing board with billions of volume sliders; training adjusts every slider until the music sounds right, then freezes them in place.',
    category: 'foundations',
    example:
      'A "70B" model has 70 billion parameters—larger files usually hold more knowledge, while smaller models run faster and cheaper.'
  },
  {
    id: 'open-weights',
    term: 'Open-Weights Model',
    shortDef:
      'An AI model whose creators publish the trained weight files publicly so anyone can inspect, host, or run it on their own hardware.',
    analogy:
      'Proprietary models are like eating at a restaurant with a secret recipe; open-weights models hand you the finished spice blend to cook at home.',
    category: 'foundations',
    example:
      'Meta’s Llama, DeepSeek, Qwen, and Mistral release open-weights models that you can run privately on a laptop.'
  },
  {
    id: 'multimodal',
    term: 'Multimodal AI',
    shortDef:
      'An AI model that can understand or create more than just plain text—such as images, screenshots, PDFs, audio, or video.',
    analogy:
      'Instead of only reading letters mailed through a slot, a multimodal AI also has eyes to look at your photo and ears to hear your voice memo.',
    category: 'foundations',
    example:
      'Taking a screenshot of a broken button on your website and pasting the image straight into Claude or Gemini to ask what looks off.'
  },
  {
    id: 'training-vs-inference',
    term: 'Training vs. Inference',
    shortDef:
      'Training is the expensive months-long study phase that builds a model; inference is the fast everyday act of asking the trained model a question.',
    analogy:
      'Training is going to medical school for years; inference is a five-minute doctor visit where they apply what they already learned.',
    category: 'foundations',
    example:
      'When you send a prompt and pay a fraction of a cent, you are paying for inference, not training.'
  },
  {
    id: 'chat-wrapper',
    term: 'AI Chat App (Wrapper)',
    shortDef:
      'The user-friendly website or mobile app (like ChatGPT, Claude.ai, or Gemini) built around a raw model to add chat history, file uploads, and search.',
    analogy:
      'The raw model is an engine sitting on a workshop stand; the chat app is the dashboard, steering wheel, and comfy seats around it.',
    category: 'foundations',
    example:
      'When Claude.ai searches the web or shows an interactive preview card, that extra feature comes from the chat app, not just the raw model.'
  },

  // TOKENS & PROMPTS (8)
  {
    id: 'token',
    term: 'Token',
    shortDef:
      'A small chunk of text—roughly three-quarters of an English word—that AI actually reads, counts, and bills you for.',
    analogy:
      'Think of tokens as Lego bricks of language: common words like "apple" are one brick, while rare or long words snap together from two or three smaller bricks.',
    category: 'tokens',
    example:
      '"Unbelievable" might split into ["Un", "believ", "able"] (3 tokens), while a single emoji can take 2 to 4 tokens.'
  },
  {
    id: 'tokenizer',
    term: 'Tokenizer',
    shortDef:
      'The translator program that slices your text into numbered tokens before the AI sees it, and glues numbered tokens back into readable text for you.',
    analogy:
      'Like a coat-check attendant who swaps every coat for a numbered ticket on the way in, and swaps tickets back for coats on the way out.',
    category: 'tokens',
    example:
      'Because the tokenizer hands the AI chunks instead of individual letters, models sometimes miscount how many "r"s are in "strawberry".'
  },
  {
    id: 'context-window',
    term: 'Context Window',
    shortDef:
      'The maximum number of tokens an AI model can keep in active view at one time—including instructions, uploaded files, your chat history, and its reply.',
    analogy:
      'It is the size of the AI’s working desk: once the desk is full of papers, adding a new page pushes the oldest page off the back edge.',
    category: 'tokens',
    example:
      'A 200,000-token context window can hold roughly an entire 500-page book on the desk at once, though very cluttered desks still slow focus.'
  },
  {
    id: 'prompt',
    term: 'Prompt',
    shortDef:
      'The message, question, or instructions you give to an AI to tell it what you want.',
    analogy:
      'Like giving directions to a bright new intern on day one: vague instructions get guesswork, while clear examples and goals get great work.',
    category: 'tokens',
    example:
      '"Rewrite this apology email in 3 short sentences, warm and calm, without corporate buzzwords."'
  },
  {
    id: 'system-prompt',
    term: 'System Prompt',
    shortDef:
      'Hidden top-level instructions placed before the conversation starts that define the AI’s role, tone, boundaries, and rules.',
    analogy:
      'The employee handbook a hotel receptionist reads before opening the lobby doors—guests never see it, but it guides every answer.',
    category: 'tokens',
    example:
      '"You are a patient cooking tutor. Always use metric measurements and warn beginners about hot oil."'
  },
  {
    id: 'temperature',
    term: 'Temperature',
    shortDef:
      'A dial (usually 0.0 to 1.0+) that controls how predictable or adventurous an AI is when picking its next token.',
    analogy:
      'Low temperature is a careful accountant sticking strictly to the most likely answer; high temperature is a brainstorming poet willing to take wild creative detours.',
    category: 'tokens',
    example:
      'Use low temperature (0.0–0.2) for summarizing invoices or fixing code, and higher temperature (0.7–0.9) for naming a coffee shop.'
  },
  {
    id: 'hallucination',
    term: 'Hallucination',
    shortDef:
      'When an AI invents a plausible-sounding fact, quote, citation, or code function that does not actually exist.',
    analogy:
      'Like an improv actor who refuses to break character—even when they do not know the real fact, they smoothly make up something that fits the scene.',
    category: 'tokens',
    example:
      'An AI inventing a realistic-looking court case name and date because the pattern "Smith v. State (2019)" sounds right.'
  },
  {
    id: 'grounding',
    term: 'Grounding (Fact-Checking Context)',
    shortDef:
      'Giving an AI real source documents, web search results, or database records to base its answer on instead of relying purely on memorized patterns.',
    analogy:
      'Switching from a closed-book exam (where guessing happens) to an open-book exam where you must point to the exact page number.',
    category: 'tokens',
    example:
      'Pasting your actual lease PDF into the chat and asking, "Quote the exact clause about breaking the lease early."'
  },

  // MONEY, CREDITS & API KEYS (8)
  {
    id: 'ai-credits',
    term: 'AI Credits (Pay-As-You-Go)',
    shortDef:
      'Prepaid or metered balance used to pay directly for the exact number of tokens you send and receive through an AI provider’s API.',
    analogy:
      'A monthly chat subscription is an all-you-can-eat buffet; AI credits are a prepaid coffee card where you only pay for the exact cups you order.',
    category: 'money',
    example:
      'Loading $5 of API credits can easily power hundreds of beginner chats or coding sessions on a fast model.'
  },
  {
    id: 'api',
    term: 'API (Application Programming Interface)',
    shortDef:
      'A structured digital doorway that lets one piece of software send requests to another program—like your app talking directly to Claude or Gemini.',
    analogy:
      'An API is the restaurant waiter: your app writes an order on a slip, the waiter carries it to the AI kitchen, and brings back the plated answer.',
    category: 'money',
    example:
      'A backend server or trusted local tool sends a JSON message to an AI API endpoint and receives the model’s structured reply in seconds.'
  },
  {
    id: 'api-key',
    term: 'API Key',
    shortDef:
      'A secret credential string (such as sk-...) that authenticates API requests and bills usage to your account—always scope it to one project with minimum permissions.',
    analogy:
      'Like a company debit card tied to a specific budget: anyone who sees the number can spend your balance, so you issue scoped cards per project and revoke any card that leaks.',
    category: 'money',
    example:
      'Storing your key in a password manager and server-side environment variables (or a git-ignored local `.env`), never inside public HTML, frontend JavaScript, screenshots, or AI chat prompts.'
  },
  {
    id: 'env-file',
    term: '.env File',
    shortDef:
      'A local plain-text configuration file that keeps secrets like API keys separate from source code—it is unencrypted on disk, so keep it out of Git, zip backups, and AI chat context.',
    analogy:
      'A separate envelope tucked beside your blueprints rather than written on the blueprint itself—it keeps secrets out of public copies, though anyone who opens the envelope can read it.',
    category: 'money',
    example:
      'Storing `ANTHROPIC_API_KEY=sk-ant-...` in `.env` for local server code while listing `.env` in `.gitignore` and never exposing it to frontend browser code.'
  },
  {
    id: 'gitignore',
    term: '.gitignore',
    shortDef:
      'A plain-text checklist telling Git which untracked files—especially `.env` secret files—to ignore so they are never staged or pushed to a repository.',
    analogy:
      'A "Do Not Pack" sticky note on your private folder before movers box up the room.',
    category: 'money',
    example:
      'Adding `.env` to `.gitignore` before your first `git add` prevents accidental uploads—and if a key was ever committed earlier, revoke it immediately because `.gitignore` does not erase Git history.'
  },
  {
    id: 'token-pricing',
    term: 'Input vs. Output Token Pricing',
    shortDef:
      'API providers charge per million tokens, usually pricing input tokens (what you send) much lower than output tokens (what the AI writes back).',
    analogy:
      'Reading a customer’s two-page email takes seconds, while writing a thoughtful two-page reply takes much more effort—so writing costs more.',
    category: 'money',
    example:
      'If a model costs $3 per million input tokens and $15 per million output tokens, a typical 1,000-token exchange costs less than two cents.'
  },
  {
    id: 'rate-limit',
    term: 'Rate Limit, Quota & Spending Cap',
    shortDef:
      'Safeguards that cap requests per minute/day (rate limits and quotas) or monthly spend (prepaid balances, workspace caps, and alerts)—noting that some cloud budgets only send alerts rather than stopping charges.',
    analogy:
      'Combining a prepaid $5 coffee card (with auto-reload off) and a per-minute order limit so a runaway bug cannot quietly run up a big tab.',
    category: 'money',
    example:
      'Keeping auto-reload OFF on prepaid Anthropic or OpenAI credits, setting workspace limits, and—on Google Cloud—pairing budget alerts with strict API request quotas.'
  },
  {
    id: 'local-model',
    term: 'Local Model (Ollama)',
    shortDef:
      'An open-weights AI model downloaded and run directly on your own computer with zero cloud fees and full offline privacy.',
    analogy:
      'Instead of calling a delivery kitchen every time you want toast, you keep a toaster right on your own kitchen counter.',
    category: 'money',
    example:
      'Installing Ollama and running `ollama run llama3.2` so your laptop answers questions offline for $0.'
  },

  // HARNESSES, TOOLS & AGENTS (8)
  {
    id: 'ai-harness',
    term: 'AI Harness',
    shortDef:
      'The software shell wrapped around an LLM that manages its system prompt, context window, tool permissions, safety approvals, and step-by-step execution loop.',
    analogy:
      'If the LLM is a powerful engine, the harness is the entire car—steering wheel, brakes, headlights, GPS, and seatbelts that make the engine actually drive somewhere useful.',
    category: 'agents',
    example:
      'Claude Code, Cursor, and Antigravity are AI harnesses: the same underlying model behaves dramatically better inside a well-built harness.'
  },
  {
    id: 'ai-agent',
    term: 'AI Agent',
    shortDef:
      'An LLM inside a harness that can plan multiple steps, use tools to inspect or change the real world, check the results, and keep going until a goal is finished.',
    analogy:
      'A chatbot is a consultant who only texts you advice; an agent is an assistant with keys to the workshop who opens the files, fixes the drawer, tests it, and shows you the result.',
    category: 'agents',
    example:
      'Asking an agent to fix a broken signup button—it reads your files, edits the bug, runs the tests, sees a pass, and reports back.'
  },
  {
    id: 'tool-calling',
    term: 'Tool Calling (Function Calling)',
    shortDef:
      'The ability of an AI model to output a structured request asking its harness to run an action—such as reading a file, searching the web, or running a command.',
    analogy:
      'A brain in a jar cannot turn a doorknob, so it passes a neatly written request slip to robotic hands that turn the knob and report what is behind the door.',
    category: 'agents',
    example:
      'Instead of guessing what is inside `index.html`, the model calls `read_file("index.html")` and receives the exact contents.'
  },
  {
    id: 'mcp',
    term: 'MCP (Model Context Protocol)',
    shortDef:
      'An open standard that lets any AI harness plug into external tools and data sources (like Google Drive, Slack, browsers, or databases) using one universal format.',
    analogy:
      'USB-C for AI: before USB-C, every gadget needed its own weird cable; with MCP, one standard plug connects your AI to hundreds of tools.',
    category: 'agents',
    example:
      'Adding a Notion or GitHub MCP server lets your AI assistant read your project tasks without you copy-pasting them manually.'
  },
  {
    id: 'agent-loop',
    term: 'Agent Loop (Think–Act–Observe)',
    shortDef:
      'The repeating cycle an agent uses to solve multi-step tasks: think about the next step, call a tool, read the real output, and adjust until done.',
    analogy:
      'How you assemble flat-pack furniture: look at the instructions, tighten one bolt, check if the leg wobbles, and move to the next step.',
    category: 'agents',
    example:
      'An agent edits CSS, checks the browser preview, notices the button text is cut off on mobile, adjusts padding, and verifies again.'
  },
  {
    id: 'human-in-the-loop',
    term: 'Human-in-the-Loop Approval',
    shortDef:
      'A safety checkpoint where an AI agent pauses for your explicit approval before editing files, running commands, sending external messages, or spending money—paired with least-privilege permissions.',
    analogy:
      'A junior mechanic showing you the repair quote and waiting for your signature before ordering parts or touching the engine.',
    category: 'agents',
    example:
      'Reviewing a red-and-green diff or exact shell command and approving only the specific step needed rather than enabling blanket auto-approve.'
  },
  {
    id: 'claude-md',
    term: 'CLAUDE.md (Project Instructions)',
    shortDef:
      'A plain-English markdown file in a project folder that shares preferences, folder layout, and workflow conventions with an AI tool every session (helpful guidance, not a hard security boundary).',
    analogy:
      'A house-sitter’s welcome note taped to the fridge: "Water the fern on Tuesdays and follow the garden schedule"—handy reminders, while real locks still handle security.',
    category: 'agents',
    example:
      'Writing "Keep explanations jargon-free and always run npm test before saying you are finished" inside `CLAUDE.md`.'
  },
  {
    id: 'skills-and-rules',
    term: 'Rules & Skills',
    shortDef:
      'Reusable instruction booklets you save once so an AI harness always follows specific standards (rules) or knows step-by-step playbooks for specialized tasks (skills).',
    analogy:
      'Rules are everyday kitchen hygiene ("wash hands first"); skills are specific recipe cards you pull off the shelf only when baking sourdough.',
    category: 'agents',
    example:
      'A "Deploy Website" skill that reminds your AI agent of the exact 4 checks to run before publishing.'
  },

  // TERMINAL & CLAUDE CLI (8)
  {
    id: 'terminal',
    term: 'Terminal (Command Line / Shell)',
    shortDef:
      'A text-based window for talking directly to your computer’s operating system—doing the same things as clicking folders and buttons, just by typing short commands.',
    analogy:
      'Clicking icons is pointing at pictures on a restaurant menu; the terminal is speaking directly to the kitchen in crisp shorthand.',
    category: 'cli',
    example:
      'Typing `ls` in the terminal lists the exact same files you see when opening your folder window.'
  },
  {
    id: 'cli',
    term: 'CLI (Command-Line Interface)',
    shortDef:
      'Any program you run by typing its name inside the terminal rather than clicking a graphical window icon.',
    analogy:
      'Like texting a personal assistant quick commands instead of tapping through six screens of a mobile app.',
    category: 'cli',
    example:
      '`git`, `node`, `ollama`, and `claude` are all CLI tools.'
  },
  {
    id: 'claude-code',
    term: 'Claude Code CLI',
    shortDef:
      'Anthropic’s terminal-based AI coding agent that lives right inside your project folder, reads your files, suggests edits with visual diffs, and runs commands with your approval.',
    analogy:
      'Instead of emailing screenshots of your room to an interior designer, Claude Code walks right into the room with a tape measure and helps rearrange the furniture while you supervise.',
    category: 'cli',
    example:
      'Opening your `my-website` folder in the terminal, typing `claude`, and saying "Add a clean dark mode toggle to the top navigation bar."'
  },
  {
    id: 'working-directory',
    term: 'Working Directory (pwd & cd)',
    shortDef:
      'The exact folder your terminal is currently standing inside—every command or AI CLI you launch looks in this folder first.',
    analogy:
      'Think of folders like rooms in a house: `pwd` asks "Which room am I standing in?", `ls` looks around the room, and `cd` walks into another room.',
    category: 'cli',
    example:
      'Running `cd ~/Marain-Projects/my-site` before starting `claude` so the AI edits your website instead of your whole home folder.'
  },
  {
    id: 'diff',
    term: 'Diff (Code Difference View)',
    shortDef:
      'A side-by-side or line-by-line highlight showing removed lines in red (`-`) and newly added lines in green (`+`) before or after an edit.',
    analogy:
      'Track Changes in a Word or Google Doc—you do not have to reread the whole document, just the lines highlighted in red and green.',
    category: 'cli',
    example:
      'Reviewing a 4-line diff where Claude changed the button color from gray to emerald green before clicking Approve.'
  },
  {
    id: 'compact-command',
    term: '/compact (Context Compaction)',
    shortDef:
      'A slash command in AI CLIs like Claude Code that summarizes a long, messy conversation into clean bullet notes to free up space in the context window.',
    analogy:
      'Clearing twenty coffee-stained scratch pads off your desk and keeping one crisp sticky note with the decisions you actually care about.',
    category: 'cli',
    example:
      'Typing `/compact` after finishing the homepage header so the AI stays sharp and cheaper to run while building the contact form.'
  },
  {
    id: 'git',
    term: 'Git (Version Control)',
    shortDef:
      'A free time-machine system for project folders that tracks every change you make and lets you inspect diffs or roll back to an earlier working version.',
    analogy:
      'Video game save slots for your files: before trying a bold experiment, you save the game so you can recover cleanly.',
    category: 'cli',
    example:
      'Running `git status` and `git diff` to see which files an AI edited before committing, or restoring a saved snapshot when an experiment goes sideways.'
  },
  {
    id: 'commit',
    term: 'Git Commit (Save Point)',
    shortDef:
      'A labeled snapshot of your project files saved into Git’s history at a moment when everything works nicely.',
    analogy:
      'Taking a dated photograph of your Lego castle after finishing each tower, so if the roof collapses you know exactly how to rebuild.',
    category: 'cli',
    example:
      'Saving a commit labeled `"Homepage layout working on mobile"` before asking AI to add an interactive form.'
  },

  // BUILDING WEBSITES & APPS (10)
  {
    id: 'html',
    term: 'HTML (Structure)',
    shortDef:
      'The skeleton of every webpage—plain text tags that define headings, paragraphs, images, links, and buttons.',
    analogy:
      'If a website is a house, HTML is the wooden frame, walls, doors, and rooms before any paint or electricity goes in.',
    category: 'building',
    example:
      '`<h1>Welcome to Bean & Book Cafe</h1>` tells the browser to display a main title.'
  },
  {
    id: 'css',
    term: 'CSS (Styling)',
    shortDef:
      'The design rules that control how a website looks—colors, fonts, spacing, rounded corners, dark mode, and mobile layout.',
    analogy:
      'The paint colors, lighting, furniture, and interior design that make the bare HTML house look inviting.',
    category: 'building',
    example:
      'Setting a warm cream background, readable font size, and emerald rounded buttons in `styles.css`.'
  },
  {
    id: 'javascript',
    term: 'JavaScript (Interactivity)',
    shortDef:
      'The programming language built into every web browser that makes pages respond when you click buttons, type text, calculate totals, or save data.',
    analogy:
      'The wiring and plumbing inside the house—flipping a switch turns on the light, and turning a faucet makes water flow.',
    category: 'building',
    example:
      'Making a "Calculate Split" button actually divide a dinner bill and show each friend’s share instantly.'
  },
  {
    id: 'mini-spec',
    term: 'Mini-Spec (Product Brief)',
    shortDef:
      'A short, structured plain-English description of who a website or app is for, what sections or features it needs, and what vibe it should have—written before prompting AI.',
    analogy:
      'Sketching a floor plan on a napkin before telling a carpenter to start cutting wood.',
    category: 'building',
    example:
      'Listing audience, 4 page sections, color mood, and "must look clean on phones" in 8 bullet points before generating a site.'
  },
  {
    id: 'deployment',
    term: 'Deployment (Publishing Live)',
    shortDef:
      'Uploading your website or app files from your personal computer to a hosting server so anyone with a link can open it on the internet.',
    analogy:
      'Moving a bakery’s test muffins out of your home kitchen and into a storefront window with a street address.',
    category: 'building',
    example:
      'Dragging your finished website folder onto Netlify Drop or GitHub Pages to get a free public `https://` link in under a minute.'
  },
  {
    id: 'state',
    term: 'App State',
    shortDef:
      'All the live, changing information an app keeps track of right now—like which habits are checked off, what is in your cart, or whether dark mode is on.',
    analogy:
      'A restaurant’s whiteboard of active orders: every time a dish is ordered or delivered, the whiteboard updates to reflect reality.',
    category: 'building',
    example:
      'When you tap "+ Add Habit", the app updates its list in state and immediately redraws the screen to show the new row.'
  },
  {
    id: 'local-storage',
    term: 'LocalStorage & Databases',
    shortDef:
      'Ways an app remembers data after reload—`localStorage` saves small non-sensitive data inside one browser, while a backend database stores shared data and protects secrets.',
    analogy:
      'LocalStorage is a personal notebook in your own backpack (never put secrets in it); a cloud database with access rules is a shared vault that multiple devices can read safely.',
    category: 'building',
    example:
      'A single-user Habit Tracker works great with `localStorage`; team sync, user accounts, or paid API keys require a backend with proper access rules.'
  },
  {
    id: 'mvp',
    term: 'MVP (Minimum Viable Product)',
    shortDef:
      'The smallest, simplest version of your app idea that actually solves the core problem—built first before adding fancy extras.',
    analogy:
      'Building a sturdy skateboard that rolls today rather than waiting six months to finish a flying car.',
    category: 'building',
    example:
      'Version 1 of an Expense Splitter just adds expenses and splits equally; user accounts and receipt scanning wait for Version 2.'
  },
  {
    id: 'console-error',
    term: 'Console & Error Message',
    shortDef:
      'The browser or terminal’s behind-the-scenes diagnostic log where programs print exact clues (file name, line number, and reason) whenever something breaks.',
    analogy:
      'The check-engine diagnostic code a mechanic plugs into your car—even if you cannot fix the engine yourself, handing the exact code to AI lets it spot the broken wire immediately.',
    category: 'building',
    example:
      'Copying `TypeError: Cannot read properties of null (reading "value") at app.js:42` and pasting it straight to your AI assistant.'
  },
  {
    id: 'frontend-backend',
    term: 'Frontend vs. Backend',
    shortDef:
      'The frontend is everything users see and click on their screen; the backend is the behind-the-scenes server that safely handles logins, shared databases, and secret API keys.',
    analogy:
      'The frontend is the dining room of a restaurant; the backend is the kitchen and supply vault where ingredients and secret recipes stay safe.',
    category: 'building',
    example:
      'A personal portfolio needs only a frontend, while an app with user accounts and paid subscriptions also needs a backend.'
  }
];
