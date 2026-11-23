import type { CurriculumModule } from '../schema.ts';

export const MODULE_1: CurriculumModule = {
  id: 'mod-1-what-is-ai',
  number: 1,
  title: 'What Even Is AI?',
  subtitle: 'A crisp 5-minute foundation: how modern AI works, which model to pick, and what chat apps hide under the hood.',
  icon: 'brain',
  accentHex: '#10B981',
  estimatedMinutes: 5,
  recommendedLabId: null,
  chapters: [
    {
      id: 'ch-1-1',
      moduleId: 'mod-1-what-is-ai',
      number: 1,
      title: 'Rules vs. Patterns: Why AI Feels Different',
      readMinutes: 1,
      xpReward: 25,
      summary:
        'Regular software obeys exact rules written by programmers. Modern AI learns fuzzy patterns from millions of examples—making it great at messy language and unreliable at exact math.',
      analogy: {
        title: 'The Tax Table vs. The Experienced Editor',
        body: 'A spreadsheet formula is regular software: give it the same numbers and it returns the exact same total every time. Modern AI is more like a seasoned editor who has read ten thousand memos—it cannot prove a math formula, yet it spots tone, structure, and awkward phrasing immediately.'
      },
      sections: [
        {
          heading: 'Regular software follows exact recipes',
          body: 'Calculators, spreadsheets, and banking systems run on explicit rules written in advance: if a balance drops below zero, trigger an alert. Whenever a task demands 100% repeatable accuracy, hand-written rules are still undefeated.',
          callout: {
            type: 'example',
            title: 'Where rigid rules break down',
            body: 'Try writing fixed rules to flag rude customer emails. Blocking a list of bad words misses polite sarcasm ("Thanks for wasting my afternoon") and wrongly flags harmless messages.'
          }
        },
        {
          heading: 'AI learns patterns into frozen weights',
          body: 'Instead of hand-coding rules, AI labs train a network on billions of examples, adjusting internal numbers called **model weights** until its guesses improve. That expensive study phase is **training**. When you send a prompt later, the weights stay frozen while it generates a reply—a fast step called **inference**.',
          callout: {
            type: 'myth',
            title: 'Your chat does not retrain the model',
            body: 'Sending a message runs inference on frozen weights. Your prompt may shape the current thread, yet it does not rewrite the model’s core knowledge in real time.'
          }
        },
        {
          heading: 'Pick the right tool for the job',
          body: 'Because AI predicts probabilities rather than running exact formulas, reach for it on messy human tasks—drafting replies, summarizing notes, comparing options, or untangling jargon. Keep exact arithmetic, budgets, and legal totals inside spreadsheets or deterministic code.',
          callout: {
            type: 'tip',
            title: 'Best combo: AI writes the formula, software runs it',
            body: 'Need to sum 500 expense rows by category? Ask AI to write the spreadsheet formula, then let the spreadsheet calculate the exact number.'
          }
        }
      ],
      keyTakeaways: [
        'Regular software executes exact human-written rules; AI applies statistical patterns learned from examples.',
        'Training tunes model weights upfront; everyday prompting runs inference on frozen weights.',
        'Use AI for messy language and drafting, and deterministic software for exact calculations.'
      ],
      glossaryTermIds: ['ai', 'model-weights', 'training-vs-inference'],
      relatedLabId: null,
      quiz: [
        {
          id: 'q-1-1-1',
          type: 'multiple_choice',
          question: 'How does modern AI handle a messy task like sorting sarcastic customer complaints differently from traditional software?',
          options: [
            'It looks up every complaint against a live database maintained by human moderators.',
            'It learns statistical patterns from examples instead of relying on fixed rules.',
            'It automatically rewrites its source code line by line after every customer email.',
            'It converts every sentence into a strict yes-or-no spreadsheet formula before replying.'
          ],
          correctIndex: 1,
          explanation:
            'Traditional software relies on explicit rules written by humans, whereas modern AI learns flexible patterns across huge sets of examples.'
        },
        {
          id: 'q-1-1-2',
          type: 'true_false',
          question:
            'When you correct a mistake in a chat with Claude or ChatGPT, the model permanently updates its core weights for all users right away.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False. Chatting runs inference on frozen model weights. Your correction only helps inside that active conversation unless a separate training run happens later.'
        },
        {
          id: 'q-1-1-3',
          type: 'spot_mistake',
          question:
            'Maya pastes 600 monthly receipts into a plain AI chat and asks for an exact tax total instead of using a spreadsheet. What is the real risk?',
          options: [
            'Spreadsheets cannot categorize receipts without an AI plugin.',
            'AI chat models refuse to process messages that contain currency symbols or decimals.',
            'Probabilistic language models can miscount exact arithmetic across long lists.',
            'Pasting financial numbers into a chat automatically retrains the model weights overnight.'
          ],
          correctIndex: 2,
          explanation:
            'Language models estimate plausible text rather than running a calculator on every row. Let AI draft the spreadsheet formula, and let the spreadsheet sum the exact total.'
        }
      ]
    },
    {
      id: 'ch-1-2',
      moduleId: 'mod-1-what-is-ai',
      number: 2,
      title: 'How LLMs Write: One Token at a Time',
      readMinutes: 1,
      xpReward: 25,
      summary:
        'A Large Language Model does not retrieve stored answers from a vault. It builds every reply fresh by predicting the next chunk of text—which explains both its creativity and its confident mistakes.',
      analogy: {
        title: 'Phone Autocomplete Scaled to an Entire Library',
        body: 'When your phone keyboard suggests "tomorrow" after "See you", it is predicting the next likely word. An LLM does the same thing after studying vast amounts of writing and code—so predicting the next chunk accurately requires capturing grammar, logic, and structure.'
      },
      sections: [
        {
          heading: 'What "Large Language Model" means in plain English',
          body: '**Large** refers to billions of tuned weights trained on massive text collections. **Language** reflects how it reads and writes human prose and code—and modern **multimodal** models also take screenshots, photos, or audio as input. **Model** simply means a mathematical map of patterns.',
          callout: {
            type: 'example',
            title: 'Why next-chunk guessing looks like reasoning',
            body: 'To predict the next piece after "A $40 shirt with 25% off costs $", the model must pick "30"—meaning training quietly rewards patterns that track math, logic, and context.'
          }
        },
        {
          heading: 'Generated live, never copied from an answer vault',
          body: 'An LLM writes one small text chunk (**token**) at a time, feeds that chunk back into the conversation, and predicts the next until it outputs a stop signal. Because several continuations can have similar probabilities, asking the same creative prompt twice often yields two fresh answers.',
          callout: {
            type: 'myth',
            title: 'Fluent tone does not prove a fact is real',
            body: 'Post-training teaches models to sound clear and helpful, not to verify every fact. Without a live search tool or a source you paste in, a model can smoothly invent a realistic quote or citation.'
          }
        },
        {
          heading: 'Reading the clues when an answer feels off',
          body: 'Once you know replies are predicted sequentially, three everyday quirks make total sense: models stream word by word, they can change phrasing on a retry, and they need **grounding** (real documents or web search) whenever accuracy on recent or niche facts matters.',
          callout: {
            type: 'tip',
            title: 'Spot ungrounded claims fast',
            body: 'Whenever an AI gives you a specific date, price, law, or link from memory alone, treat it as a draft to verify—not a verified lookup.'
          }
        }
      ],
      keyTakeaways: [
        'LLMs generate every reply sequentially via next-token prediction rather than pulling saved scripts from a database.',
        'Multimodal models extend the same pattern engine to screenshots, photos, PDFs, and audio.',
        'Polished prose is a product of pattern prediction and post-training—always verify ungrounded facts.'
      ],
      glossaryTermIds: ['llm', 'next-token-prediction', 'multimodal'],
      relatedLabId: null,
      quiz: [
        {
          id: 'q-1-2-1',
          type: 'multiple_choice',
          question: 'Why does asking the exact same brainstorming prompt twice often give you two different replies?',
          options: [
            'The model samples among probable next tokens as it generates each reply fresh.',
            'The server switches you to another AI company on retries.',
            'The model checks your past browser cookies to intentionally avoid repeating earlier words.',
            'Each reply is picked randomly from a fixed list of pre-written responses saved by engineers.'
          ],
          correctIndex: 0,
          explanation:
            'LLMs generate replies token by token from probability distributions. For open-ended prompts, multiple tokens are plausible, so fresh runs naturally vary.'
        },
        {
          id: 'q-1-2-2',
          type: 'true_false',
          question:
            'Because a multimodal LLM can read a screenshot of a receipt or error screen, it automatically searches the live internet to verify every detail in the image.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False. Being multimodal only means the model can process images alongside text. Live internet verification still requires an external search tool.'
        },
        {
          id: 'q-1-2-3',
          type: 'spot_mistake',
          question:
            'Daniel asks an offline AI model for the closing price of a stock today and concludes: "It gave me a specific number with two decimals, so it must have checked live market data." What is the mistake?',
          options: [
            'Offline models are unable to format numbers with decimal places unless connected to Excel.',
            'Stock prices are updated only once a week, so the model could have remembered them from training.',
            'Next-token prediction can generate a fluent, plausible number even without live web access.',
            'Only multimodal models with camera permissions are allowed to read financial websites.'
          ],
          correctIndex: 2,
          explanation:
            'A bare LLM has frozen knowledge and optimizes for plausible continuations. Unless a wrapper explicitly runs a live search tool, specific numbers about today can be pure guesses.'
        }
      ]
    },
    {
      id: 'ch-1-3',
      moduleId: 'mod-1-what-is-ai',
      number: 3,
      title: 'Choosing a Model: Families, Tiers & Open Weights',
      readMinutes: 2,
      xpReward: 25,
      summary:
        'Not all AI is one brain. Major labs ship fast, balanced, and reasoning tiers—and open-weights models let people run AI privately without depending on a single cloud vendor.',
      analogy: {
        title: 'Hatchbacks, Sedans, and Heavy Trucks',
        body: 'Calling every AI "ChatGPT" is like calling every vehicle a sedan. Different makers build separate model families, and each maker sells nimble economy tiers for quick errands alongside heavy-duty thinkers for tough problems.'
      },
      sections: [
        {
          heading: 'Separate builders, distinct strengths',
          body: 'Three hosted cloud families dominate everyday apps: **Claude** (Anthropic), **Gemini** (Google), and **GPT** (OpenAI). They are trained independently by rival teams, so their writing tone, context limits, tool integrations, and pricing all differ.',
          callout: {
            type: 'tip',
            title: 'Match the tier to the task',
            body: 'Fast/mini tiers shine on proofreading, translations, and quick summaries. Save slower flagship or reasoning tiers for complex plans, subtle debugging, or high-stakes analysis.'
          }
        },
        {
          heading: 'Open-weights models change who controls the model',
          body: 'Teams such as Meta (**Llama**), **DeepSeek**, **Qwen**, and **Mistral** release **open-weights** models—publishing the finished parameter files publicly. Anyone can host them on chosen servers or run compact versions directly on their own hardware offline.',
          callout: {
            type: 'example',
            title: 'When private or local matters',
            body: 'Summarizing personal medical notes or sensitive journal drafts on an offline device keeps every word off third-party cloud servers and costs nothing per message.'
          }
        },
        {
          heading: 'Skip benchmark obsession',
          body: 'Leaderboard charts change every month and rarely predict how useful a model feels on your real tasks. In daily life, giving crisp context and checking outputs improves results far more than chasing the newest model name.',
          callout: {
            type: 'myth',
            title: 'More expensive does not always mean better for the job',
            body: 'Sending a grocery list to a slow flagship reasoning model wastes time and money when a fast small tier finishes the same job cleanly in half a second.'
          }
        }
      ],
      keyTakeaways: [
        'Claude, Gemini, and GPT are separate model families built by independent labs—not one shared backend.',
        'Use fast small tiers for quick routine tasks and heavier reasoning tiers only when complexity justifies the wait and cost.',
        'Open-weights models publish their trained weights so you can self-host or run compact versions privately offline.'
      ],
      glossaryTermIds: ['llm', 'open-weights', 'model-weights', 'local-model'],
      relatedLabId: null,
      quiz: [
        {
          id: 'q-1-3-1',
          type: 'multiple_choice',
          question: 'Which task is the BEST fit for a fast, smaller model tier instead of a slow flagship reasoning model?',
          options: [
            'Auditing a tangled multi-file payment bug with subtle race conditions across a whole app.',
            'Designing a long-term database migration strategy with strict rollback constraints.',
            'Cleaning up typos and bullet formatting in ten lines of meeting notes.',
            'Comparing conflicting legal clauses across three dense commercial supplier contracts.'
          ],
          correctIndex: 2,
          explanation:
            'Fast small tiers handle routine formatting, proofreading, and simple rewrites in a split second at a fraction of the cost—reserve heavy reasoning models for genuinely hard problems.'
        },
        {
          id: 'q-1-3-2',
          type: 'true_false',
          question:
            'An open-weights model publishes its trained weight files so individuals or companies can host or run it on hardware they control.',
          options: ['True', 'False'],
          correctIndex: 0,
          explanation:
            'True. Publishing the trained parameter files lets people run open-weights models on private servers or personal devices instead of relying on a single vendor’s cloud.'
        },
        {
          id: 'q-1-3-3',
          type: 'spot_mistake',
          question:
            'A colleague says: "I switched from ChatGPT to Claude and Gemini, so I am just paying three apps to talk to the exact same model underneath." What did they get wrong?',
          options: [
            'Claude, Gemini, and GPT are distinct model families trained separately by Anthropic, Google, and OpenAI.',
            'ChatGPT and Gemini share identical weights, while only Claude runs on an open-weights engine.',
            'All three websites run locally on your phone hardware without calling any cloud servers.',
            'The underlying models are identical, and only the app color themes and login screens differ.'
          ],
          correctIndex: 0,
          explanation:
            'Each lab trains its own model family with its own architecture, training mix, context limits, and pricing—they are genuinely different models, not reskins of one engine.'
        }
      ]
    },
    {
      id: 'ch-1-4',
      moduleId: 'mod-1-what-is-ai',
      number: 4,
      title: 'Raw Models vs. AI Apps: What the Wrapper Adds',
      readMinutes: 1,
      xpReward: 25,
      summary:
        'A raw AI model only takes input and outputs text—with zero memory between turns. Everything else you see in ChatGPT, Claude, or Gemini comes from the app wrapped around it.',
      analogy: {
        title: 'A Bare Engine vs. A Finished Car',
        body: 'A raw LLM is like an engine sitting on a workshop stand: powerful, yet unable to steer or brake by itself. A chat app bolts on the seats, fuel gauge, GPS, and steering wheel so you can actually drive.'
      },
      sections: [
        {
          heading: 'Raw models start every request with amnesia',
          body: 'By itself, a raw model has no saved history, no file browser, and no live web access. It is **stateless**: each call starts blank. When a chat app seems to remember message #1 during message #6, the app is quietly bundling and resending messages #1 through #6 together.',
          callout: {
            type: 'warning',
            title: 'Why mega-long chats lose track',
            body: 'Because every turn resends earlier history into a fixed memory limit, endless rambling threads eventually crowd out early instructions and make replies slower and less focused.'
          }
        },
        {
          heading: 'What the chat wrapper quietly adds',
          body: 'Consumer chat apps layer four big features around the raw model: **saved history**, a hidden **system prompt** (date, style, safety rules), **built-in tools** (web search, file readers, calculators), and a polished interface for streaming replies.',
          callout: {
            type: 'example',
            title: 'Same model, two different answers',
            body: 'Ask a bare API model for today’s train delays and it declines. Ask the exact same model inside a chat app with web search turned on, and the wrapper fetches live results first.'
          }
        },
        {
          heading: 'One seam explains the entire AI ecosystem',
          body: 'Once you separate the **raw model** from the **wrapper**, every AI product clicks into place. Voice assistants, research apps, and coding agents simply wrap the same raw models with different instructions and tools—setting you up for tokens, APIs, and agents in Units 2–4.',
          callout: {
            type: 'tip',
            title: 'Check what tools are turned on',
            body: 'Before blaming a model for missing a live fact or file, check whether the app you are using actually has web search or file access enabled.'
          }
        }
      ],
      keyTakeaways: [
        'Raw LLMs are stateless: they accept input and return text with no built-in chat memory or live internet.',
        'Chat apps are wrappers that resend conversation history, inject hidden system instructions, and attach tools like web search.',
        'Seeing the split between model and wrapper explains how chatbots, search assistants, and coding agents all work.'
      ],
      glossaryTermIds: ['chat-wrapper', 'llm', 'system-prompt', 'ai-harness'],
      relatedLabId: null,
      quiz: [
        {
          id: 'q-1-4-1',
          type: 'multiple_choice',
          question: 'When you ask a follow-up question on turn #6 of a mobile AI chat, how does the AI know what you asked on turn #1?',
          options: [
            'The raw model permanently memorizes each user’s account history inside its frozen weights.',
            'Your phone operating system caches the model’s internal weights between every message.',
            'The chat app stores the thread and resends the earlier turns along with your new message.',
            'The AI runs a live web search on your profile name to reconstruct the earlier messages.'
          ],
          correctIndex: 2,
          explanation:
            'Raw models are stateless. The wrapper app saves your conversation and sends the prior turns back to the model with every new message.'
        },
        {
          id: 'q-1-4-2',
          type: 'true_false',
          question:
            'Two apps can call the exact same underlying AI model yet give different capabilities if one app attaches web search and file tools while the other does not.',
          options: ['True', 'False'],
          correctIndex: 0,
          explanation:
            'True. Capabilities like live search, document reading, and saved memory come from the wrapper around the model, not from the bare weights alone.'
        },
        {
          id: 'q-1-4-3',
          type: 'spot_mistake',
          question:
            'Priya tests a bare model via API and gets "I cannot check live cricket scores," even though the same provider’s mobile app answered right away. She assumes the API runs an older, weaker model. What did she miss?',
          options: [
            'Mobile apps always run a private model withheld from API developers.',
            'The mobile app wraps the model with a live web-search tool that a bare API call lacks.',
            'Sports scores stay blocked on API accounts until you buy a subscription.',
            'Bare API calls can only return code snippets, never everyday facts.'
          ],
          correctIndex: 1,
          explanation:
            'It can be the exact same model underneath—the consumer app automatically attaches a web-search tool, whereas a bare API call only uses tools you explicitly connect.'
        }
      ]
    }
  ],
  masteryCheck: {
    id: 'mc-1-what-is-ai',
    title: 'Unit 1 Mastery Check',
    subtitle: 'Four quick real-world scenarios to prove you can tell models, apps, and tools apart.',
    passThreshold: 0.75,
    xpReward: 40,
    estimatedMinutes: 2,
    questions: [
      {
        id: 'mc-1-q1',
        type: 'multiple_choice',
        question: 'You have 450 invoice lines to total for a client tax report and a tense client email to soften. What is the smartest split between regular software and AI?',
        options: [
          'Use AI for both tasks so the invoice math matches the tone of the apology email.',
          'Let a spreadsheet sum the invoices and use AI to draft the email.',
          'Write custom spreadsheet macros to draft the apology email and let AI add the numbers.',
          'Ask a flagship reasoning model to sum all 450 rows twice and average its two replies.'
        ],
        correctIndex: 1,
        explanation:
          'Deterministic spreadsheets guarantee 100% accurate arithmetic, while LLMs shine on messy human tone and phrasing.'
      },
      {
        id: 'mc-1-q2',
        type: 'spot_mistake',
        question: 'An offline AI model gives a confident, well-formatted paragraph quoting a 2026 court ruling you never heard of. A teammate says: "It wrote an exact case number and date, so it must be real." What is the mistake?',
        options: [
          'Next-token prediction can fabricate fluent citations without real verification.',
          'Offline models only cite real cases if you prompt in lowercase.',
          'Post-training removes all legal knowledge unless a paid cloud subscription stays active.',
          'Case numbers are reliable when the model answers quickly.'
        ],
        correctIndex: 0,
        explanation:
          'LLMs generate plausible-looking continuations token by token. Fluent formatting and exact numbers never prove a fact—verify ungrounded claims against real sources.'
      },
      {
        id: 'mc-1-q3',
        type: 'multiple_choice',
        question: 'A clinic wants to summarize private patient intake notes completely offline without sending text to any external cloud vendor. Which option fits best?',
        options: [
          'Switching a hosted chat app to dark mode with search off.',
          'Using the largest hosted cloud flagship model because expensive tiers never log prompts.',
          'Running a compact open-weights model locally on hardware the clinic controls.',
          'Asking a web chatbot to promise at the top of the prompt that it will delete the weights.'
        ],
        correctIndex: 2,
        explanation:
          'Open-weights models publish their trained weights so organizations and individuals can host or run them privately on their own hardware with zero cloud transmission.'
      },
      {
        id: 'mc-1-q4',
        type: 'spot_mistake',
        question: 'After 40 turns in one mobile chat, an AI forgets a rule you gave in message #1. Your friend blames the AI for "losing its training." What actually explains it?',
        options: [
          'Consumer apps erase the model’s training weights once a chat passes thirty messages.',
          'Your phone automatically switches from an LLM to regular software after half an hour.',
          'The model permanently forgets message #1 unless you upgrade to an open-weights tier.',
          'Raw models are stateless, and the chat wrapper’s resending history crowded out early context.'
        ],
        correctIndex: 3,
        explanation:
          'The model’s weights never changed during inference—the wrapper app resends prior turns on each message, and long threads eventually crowd out or dilute early rules.'
      }
    ]
  }
};
