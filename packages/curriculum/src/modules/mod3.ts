import type { CurriculumModule } from '../schema.ts';

export const MODULE_3: CurriculumModule = {
  id: 'mod-3-credits-keys',
  number: 3,
  title: 'AI Credits, Pricing & API Keys',
  subtitle: 'Demystify subscriptions vs. pay-as-you-go credits, API keys, safety rules, and free local AI.',
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
        'Paying $20/month for ChatGPT Plus or Claude Pro is completely separate from buying API credits. Learn which billing model fits your habits so you never overpay or get surprised.',
      analogy: {
        title: 'The All-You-Can-Eat Buffet vs. The Prepaid Coffee Card',
        body: 'A monthly chat subscription (like ChatGPT Plus, Claude Pro, or Gemini Advanced) is an all-you-can-eat buffet: pay one flat fee per month and eat inside the restaurant whenever you want (with fair-use pauses if you sprint too fast). Pay-as-you-go AI credits are a prepaid coffee card: load $5, take the coffee anywhere—including into your own apps and coding tools—and pay exact pennies only for the tokens you actually consume.'
      },
      sections: [
        {
          heading: 'Why two separate billing systems exist',
          body: 'One of the #1 confusions for beginners happens right here: *"I already pay $20/month for Claude Pro or ChatGPT Plus—why is this developer console asking me to add $5 of credits?"*\n\nConsumer chat apps and developer APIs are billed separately at almost every AI company. Your $20/month subscription covers chatting inside their polished website and mobile app (plus some select desktop/CLI bundles depending on your plan). Meanwhile, **AI Credits** pay for raw programmatic access through their API—the pipe that lets outside tools, automations, and apps you build talk directly to the model.',
          callout: {
            type: 'myth',
            title: 'Myth Buster: "Using the API is expensive and only for big tech companies"',
            body: 'Surprise: for light or medium builders, pay-as-you-go API credits are often MUCH cheaper than a $20/month subscription! Five dollars of credits on a fast model can easily fund hundreds—even thousands—of chats and small projects.'
          }
        },
        {
          heading: 'When a subscription wins vs. when AI credits win',
          body: 'Choose a **monthly chat subscription** when:\n• You chat casually every day in the browser or phone app.\n• You want zero setup, built-in web search, voice mode, and predictable flat monthly pricing.\n\nChoose **pay-as-you-go AI credits** when:\n• You use AI sporadically (say, three weekends a month) and do not want a recurring $20 bill.\n• You want to plug AI into your own websites, apps, spreadsheets, or tools like Marain.\n• You want freedom to swap between Gemini, Claude, and GPT inside one tool.',
          callout: {
            type: 'tip',
            title: 'Start with a $5 prepaid test balance + hard cap',
            body: 'Most providers let you load $5 prepaid credits with auto-reload turned OFF. That way, even if you experiment all month, your maximum possible spend is literally $5—zero surprise bills.'
          }
        },
        {
          heading: 'Watch out for "wrapped" credit markup in third-party apps',
          body: 'Many trendy AI websites charge you $29/month for "500 AI credits" that secretly call the exact same Gemini, Claude, or OpenAI APIs costing them $1 behind the scenes. That convenience can be fine if the tool saves you hours, yet once you know what raw API credits cost—and how BYOK ("Bring Your Own Key") apps work—you can choose intentionally instead of paying mystery markups.',
          callout: {
            type: 'example',
            title: 'Real-world cost perspective',
            body: 'Sending a 500-word question and receiving a 500-word answer uses roughly 1,400 total tokens. On a fast model like Gemini Flash or GPT-4o mini, that entire back-and-forth costs less than $0.0005—about one twentieth of a single US cent!'
          }
        }
      ],
      keyTakeaways: [
        'Monthly chat subscriptions (flat fee inside the provider’s own app) and pay-as-you-go API credits (metered per token for external apps/tools) are billed separately.',
        'Prepaid AI credits let light users and builders pay exact fractions of a cent per prompt instead of $20 every month.',
        'Turning off auto-reload and setting a $5 spending cap eliminates any risk of surprise bills while learning.'
      ],
      glossaryTermIds: ['ai-credits', 'rate-limit', 'token-pricing', 'chat-wrapper'],
      relatedLabId: 'api-credits',
      quiz: [
        {
          id: 'q-3-1-1',
          type: 'multiple_choice',
          question: 'How do pay-as-you-go AI credits typically bill you?',
          options: [
            'A fixed $50 fee every time you open your laptop.',
            'Only if you build a mobile app.',
            'By how many minutes you keep your browser tab open.',
            'Based strictly on the number of input and output tokens your requests actually use.'
          ],
          correctIndex: 3,
          explanation:
            'API credits are metered directly by token count (typically quoted per million tokens), so idle time costs $0 and short prompts cost tiny fractions of a cent.'
        },
        {
          id: 'q-3-1-2',
          type: 'true_false',
          question:
            'Paying $20/month for a consumer chat website automatically includes unlimited free API credits for external apps you build.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! Consumer web/mobile chat subscriptions and developer API credit balances are separate billing systems at major AI providers.'
        },
        {
          id: 'q-3-1-3',
          type: 'spot_mistake',
          question:
            'Rohan wants to try building a small personal tool on weekends, so he skips API credits because he assumes they cost at least $100/month. What did he misunderstand?',
          options: [
            'Weekend API usage is banned.',
            'API credits only work on Windows.',
            'He can load as little as $5 of prepaid credits with auto-reload off—often lasting months for light personal building.',
            'You have to pay $100/month to get a password.'
          ],
          correctIndex: 2,
          explanation:
            'Prepaid API credits have no mandatory monthly fee! A small $5 balance with auto-reload off is one of the safest, cheapest ways for beginners to experiment.'
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
        'An API is just a clean digital menu for software to talk to software, and an API key is the secret badge proving your account is allowed to place orders.',
      analogy: {
        title: 'The Restaurant Waiter and Your VIP Tab Card',
        body: 'Imagine dining at a restaurant. You (your app) do not wander straight into the blazing kitchen (the AI server farm). Instead, you hand a clear order slip to the waiter (the API), who walks it to the kitchen and carries your finished meal back to the table. Your API key is the secret card linked to your tab—the waiter checks it so the kitchen knows whose account to bill.'
      },
      sections: [
        {
          heading: 'What actually happens during an AI API call',
          body: 'The acronym **API** (Application Programming Interface) sounds intimidating, yet it is simply a predictable URL on the internet that accepts a neatly formatted text package (usually JSON) and returns a neatly formatted answer.\n\nWhenever a BYOK app—like Marain or a website you create—sends a prompt to Claude, Gemini, or OpenAI, three tiny things travel over an encrypted `https://` connection:\n\n1. **The destination URL** (which AI kitchen to call)\n2. **The header with your API key** (proving who is ordering)\n3. **The message body** (which model you want, your system prompt, and your message)\n\nA second or two later, the server sends back the reply text plus exact token counts.',
          callout: {
            type: 'example',
            title: 'Peeking at a real API payload in plain English',
            body: 'Under the hood, an API call literally looks like a tidy grocery list: `{ "model": "claude-sonnet", "prompt": "Explain photosynthesis in 2 sentences" }`. You can inspect one live in the API Keys & Credits Lab!'
          }
        },
        {
          heading: 'What an API key looks like—and what BYOK means',
          body: 'When you sign up on Google AI Studio, Anthropic Console, or OpenAI Platform and click **"Create API Key,"** the site generates a long random string like `sk-ant-api03-8xK9...` or `AIzaSy...`.\n\nMany modern desktop tools offer **BYOK (Bring Your Own Key)**. Instead of charging you a steep subscription markup, the app stays free or one-time purchase, and you optionally plug in your own API key so your computer talks straight to your chosen AI provider at wholesale token prices.',
          callout: {
            type: 'tip',
            title: 'Copy it once, store it neatly',
            body: 'For security, most providers show your brand-new API key ONLY ONCE the moment you create it. Paste it right into your password manager or local app settings—and if you ever lose it, simply delete the old key and mint a fresh one in 5 seconds.'
          }
        },
        {
          heading: 'You can create, label, and revoke keys anytime',
          body: 'Good news for anxious beginners: an API key is NOT permanent like your Social Security number! You can create separate labeled keys for each project (for example, `marain-learning` and `weekend-recipe-app`).\n\nIf you ever stop using an app or suspect a key leaked, one click on **Revoke / Delete** shuts that key off instantly worldwide without touching your main account.',
          callout: {
            type: 'warning',
            title: 'Treat every API key like a live credit card',
            body: 'Anyone who obtains your key can run thousands of AI requests on your dime within seconds. Never paste a real key into group chats, YouTube comments, screenshots, or public code files!'
          }
        }
      ],
      keyTakeaways: [
        'An API is a structured digital waiter that lets one app send prompts to an AI provider and receive structured replies back.',
        'An API key is a long secret string (`sk-...`) that identifies your account and links usage to your credit balance.',
        'You can generate separate keys per app and revoke any key in one click if you ever stop using it or suspect a leak.'
      ],
      glossaryTermIds: ['api', 'api-key', 'ai-credits'],
      relatedLabId: 'api-credits',
      quiz: [
        {
          id: 'q-3-2-1',
          type: 'multiple_choice',
          question: 'What is the main purpose of an API key when calling an AI provider?',
          options: [
            'It makes the AI model smarter and increases its context window.',
            'It proves who you are and links the API request to your billing/credit account.',
            'It converts English into tokens.',
            'It unlocks offline mode without internet.'
          ],
          correctIndex: 1,
          explanation:
            'Your API key authenticates your request—just like a linked payment badge—so the provider knows which account is authorized and which credit balance to charge.'
        },
        {
          id: 'q-3-2-2',
          type: 'true_false',
          question:
            'If you accidentally share an API key in a screenshot, you have to delete your entire account because API keys can never be revoked.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! You can revoke (delete) a single compromised API key in seconds from your provider’s dashboard and immediately generate a fresh replacement.'
        },
        {
          id: 'q-3-2-3',
          type: 'spot_mistake',
          question:
            'In a help forum, Jamie asks why his code is broken and pastes his full request including `Authorization: Bearer sk-proj-9482a...`. What critical mistake did Jamie make?',
          options: [
            'He posted his live secret API key publicly where bots can scrape and drain his credits within minutes.',
            'He used Bearer instead of Basic.',
            'API requests cannot be discussed on forums.',
            'He forgot to include his home address.'
          ],
          correctIndex: 0,
          explanation:
            'Automated bots constantly scan public forums and GitHub for strings starting with `sk-` or `AIza`. Always replace your key with `YOUR_API_KEY_HERE` before sharing snippets or screenshots!'
        }
      ]
    },
    {
      id: 'ch-3-3',
      moduleId: 'mod-3-credits-keys',
      number: 3,
      title: 'Keeping API Keys Safe: `.env` Files & Never Leaking Secrets',
      readMinutes: 4,
      xpReward: 30,
      summary:
        'You do not need to be a cybersecurity expert to keep API keys bulletproof. Learn the three tiny golden rules—`.env`, `.gitignore`, and spending caps—that protect every pro builder.',
      analogy: {
        title: 'The Locked Safe Next to Your Public Blueprints',
        body: 'Imagine sharing the architectural blueprints of your dream house online so friends can admire the layout. You would NEVER draw your front-door alarm PIN directly onto the blueprint! Instead, the blueprints stay shareable while your alarm PIN sits in a private note taped inside your wallet. In software, your code is the blueprint and your `.env` file is the private wallet note.'
      },
      sections: [
        {
          heading: 'Golden Rule #1: Never hardcode secrets in your code files',
          body: 'The #1 beginner mistake when building with AI is pasting an API key straight into `script.js` or `index.html`, like `const apiKey = "sk-ant-12345..."`.\n\nThere are two huge dangers here. First, if you ever share that folder or upload it to GitHub, your key goes public forever in version history. Second, **anything inside a public website’s HTML or JavaScript can be viewed by every visitor** with one right-click ("Inspect Source"). Front-end website code is like writing on a billboard—never put a secret on a billboard!',
          callout: {
            type: 'warning',
            title: 'The 60-second bot sweep',
            body: 'Security researchers have tested pushing a fake API key to a public GitHub repo—automated scraper bots often discover and try to abuse leaked keys in under 60 seconds. If a key ever leaks, revoke it immediately first, then clean up.'
          }
        },
        {
          heading: 'Golden Rule #2: Use a `.env` file paired with `.gitignore`',
          body: 'Professionals separate secrets from code using two tiny plain-text files sitting in the project folder:\n\n• **`.env`**: Stores your private keys locally on your computer (`OPENAI_API_KEY=sk-...`). Your local program reads the key from this file automatically.\n• **`.gitignore`**: Lists file names that Git must NEVER upload to GitHub. Putting `.env` inside `.gitignore` guarantees your secrets stay safely on your laptop while your clean code gets backed up.\n\nPro habit: create a harmless template file named `.env.example` containing `OPENAI_API_KEY=paste-your-key-here` so anyone (including future you) remembers what key name the project expects.',
          callout: {
            type: 'example',
            title: 'What a safe project folder looks like',
            body: 'Inside `.env` (private, ignored by Git): `GEMINI_API_KEY=AIzaSyRealSecret123`\nInside `.gitignore` (committed): `.env`\nInside your server code: `process.env.GEMINI_API_KEY` — zero secrets in sight!'
          }
        },
        {
          heading: 'Golden Rule #3: Set a hard spending cap & keep keys off public frontends',
          body: 'Even pros make typos, so always add a financial seatbelt: go to your provider’s Billing -> Usage Limits screen and set a hard monthly budget (such as **$5 or $10**) plus an email alert at 50%.\n\nAnd remember: if you ever build a public website where strangers click an "Ask AI" button, your secret API key must live on a small backend server (or let visitors enter their own key in local settings), never baked into the webpage’s browser files.',
          callout: {
            type: 'tip',
            title: 'Ask your AI coding tool to double-check!',
            body: 'Before publishing any project, ask your AI assistant: "Scan my folder and verify that no API keys are hardcoded and that .env is listed in .gitignore."'
          }
        }
      ],
      keyTakeaways: [
        'Never hardcode an API key directly inside HTML, client-side JavaScript, screenshots, or files uploaded to GitHub.',
        'Store secrets in a local `.env` file and add `.env` to `.gitignore` so Git never uploads your keys.',
        'Always configure a hard monthly spending cap ($5–$10) in your provider dashboard as an automatic safety net.'
      ],
      glossaryTermIds: ['api-key', 'env-file', 'gitignore', 'rate-limit', 'frontend-backend'],
      relatedLabId: 'api-credits',
      quiz: [
        {
          id: 'q-3-3-1',
          type: 'multiple_choice',
          question: 'Why do builders put `.env` inside their `.gitignore` file?',
          options: [
            'To make the website load faster on mobile phones.',
            'To compress images automatically.',
            'To turn off dark mode.',
            'To prevent Git from accidentally uploading private API keys stored in `.env` to GitHub.'
          ],
          correctIndex: 3,
          explanation:
            '`.gitignore` tells Git to skip listed files completely—keeping your `.env` secrets strictly on your local computer while safely syncing your code.'
        },
        {
          id: 'q-3-3-2',
          type: 'true_false',
          question:
            'Putting your secret API key inside a public website’s `script.js` file is safe as long as you do not display it visually on the page.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! Any visitor’s browser downloads `script.js` in full—anyone can open Developer Tools ("Inspect") and read your secret key in two seconds.'
        },
        {
          id: 'q-3-3-3',
          type: 'spot_mistake',
          question:
            'Neha notices she accidentally pushed her real `ANTHROPIC_API_KEY` to a public GitHub repository two minutes ago. She deletes the line in a new commit and thinks: "Phew, now it is completely safe!" What is her mistake?',
          options: [
            'GitHub does not allow deleting lines.',
            'Anthropic keys automatically change every minute anyway.',
            'Old Git commits stay visible in history and bots may already have copied the key—she MUST revoke/rotate the leaked key immediately in Anthropic’s dashboard.',
            'She just needs to rename `.env` to `.txt`.'
          ],
          correctIndex: 2,
          explanation:
            'Once a key touches a public repo or screenshot, assume it is compromised forever. Revoke it in the provider dashboard right away and generate a brand-new key!'
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
        'AI pricing tables look cryptic until you learn one simple trick: reading "per 1M tokens" and distinguishing input vs. output costs. Plus, discover how to run real AI on your own computer for $0.',
      analogy: {
        title: 'Wholesale Rice Pricing vs. Growing Herbs on Your Windowsill',
        body: 'Seeing "$3 per million tokens" is like seeing a grocery wholesaler quote "$10 per metric ton of rice." You are not buying a whole ton for dinner—your single bowl costs less than a penny! And running a local model like Ollama is like keeping a basil pot on your windowsill: once you set it up, every leaf you pick is completely free and offline.'
      },
      sections: [
        {
          heading: 'How to read an AI pricing table in 15 seconds',
          body: 'Open any provider’s pricing page and you will see two numbers per model—for example, **$0.30 / 1M input tokens** and **$1.20 / 1M output tokens**.\n\n• **Input tokens** are everything you send to the model (system prompt, chat history, pasted documents).\n• **Output tokens** are the fresh words the model generates back. Output tokens typically cost 3× to 5× more because generating each new token requires heavier computation than reading input in parallel.\n\nQuick mental math: divide any "per 1M" price by **1,000** to get the cost per 1,000 tokens (~750 words). So $3 per 1M tokens equals just **$0.003** (three tenths of a cent!) per 750 words.',
          callout: {
            type: 'example',
            title: 'How far does $5 actually go?',
            body: 'At ~$0.15/1M input and ~$0.60/1M output (typical budget fast-model rates), a 1,000-token question + 500-token reply costs ~$0.00045. Five dollars buys roughly **11,000 conversations**! Even on a mid-tier flagship model (~$3 input / $15 output), $5 still covers hundreds of rich coding chats.'
          }
        },
        {
          heading: 'Three quiet ways bills grow faster than expected',
          body: 'Because per-call prices are tiny, beginners usually spend pennies—except in three sneaky situations:\n\n1. **Huge repeating chats**: Re-sending a 50-page PDF on every single back-and-forth turn multiplies input tokens fast (though modern "prompt caching" discounts repeated inputs).\n2. **Runaway loops**: An automated script that calls an AI in an infinite loop by mistake—which is why your $5 spending cap is magic.\n3. **Using flagship reasoning models for tiny tasks**: Use fast models for simple summaries and save heavy thinkers for hard problems.',
          callout: {
            type: 'tip',
            title: 'Test numbers in the API Credits Calculator',
            body: 'In the API Keys & Credits Lab, slide prompt length and messages per day across Gemini Flash, Claude Sonnet, GPT-4o mini, and Ollama to develop an instant gut feel for real costs.'
          }
        },
        {
          heading: 'Free & Private: running local models with Ollama',
          body: 'What if you want zero cloud bills, zero API keys, and 100% privacy? Tools like **Ollama** make running open-weights models on your own Linux, Mac, or Windows machine ridiculously simple.\n\nAfter installing Ollama, one tiny terminal command—like `ollama run llama3.2` or `ollama run qwen2.5`—downloads a compact model right onto your drive. From then on, it runs completely offline for $0! Smaller 3B–8B parameter models run smoothly on everyday laptops with 8–16 GB RAM, while larger models appreciate a dedicated graphics card (GPU).',
          callout: {
            type: 'myth',
            title: 'Myth Buster: "Local models need a $10,000 server"',
            body: 'Huge 400B frontier models do need big servers, but modern compact models (3B–14B parameters) run right on ordinary consumer laptops and are shockingly capable for offline notes, practice, and coding help!'
          }
        }
      ],
      keyTakeaways: [
        'Divide a provider’s "per 1M tokens" rate by 1,000 to see the tiny cost per ~750 words—and remember output tokens cost more than input tokens.',
        'Watch out for endlessly long repeating threads and unguarded loops; keep chats tidy and enable hard billing caps.',
        'Ollama lets you download and run open-weights AI models directly on your own computer for $0 with full offline privacy.'
      ],
      glossaryTermIds: ['token-pricing', 'ai-credits', 'local-model', 'open-weights'],
      relatedLabId: 'api-credits',
      quiz: [
        {
          id: 'q-3-4-1',
          type: 'multiple_choice',
          question: 'Why are output tokens almost always priced higher than input tokens?',
          options: [
            'Providers charge extra for punctuation.',
            'Generating brand-new output tokens one by one requires much more compute per token than reading input text.',
            'Input tokens are always free.',
            'Output tokens are translated into multiple languages first.'
          ],
          correctIndex: 1,
          explanation:
            'Reading your prompt happens in fast parallel batches, while writing each output token sequentially takes more work—so providers usually price output 3× to 5× higher than input.'
        },
        {
          id: 'q-3-4-2',
          type: 'true_false',
          question:
            'Running a local open-weights model through Ollama requires paying per-token API fees to OpenAI.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! Ollama runs downloaded open-weights models directly on your own computer’s hardware—no cloud API key, no per-token bill, and it even works offline.'
        },
        {
          id: 'q-3-4-3',
          type: 'spot_mistake',
          question:
            'Tariq sees a model priced at "$1.00 per 1M input tokens" and closes the tab thinking "I cannot afford $1 every time I send a message!" What did he misread?',
          options: [
            '1M means one MILLION tokens (~750,000 words)—a typical 500-word message costs less than a tenth of a single cent!',
            '1M means one message.',
            'The price is per year.',
            'Input tokens are only charged to businesses.'
          ],
          correctIndex: 0,
          explanation:
            '1M = 1,000,000 tokens (roughly ten full novels!). A normal short message costs around $0.0007 at $1/1M—less than a tenth of a cent.'
        }
      ]
    }
  ]
};
