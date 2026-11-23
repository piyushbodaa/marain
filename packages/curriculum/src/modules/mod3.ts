import type { CurriculumModule } from '../schema.ts';

export const MODULE_3: CurriculumModule = {
  id: 'mod-3-credits-keys',
  number: 3,
  title: 'AI Credits, Pricing & API Keys',
  subtitle: 'Demystify subscriptions vs. pay-as-you-go credits, API key hygiene, real billing safeguards, and free local AI.',
  icon: 'key',
  accentHex: '#F59E0B',
  estimatedMinutes: 17,
  recommendedLabId: 'api-credits',
  chapters: [
    {
      id: 'ch-3-1',
      moduleId: 'mod-3-credits-keys',
      number: 1,
      title: 'Chat Subscriptions vs. Pay-As-You-Go AI Credits',
      readMinutes: 4,
      xpReward: 30,
      summary:
        'Paying $20/month for ChatGPT Plus or Claude Pro is completely separate from developer API billing. Learn how prepaid credits, postpaid cloud billing, and spending safeguards really work.',
      analogy: {
        title: 'The All-You-Can-Eat Buffet vs. The Prepaid Coffee Card',
        body: 'A monthly chat subscription (like ChatGPT Plus, Claude Pro, or Gemini plans) is an all-you-can-eat buffet: pay one flat fee per month and eat inside the provider’s app (with fair-use pauses if you sprint too fast). Pay-as-you-go API billing is metered per cup: you pay for the exact tokens your apps or tools consume.'
      },
      sections: [
        {
          heading: 'Why two separate billing systems exist',
          body: 'One of the #1 confusions for beginners happens right here: *"I already pay $20/month for Claude Pro or ChatGPT Plus—why is this developer console asking me to add API billing?"*\n\nConsumer chat apps and developer APIs are billed separately at almost every AI company. Your $20/month subscription covers chatting inside their polished website and mobile app (plus select bundled tools depending on your plan). Meanwhile, **API billing** pays for raw programmatic access through their API—the pipe that lets outside tools, automations, and backends talk directly to the model.',
          callout: {
            type: 'myth',
            title: 'Myth Buster: "Using the API is expensive and only for big tech companies"',
            body: 'For light or medium builders, pay-as-you-go API usage is often MUCH cheaper than a $20/month subscription. Five dollars of credits on a fast model can fund hundreds—or thousands—of small requests.'
          }
        },
        {
          heading: 'When a subscription wins vs. when API billing wins',
          body: 'Choose a **monthly chat subscription** when:\n• You chat casually every day in the browser or phone app.\n• You want zero setup, built-in web search, voice mode, and predictable flat monthly pricing.\n\nChoose **pay-as-you-go API billing** when:\n• You use AI sporadically and do not want a recurring $20 bill.\n• You want to plug AI into your own backends, automations, or trusted local developer tools.\n• You want freedom to swap between Gemini, Claude, and GPT as needed.',
          callout: {
            type: 'warning',
            title: 'Prepaid credits vs. postpaid cloud billing—know the difference!',
            body: 'Anthropic Console and OpenAI Platform let you load a small prepaid balance ($5) with **auto-reload turned OFF** (plus workspace monthly limits). By contrast, **Google Cloud / paid Gemini API is postpaid**: Google Cloud budget alerts only email you and **do NOT stop spending**! Stay on free tiers while learning, or set strict **API request quotas** alongside alerts.'
          }
        },
        {
          heading: 'Watch out for "wrapped" credit markup in third-party apps',
          body: 'Many trendy AI websites charge $29/month for "500 AI credits" that call the exact same Gemini, Claude, or OpenAI APIs costing them a fraction of that behind the scenes. Paying for convenience is fine when a tool saves real hours—just compare its price against wholesale token rates so you choose with open eyes.',
          callout: {
            type: 'example',
            title: 'Real-world cost perspective (illustrative rates)',
            body: 'Sending a 500-word question and receiving a 500-word answer uses roughly 1,400 total tokens. On a fast budget model priced around $0.15/1M input and $0.60/1M output, that exchange costs well under a tenth of a single US cent.'
          }
        }
      ],
      keyTakeaways: [
        'Monthly chat subscriptions (flat fee inside the provider’s own app) and developer API billing (metered per token) are separate systems.',
        'Prepaid balances with auto-reload OFF (like OpenAI and Anthropic) behave differently from postpaid cloud billing (like Google Cloud), where budget alerts alone do NOT stop charges.',
        'Combine prepaid balances (auto-reload OFF), strict API rate/daily quotas, and small code limits to prevent surprise bills.'
      ],
      glossaryTermIds: ['ai-credits', 'rate-limit', 'token-pricing', 'chat-wrapper'],
      relatedLabId: null,
      quiz: [
        {
          id: 'q-3-1-1',
          type: 'multiple_choice',
          question: 'How does pay-as-you-go AI API billing typically calculate what you owe?',
          options: [
            'By counting how many hours your API key stays active in your developer dashboard.',
            'By charging a fixed minimum monthly platform fee plus a flat rate per chat session.',
            'By charging more whenever you switch between mobile apps and desktop browsers.',
            'By metering the input and output tokens your requests use.'
          ],
          correctIndex: 3,
          explanation:
            'API billing is metered directly by token count (usually quoted per million input and output tokens), so idle time costs $0 and short prompts cost fractions of a cent.'
        },
        {
          id: 'q-3-1-2',
          type: 'true_false',
          question:
            'Paying $20/month for a consumer chat website automatically includes unlimited free API credits for external apps you build.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! Consumer web/mobile chat subscriptions and developer API billing are separate systems at major AI providers.'
        },
        {
          id: 'q-3-1-3',
          type: 'spot_mistake',
          question:
            'Rohan sets a $5 budget alert on his postpaid Google Cloud billing account and assumes Google will automatically shut off his Gemini API requests at $5.00. What did he misunderstand?',
          options: [
            'Google Cloud budget alerts require a $50 minimum first.',
            'Postpaid cloud billing applies only to open-weights models and never affects hosted APIs.',
            'Cloud budget alerts notify you without halting spend—you also need strict API quotas.',
            'Budget alerts automatically cap output tokens while still charging full price for input tokens.'
          ],
          correctIndex: 2,
          explanation:
            'On postpaid cloud billing like Google Cloud, budget alerts only send notifications—they do NOT cut off API traffic. Pair alerts with tight API quotas or use prepaid credits with auto-reload OFF.'
        }
      ]
    },
    {
      id: 'ch-3-2',
      moduleId: 'mod-3-credits-keys',
      number: 2,
      title: 'What Is an API & an API Key? (The Waiter and the Pass)',
      readMinutes: 4,
      xpReward: 30,
      summary:
        'An API is a clean digital doorway for software to talk to software, and an API key is the secret credential proving which project and billing account placed the order.',
      analogy: {
        title: 'The Restaurant Waiter and Your Scoped Tab Card',
        body: 'Imagine dining at a restaurant. Your app does not wander straight into the kitchen (the AI server farm). Instead, it hands a structured order slip to the waiter (the API), who carries it to the kitchen and brings the reply back. Your API key is the secret card linked to a specific project tab—so you only hand out scoped cards with tight limits.'
      },
      sections: [
        {
          heading: 'What actually happens during an AI API call',
          body: 'The acronym **API** (Application Programming Interface) is simply a predictable `https://` URL that accepts a neatly structured text package (usually JSON) and returns a structured answer.\n\nWhenever a backend server or trusted local tool calls Claude, Gemini, or OpenAI, three things travel over an encrypted connection:\n\n1. **The destination URL** (which AI endpoint to call)\n2. **The auth header carrying your API key** (proving which account/project is ordering)\n3. **The JSON body** (which model you want, your instructions, and your prompt)\n\nA moment later, the server sends back the reply text plus exact token counts.',
          callout: {
            type: 'example',
            title: 'Anatomy of an API call in 3 lines',
            body: '• **URL**: `https://api.provider.com/v1/messages`\n• **Header**: `Authorization: Bearer $API_KEY` (loaded from a server secret, never hardcoded!)\n• **Body**: `{ "model": "fast-tier", "max_tokens": 300, "prompt": "Explain photosynthesis in 2 sentences" }`'
          }
        },
        {
          heading: 'Scoping keys and thinking carefully about BYOK',
          body: 'When you click **"Create API Key"** in a provider console, it generates a random secret string (`sk-...` or `AIza...`) and shows it **only once**. Save it straight into a password manager or OS keychain—never in sticky notes, screenshots, or chat threads.\n\nSome local developer tools support **BYOK (Bring Your Own Key)** so you pay wholesale token rates instead of a markup. Before pasting a key into ANY third-party app, verify you trust its publisher, never paste an org-wide admin key, and mint a **dedicated, least-privilege key scoped to one project** (with minimum model permissions and tight spend/rate limits).',
          callout: {
            type: 'warning',
            title: 'Never paste live API keys into AI chats or untrusted web pages',
            body: 'Pasting your real key into an untrusted web app’s "BYOK settings" box hands that site your billing access—and pasting a key into an AI chat prompt exposes it in conversation logs!'
          }
        },
        {
          heading: 'Create per-project keys, rotate them, and revoke fast',
          body: 'Good news: an API key is replaceable! Create separate labeled keys for each project (such as `recipe-backend-dev` and `notes-cli`), give each key only the permissions it actually needs, and revoke keys you stop using.\n\nIf you ever suspect a key leaked, click **Revoke / Delete** immediately in the provider console to shut it off worldwide, check your usage log for unauthorized calls, and mint a fresh replacement.',
          callout: {
            type: 'tip',
            title: 'Least privilege beats one master key',
            body: 'If you reuse one admin-level key across five experiments and one experiment leaks, all five break when you revoke it—and an attacker gets broad account access. One scoped key per project keeps blast radius tiny.'
          }
        }
      ],
      keyTakeaways: [
        'An API is a structured HTTPS doorway that sends a model name and prompt and returns structured text plus token counts.',
        'Mint one dedicated, least-privilege API key per project—never reuse an org-wide admin key or paste keys into untrusted web apps or AI prompts.',
        'Store keys in a password manager and revoke any suspected leak immediately before checking billing logs.'
      ],
      glossaryTermIds: ['api', 'api-key', 'ai-credits'],
      relatedLabId: null,
      quiz: [
        {
          id: 'q-3-2-1',
          type: 'multiple_choice',
          question: 'Why should you create a separate, minimally scoped API key for each project instead of reusing one organization-wide admin key?',
          options: [
            'Providers block requests from one key across multiple days.',
            'Reusing one key disables HTTPS on the request headers.',
            'It limits the blast radius if one key leaks and lets you revoke it cleanly.',
            'Each separate key unlocks a larger context window and faster token streaming speed.'
          ],
          correctIndex: 2,
          explanation:
            'Scoped, per-project keys follow least privilege: if one project leaks, attackers cannot touch unrelated projects or admin settings, and revoking it breaks nothing else.'
        },
        {
          id: 'q-3-2-2',
          type: 'true_false',
          question:
            'If you accidentally share an API key in a screenshot, you have to delete your entire account because API keys can never be revoked.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! You can revoke (delete) a single compromised API key in seconds from your provider’s dashboard, audit usage, and immediately generate a fresh replacement.'
        },
        {
          id: 'q-3-2-3',
          type: 'spot_mistake',
          question:
            'Jamie pastes a live error snippet including `Authorization: Bearer sk-proj-9482a...` into a public forum AND into a consumer AI chat to debug it. What is the critical error?',
          options: [
            'He exposed a live credential that bots scrape in seconds—he must redact keys and revoke this one now.',
            'He used `Bearer` instead of `Basic` authentication, which triggers an automatic account lock.',
            'API error messages cannot be shared on forums even after replacing the key with a placeholder.',
            'He sent the key inside a header instead of embedding it directly inside the public URL path.'
          ],
          correctIndex: 0,
          explanation:
            'Never share live keys in forums, screenshots, or AI chats. Replace them with `YOUR_API_KEY_HERE` before asking for help—and if a live key ever slips out, revoke it immediately.'
        }
      ]
    },
    {
      id: 'ch-3-3',
      moduleId: 'mod-3-credits-keys',
      number: 3,
      title: 'Keeping API Keys Safe: `.env` Truths, Frontends & Limits',
      readMinutes: 4,
      xpReward: 30,
      summary:
        'A `.env` file is useful—not magic armor. Learn the real security rules pros follow: keep keys off frontends, understand what `.env` and `.gitignore` actually protect, and layer your cost limits.',
      analogy: {
        title: 'The Separate Envelope Beside Your Public Blueprints',
        body: 'Imagine publishing blueprints of your house online. You never write your alarm code on the blueprint—you keep it in a separate envelope (`.env`). That keeps the code out of public copies, yet remember: a paper envelope is NOT a locked vault! Anyone standing at your desk—or any script given folder access—can still read it.'
      },
      sections: [
        {
          heading: 'Golden Rule #1: Never put secret API keys in frontend/client code',
          body: 'The #1 beginner mistake is putting an API key inside browser HTML or JavaScript—or thinking a `.env` variable makes frontend code safe. **Anything delivered to a user’s browser is public**: visitors can open Inspect -> Network and read your key in seconds.\n\nWatch out for frontend build-tool traps too: variables prefixed like `VITE_*` or `NEXT_PUBLIC_*` are bundled straight into public browser JavaScript even though they started inside `.env`! If a public web app calls YOUR paid AI key, route requests through a **backend server** where the key stays server-side.',
          callout: {
            type: 'warning',
            title: 'The 60-second bot sweep',
            body: 'Automated bots scan public GitHub repos and web bundles continuously and can abuse a leaked key in under a minute. If a secret ever leaks, **revoke it first**, then clean up your files.'
          }
        },
        {
          heading: 'Golden Rule #2: What `.env` and `.gitignore` do—and do NOT do',
          body: 'Using `.env` alongside `.gitignore` separates local server secrets from shared code, as long as you know their real boundaries:\n\n• **`.env` is plain, unencrypted text on disk**: It keeps secrets out of source code, NOT hidden from malicious scripts, zip backups, or AI agents reading your folder.\n• **`.gitignore` only ignores UNTRACKED files**: Add `.env` to `.gitignore` *before* your first `git add`. If you already committed `.env` once, adding `.gitignore` later does NOT erase it from Git history!\n• **Share `.env.example` instead**: Commit a harmless template like `OPENAI_API_KEY=your-key-here` with zero real values.',
          callout: {
            type: 'example',
            title: 'Safe local hygiene before sharing code',
            body: 'Run local deterministic checks (`git status`, `git diff`, `git grep`, or a secret scanner like `gitleaks` / GitHub Push Protection) and exclude `.env` from AI agent reads—never ask a cloud AI to open `.env` or paste live secrets into a prompt!'
          }
        },
        {
          heading: 'Golden Rule #3: Layer your spending controls—never rely on one switch',
          body: 'Billing safeguards work best in layers because provider metering can lag by several minutes during fast loops:\n\n1. **Prepaid balance + auto-reload OFF** (where offered, such as OpenAI/Anthropic) plus workspace monthly spend limits.\n2. **Hard API request/token quotas** (essential on postpaid Google Cloud, where budget alerts do NOT stop spend!).\n3. **Code-level seatbelts**: set sensible `max_tokens` limits and cap retry loops in your own code so a bug stops after 3 tries instead of 3,000.',
          callout: {
            type: 'tip',
            title: 'Three checks before any first API test',
            body: '1) Scoped project key stored outside frontend code? 2) `.env` in `.gitignore` before `git add`? 3) Auto-reload OFF and/or tight API request quota active?'
          }
        }
      ],
      keyTakeaways: [
        'Never put secret API keys in HTML, browser JavaScript, `localStorage`, or frontend-exposed env vars (`VITE_*` / `NEXT_PUBLIC_*`)—keep paid keys on a backend server.',
        '`.env` is unencrypted plain text on disk, and `.gitignore` only protects untracked files—never let cloud AI read `.env`, and revoke immediately if a key ever touches Git history.',
        'Layer cost safety: prepaid credits with auto-reload OFF, strict API quotas (especially on postpaid cloud billing), and code-level `max_tokens` / loop caps.'
      ],
      glossaryTermIds: ['api-key', 'env-file', 'gitignore', 'rate-limit', 'frontend-backend'],
      relatedLabId: null,
      quiz: [
        {
          id: 'q-3-3-1',
          type: 'multiple_choice',
          question: 'A developer stores `VITE_OPENAI_API_KEY=sk-...` inside a git-ignored `.env` file and reads it directly in a public React browser app. Is the key safe from visitors?',
          options: [
            'Yes, because `.gitignore` encrypts the variable before the hosting server builds the app.',
            'No—frontend build tools bundle `VITE_*` values straight into public browser code.',
            'Yes, as long as the website runs over HTTPS and does not print the key on screen.',
            'No, only because Vite requires keys to be stored in `localStorage` instead of `.env`.'
          ],
          correctIndex: 1,
          explanation:
            'Putting a secret in `.env` does NOT protect it if frontend code reads it! Variables exposed to the browser bundle can be inspected by any visitor. Keep paid keys strictly on a backend.'
        },
        {
          id: 'q-3-3-2',
          type: 'true_false',
          question:
            'A `.env` file automatically encrypts your API keys on disk so no local program or AI agent with folder access can read them.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! `.env` is ordinary unencrypted plain text. It separates secrets from Git commits when properly git-ignored, but you must still keep it out of backups, public deploys, and cloud AI prompts.'
        },
        {
          id: 'q-3-3-3',
          type: 'spot_mistake',
          question:
            'Neha accidentally committed `.env` with her live API key to a public GitHub repo. She adds `.env` to `.gitignore`, deletes the key in a new commit, and stops there. What critical step did she skip?',
          options: [
            'She forgot to rename `.env` to `.env.secret` so GitHub’s servers recognize it as private.',
            'She needed to ask a cloud AI chatbot to inspect her `.env` file to confirm the format.',
            'Git history still holds the old commit and bots may already have the key—she must revoke it immediately.',
            'She should have moved the key into `script.js` temporarily while rewriting `.gitignore`.'
          ],
          correctIndex: 2,
          explanation:
            'Adding `.gitignore` or making a follow-up commit never erases an already-exposed secret from Git history or scraper bots. Revoke and rotate the leaked key immediately first!'
        }
      ]
    },
    {
      id: 'ch-3-4',
      moduleId: 'mod-3-credits-keys',
      number: 4,
      title: 'Reading Token Pricing & Free Local Models Like Ollama',
      readMinutes: 5,
      xpReward: 30,
      summary:
        'AI pricing tables look cryptic until you learn one trick: reading "per 1M tokens" and distinguishing input vs. output costs. Plus, learn how open-weights tools like Ollama run real AI locally for $0.',
      analogy: {
        title: 'Wholesale Rice Pricing vs. Growing Herbs on Your Windowsill',
        body: 'Seeing "$3 per million tokens" is like seeing a wholesaler quote "$10 per metric ton of rice." You are not buying a whole ton for dinner—your single bowl costs less than a penny! And running a local model like Ollama is like keeping a basil pot on your windowsill: once set up, every leaf is free and offline.'
      },
      sections: [
        {
          heading: 'How to read an AI pricing table in 15 seconds',
          body: 'Open any provider’s pricing page and you will see two numbers per model—for example, **$0.30 / 1M input tokens** and **$1.20 / 1M output tokens** (prices change over time, so always check the provider’s live page).\n\n• **Input tokens** are everything you send (system prompt, chat history, pasted context).\n• **Output tokens** are the fresh tokens the model writes back. Output typically costs 3× to 5× more because generating tokens sequentially requires heavier compute than reading input in parallel.\n\nQuick mental math: divide any "per 1M" rate by **1,000** to get the cost per 1,000 tokens (~750 words). So $3 per 1M tokens is **$0.003** (three tenths of a cent) per 750 words.',
          callout: {
            type: 'example',
            title: 'Worked example: how far $5 actually stretches',
            body: 'At an illustrative fast-model rate ($0.15/1M input, $0.60/1M output), a 1,000-token prompt + 500-token reply costs `0.00015 + 0.00030 = $0.00045`—meaning $5 buys roughly **11,000 exchanges**. Even at a heavier tier ($3 input / $15 output), $5 still covers hundreds of rich chats.'
          }
        },
        {
          heading: 'Three quiet ways bills grow faster than expected',
          body: 'Because per-call prices are tiny, beginners usually spend pennies—except in three sneaky situations:\n\n1. **Huge repeating chats**: Re-sending a 50-page document on every back-and-forth turn multiplies input tokens fast (even with prompt caching discounts).\n2. **Runaway loops**: An automated script calling an API in a tight error loop—which is why loop limits in code, strict API quotas, and prepaid balances (auto-reload OFF) belong together, since billing caps can lag.\n3. **Using flagship reasoning models for tiny tasks**: Use fast models for simple rewrites and save heavy thinkers for hard problems.',
          callout: {
            type: 'tip',
            title: 'Estimate any prompt cost in your head',
            body: 'Take your rough word count × 1.33 to get tokens, divide by 1,000,000, and multiply by the model’s per-1M price. Knowing that 10-second check lets you spot expensive workflows immediately.'
          }
        },
        {
          heading: 'Free & Private: running local models with Ollama',
          body: 'What if you want zero cloud bills, zero API keys, and full offline privacy? Tools like **Ollama** make running open-weights models on your own computer straightforward.\n\nAfter installing Ollama from its official site, one command—like `ollama run llama3.2` or `ollama run qwen2.5`—downloads a compact model onto your drive. From then on, it runs offline for $0! Compact 3B–8B models run smoothly on everyday laptops with 8–16 GB RAM, while larger models benefit from more memory or a dedicated GPU.',
          callout: {
            type: 'myth',
            title: 'Myth Buster: "Local models need a $10,000 server"',
            body: 'Huge frontier models do need big servers, yet modern compact open-weights models (3B–14B parameters) run on ordinary consumer hardware and are genuinely useful for offline notes, study, and coding practice.'
          }
        }
      ],
      keyTakeaways: [
        'Divide a provider’s "per 1M tokens" rate by 1,000 to see the tiny cost per ~750 words—and remember output tokens cost more than input tokens.',
        'Prevent bill surprises by keeping chats tidy, capping retry loops and `max_tokens` in code, and combining prepaid limits with strict API quotas.',
        'Ollama lets you run compact open-weights models locally for $0 with full offline privacy and no cloud API key.'
      ],
      glossaryTermIds: ['token-pricing', 'ai-credits', 'local-model', 'open-weights'],
      relatedLabId: 'api-credits',
      quiz: [
        {
          id: 'q-3-4-1',
          type: 'multiple_choice',
          question: 'Why are output tokens almost always priced higher than input tokens on AI APIs?',
          options: [
            'Output tokens are checked against live search engines first.',
            'Generating each new token sequentially takes more compute than reading input in parallel.',
            'Providers add a separate fixed surcharge per punctuation mark.',
            'Input tokens are compressed into a local cache on your phone while output runs in the cloud.'
          ],
          correctIndex: 1,
          explanation:
            'Reading your prompt happens in fast parallel batches, while generating each new output token sequentially requires much more compute per token—so output usually costs 3× to 5× more.'
        },
        {
          id: 'q-3-4-2',
          type: 'true_false',
          question:
            'Running a local open-weights model through Ollama requires paying per-token API fees to OpenAI.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! Ollama runs downloaded open-weights models directly on your own hardware—no cloud API key, no per-token bill, and it works completely offline.'
        },
        {
          id: 'q-3-4-3',
          type: 'spot_mistake',
          question:
            'Tariq sees a model priced at "$1.00 per 1M input tokens" and closes the tab thinking "I cannot afford $1 every time I send a message!" What did he misread?',
          options: [
            '1M means one million tokens (~750k words), so a 500-word prompt costs under a tenth of a cent.',
            'The $1.00 fee is a one-time setup charge that unlocks unlimited free prompts for a whole year.',
            'Input tokens are only billed when you attach images or PDFs, whereas plain text prompts are free.',
            '1M refers to one megabyte of internet bandwidth rather than the length of the conversation.'
          ],
          correctIndex: 0,
          explanation:
            '1M = 1,000,000 tokens (roughly 750,000 words!). A normal 500-word message (~670 tokens) costs around $0.0007 at $1/1M—less than a tenth of a single cent.'
        }
      ]
    }
  ],
  masteryCheck: {
    id: 'mc-3-credits-keys',
    title: 'Unit 3 Mastery Check',
    subtitle: 'Verify your judgment on API billing, key hygiene, frontend traps, and cost controls.',
    passThreshold: 0.75,
    xpReward: 40,
    estimatedMinutes: 2,
    questions: [
      {
        id: 'mc-3-q1',
        type: 'spot_mistake',
        question: 'A beginner switches Gemini API to a paid Google Cloud billing account and sets a "$5 monthly budget" thinking traffic will stop automatically at $5.00. What is the danger?',
        options: [
          'Google Cloud budget alerts only notify you—they do not stop API spend.',
          'Google Cloud budgets automatically block input tokens while letting output tokens run free.',
          'Monthly budgets on Google Cloud only take effect after your first $100 invoice clears.',
          'Setting any budget alert immediately revokes all existing project API keys at midnight.'
        ],
        correctIndex: 0,
        explanation:
          'Google Cloud Billing budgets send alerts only; they do NOT halt API traffic. Pair alerts with strict API request/token quotas, code loop caps, or use prepaid credit providers with auto-reload OFF.'
      },
      {
        id: 'mc-3-q2',
        type: 'multiple_choice',
        question: 'You want a public website where visitors click "Summarize" and call your paid AI API. Where must your secret API key live?',
        options: [
          'Inside a `NEXT_PUBLIC_API_KEY` variable in `.env` so the browser reads it safely.',
          'Saved in `localStorage` so it stays out of HTML tags.',
          'On a backend server that proxies requests, never in browser code.',
          'Inside `styles.css` because visitors only check JS.'
        ],
        correctIndex: 2,
        explanation:
          'Anything shipped to the browser—including `VITE_*`/`NEXT_PUBLIC_*` build vars and `localStorage`—is visible to visitors. Always keep paid keys server-side.'
      },
      {
        id: 'mc-3-q3',
        type: 'multiple_choice',
        question: 'Before pushing a side project to GitHub, you want to verify no API keys leaked into your code. Which approach is safest?',
        options: [
          'Paste your `.env` file into a web chatbot and ask it to search your repo for matching strings.',
          'Run local `git status`, `git diff`, or `gitleaks` while keeping `.env` out of AI reads.',
          'Push the repository first as public and check if any bots warn you within an hour.',
          'Add `.env` to `.gitignore` after committing it and assume Git deletes past commits automatically.'
        ],
        correctIndex: 1,
        explanation:
          'Deterministic local checks (`git status`, `git diff`, `git grep`, `gitleaks`, GitHub Push Protection) catch leaks reliably without exposing live `.env` secrets to cloud AI logs.'
      },
      {
        id: 'mc-3-q4',
        type: 'spot_mistake',
        question: 'Maya creates one organization-wide admin API key and pastes it into four different personal apps and a random free online "BYOK prompt tester." What best practice did she violate?',
        options: [
          'Admin keys cannot be used for inference unless you run Ollama at the same time.',
          'BYOK tools require sharing your main account password alongside the API key header.',
          'One key can only send requests to one model family per calendar month.',
          'Always mint least-privilege project keys and never paste keys into untrusted web tools.'
        ],
        correctIndex: 3,
        explanation:
          'Use dedicated, least-privilege keys scoped per project with tight limits, and never paste live keys into untrusted third-party web pages.'
      }
    ]
  }
};
