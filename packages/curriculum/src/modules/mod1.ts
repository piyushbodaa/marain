import type { CurriculumModule } from '../schema.ts';

export const MODULE_1: CurriculumModule = {
  id: 'mod-1-what-is-ai',
  number: 1,
  title: 'What Even Is AI?',
  subtitle: 'Strip away the sci-fi hype and see how modern AI actually works in plain English.',
  icon: 'brain',
  accentHex: '#10B981',
  estimatedMinutes: 16,
  recommendedLabId: 'tokenizer',
  chapters: [
    {
      id: 'ch-1-1',
      moduleId: 'mod-1-what-is-ai',
      number: 1,
      title: 'AI vs. Regular Software: Rules vs. Patterns',
      readMinutes: 4,
      xpReward: 25,
      summary:
        'Traditional software follows exact instructions written by humans line by line. Modern AI learns fuzzy patterns from millions of examples so it can handle messy real-world tasks like language and images.',
      analogy: {
        title: 'The Calculator vs. The Seasoned Chef',
        body: 'A pocket calculator is regular software: press 2 + 2 and it follows rigid electrical rules to return 4 every single time. Modern AI is more like a seasoned chef who has tasted ten thousand dishes. You cannot write a simple math rule for "make this soup taste cozy," yet the chef recognizes patterns in ingredients and improvises a great bowl.'
      },
      sections: [
        {
          heading: 'How regular software thinks: strict recipes',
          body: 'Almost every app you used before 2022—spreadsheets, alarm clocks, banking portals, and calculators—was built using explicit rules. A human programmer sat down and wrote out every single scenario in advance: "If the user clicks Save, store the file. If the password is wrong, show a red warning."\n\nThis approach is unbeatable whenever the rules are crisp and unchanging. You want your bank balance to follow exact arithmetic, never a creative guess. The trouble starts when humans try to write fixed rules for messy, everyday tasks.',
          callout: {
            type: 'example',
            title: 'Try writing a rigid rule for a cat',
            body: 'How would you explain a cat to a computer using only rules? "Four legs, whiskers, pointy ears." Wait—what if the cat is curled up sleeping, hiding one leg, or viewed from behind? Humans spent decades trying to code those rules by hand and still got fooled by fuzzy pillows.'
          }
        },
        {
          heading: 'How AI flips the script: learning from examples',
          body: 'Instead of hand-writing a million brittle rules, AI researchers tried something radically different: show a computer millions of labeled examples and let math adjust internal dials until the computer spots the patterns itself.\n\nThose internal dials are called model weights (or parameters). During a huge upfront study phase called training, the system sees billions of sentences, photos, or lines of code, makes guesses, checks how wrong it was, and nudges those weights slightly closer to the right pattern. Once training finishes, the weights are frozen and ready to use—a phase called inference.',
          callout: {
            type: 'myth',
            title: 'Myth Buster: AI does not "understand" like a human brain',
            body: 'Even when an AI writes a heartfelt poem or explains taxes clearly, there is no conscious person inside the server having feelings or memories. It is applying extraordinarily rich statistical patterns learned during training.'
          }
        },
        {
          heading: 'When to use AI—and when regular software wins',
          body: 'Because AI works with probabilities rather than rigid formulas, it shines at drafting emails, summarizing messy notes, translating tone, writing starter code, and brainstorming ideas. At the same time, regular software still beats AI at exact arithmetic, accounting ledgers, and tasks that must behave identically 100% of the time.\n\nThe best modern tools combine both worlds: AI handles the messy human request, then hands exact math or file operations off to reliable traditional code.',
          callout: {
            type: 'tip',
            title: 'A simple rule of thumb',
            body: 'Need exact certainty (like calculating GST on 400 invoices)? Use regular software or a spreadsheet formula. Need judgment on messy text, structure, or creative starting points? Reach for AI.'
          }
        }
      ],
      keyTakeaways: [
        'Regular software obeys exact human-written rules; AI learns statistical patterns from vast sets of examples.',
        'Training is the expensive upfront study phase that tunes model weights; inference is the fast everyday act of answering your prompt.',
        'AI excels at messy, open-ended tasks like writing and coding, while regular software still wins at strict, repeatable calculations.'
      ],
      glossaryTermIds: ['ai', 'model-weights', 'training-vs-inference'],
      relatedLabId: null,
      quiz: [
        {
          id: 'q-1-1-1',
          type: 'multiple_choice',
          question: 'What is the main difference between regular software and modern AI?',
          options: [
            'Regular software runs only on phones, while AI runs only on supercomputers.',
            'Regular software follows exact human-written rules, while AI learns patterns from many examples.',
            'Regular software cannot use the internet, while AI always browses live websites.',
            'Regular software uses math, while AI does not use math at all.'
          ],
          correctIndex: 1,
          explanation:
            'Traditional programs execute explicit step-by-step rules coded by programmers. Modern AI learns flexible patterns from massive collections of examples by tuning mathematical weights.'
        },
        {
          id: 'q-1-1-2',
          type: 'true_false',
          question:
            'Every time you send a message to ChatGPT or Claude, the AI is permanently retraining its model weights on your chat in real time.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! Answering your everyday prompts is called inference—the model weights stay frozen while it generates a reply. Training is a separate, massively expensive process done beforehand.'
        },
        {
          id: 'q-1-1-3',
          type: 'spot_mistake',
          question:
            'A friend says: "I need to sum 5,000 exact accounting rows for a tax filing, so I should paste them into an AI chat instead of Excel because AI is smarter." What is the mistake here?',
          options: [
            'AI chats are probabilistic pattern-matchers and can slip on exact arithmetic, whereas a spreadsheet uses rigid rules that are 100% accurate.',
            'Excel cannot open more than 1,000 rows.',
            'AI cannot read numbers at all.',
            'Spreadsheets require an API key to add numbers.'
          ],
          correctIndex: 0,
          explanation:
            'Use the right tool for the job! Exact, repeatable arithmetic is where classic software like spreadsheets shines with 100% reliability—save AI for summarizing, categorizing, or writing the formula for you.'
        }
      ]
    },
    {
      id: 'ch-1-2',
      moduleId: 'mod-1-what-is-ai',
      number: 2,
      title: 'What Is an LLM? The World’s Best Pattern-Completer',
      readMinutes: 4,
      xpReward: 25,
      summary:
        'A Large Language Model (LLM) generates entire essays, recipes, and programs by doing one deceptively simple job over and over: predicting the single most helpful next piece of text.',
      analogy: {
        title: 'Supercharged Autocomplete That Read the Whole Library',
        body: 'You already know autocomplete on your phone keyboard: type "See you at" and it suggests "home" or "work." Now imagine an autocomplete engine that read virtually every public book, textbook, conversation, and code manual on Earth. To accurately guess the next word in a mystery novel or a Python file, it quietly had to learn grammar, logic, history, and coding patterns.'
      },
      sections: [
        {
          heading: 'Breaking down the three scary words: L-L-M',
          body: 'Tech news loves acronyms, so let us unpack LLM in ten seconds. "Large" means the model has billions of tuned numbers (weights) and studied an enormous library of text. "Language" means it works primarily with human words and programming languages—though modern versions are also multimodal, meaning they can see images and read PDFs too.\n\n"Model" simply means a mathematical representation of patterns. Put together, a Large Language Model is a giant pattern-matcher built specifically to read and generate language.',
          callout: {
            type: 'tip',
            title: 'Why "next-word prediction" turns into real usefulness',
            body: 'At first glance, guessing the next word sounds too simple to explain coding or advice. Think about this: to correctly predict the next word after "If a shirt costs $40 with 25% off, the final price is $", the model has to absorb the underlying pattern of percentages!'
          }
        },
        {
          heading: 'One piece at a time—not a pre-written script',
          body: 'When you ask an LLM a question, it does not search a giant filing cabinet of pre-written answers. Instead, it writes fresh from scratch, one small chunk (a token) at a time. That is why you literally watch words stream across the screen.\n\nAfter picking the first token, it feeds that token back in, looks at the whole conversation plus its new word, and predicts the next token—repeating hundreds of times per second until it predicts a special "stop, I am finished" signal.',
          callout: {
            type: 'example',
            title: 'Watching the probability wheel spin',
            body: 'If you type "The sun rises in the", the model assigns roughly 99% probability to "east" and tiny fractions to "morning" or "sky". If you type "Write a funny name for a dog:", dozens of options have reasonable probabilities—which is why asking twice gives two creative answers.'
          }
        },
        {
          heading: 'How raw predictors become polite assistants',
          body: 'A freshly trained base LLM only knows how to continue internet text—if you ask it "How do I boil an egg?", a raw base model might continue with "How do I fry bacon? How do I make toast?" because that looks like a FAQ list.\n\nTo turn it into a helpful assistant, AI labs run a second finishing step (post-training) using human feedback and step-by-step reasoning examples. That teaches the model to answer questions directly, admit uncertainty when appropriate, and follow safety guidelines.',
          callout: {
            type: 'myth',
            title: 'Myth Buster: LLMs do not copy-paste web pages from a live database',
            body: 'Unless a chat app explicitly gives the AI a web-search tool, an LLM is generating text purely from compressed patterns stored in its frozen weights—not secretly Googling your question in the background.'
          }
        }
      ],
      keyTakeaways: [
        'LLM stands for Large Language Model—a giant neural network trained on vast text and code to predict the next piece of text.',
        'LLMs write answers freshly one chunk at a time rather than pulling pre-written replies from a database.',
        'Modern LLMs are often multimodal, meaning they can understand screenshots, photos, and PDFs alongside plain text.'
      ],
      glossaryTermIds: ['llm', 'next-token-prediction', 'multimodal'],
      relatedLabId: 'tokenizer',
      quiz: [
        {
          id: 'q-1-2-1',
          type: 'multiple_choice',
          question: 'How does an LLM produce a full three-paragraph answer to your question?',
          options: [
            'It copies the top result from a search engine and changes a few words.',
            'It asks five humans in a call center to draft a reply.',
            'It selects one pre-written template stored by human engineers.',
            'It predicts the most likely next chunk of text (token) one step at a time until finished.'
          ],
          correctIndex: 3,
          explanation:
            'Every LLM generates replies sequentially through next-token prediction—picking one token, adding it to the text so far, and predicting the next until the response is complete.'
        },
        {
          id: 'q-1-2-2',
          type: 'true_false',
          question:
            'Modern multimodal LLMs can accept screenshots or photos in addition to typed text.',
          options: ['True', 'False'],
          correctIndex: 0,
          explanation:
            'True! Multimodal models convert images, PDFs, or audio into internal signals alongside text so you can paste a screenshot of an error or design right into the prompt.'
        },
        {
          id: 'q-1-2-3',
          type: 'spot_mistake',
          question:
            'Someone says: "I asked an LLM about this morning’s stock price and it got it right, so every LLM clearly has built-in live internet access." Spot the mistake.',
          options: [
            'LLMs cannot read numbers like stock prices.',
            'Stock prices never change during the morning.',
            'A base LLM only knows what was in its frozen training data; live web lookup only happens if the surrounding app gives it a search tool.',
            'Only open-weights models can see stock prices.'
          ],
          correctIndex: 2,
          explanation:
            'Raw LLMs have frozen knowledge from training. When an AI knows today’s news or prices, that is because the chat app attached a web-search tool around the model!'
        }
      ]
    },
    {
      id: 'ch-1-3',
      moduleId: 'mod-1-what-is-ai',
      number: 3,
      title: 'Meet the AI Families: Claude, Gemini, GPT & Open-Weights',
      readMinutes: 4,
      xpReward: 25,
      summary:
        'Just like car brands offer compact sedans and heavy-duty trucks, AI labs release model families with fast budget options, flagship thinkers, and open-weights models you can run privately.',
      analogy: {
        title: 'Airlines and Aircraft Tiers',
        body: 'Calling all AI "ChatGPT" is like calling every smartphone an "iPhone." Today there are several major AI builders—Anthropic (Claude), Google (Gemini), OpenAI (GPT), plus open-weights builders like Meta (Llama) and DeepSeek. Each family offers smaller zippy models for quick errands and flagship models for complex work.'
      },
      sections: [
        {
          heading: 'The major closed (hosted) model families',
          body: 'Three major labs lead hosted cloud AI—meaning the models live on the company’s giant servers and you talk to them via a chat app or API:\n\n• **Claude (by Anthropic)**: Beloved for crisp, natural writing, careful instruction-following, and standout coding tools like Claude Code.\n• **Gemini (by Google)**: Known for huge context windows (reading massive documents or videos at once), strong multimodal skills, and fast, low-cost Flash models.\n• **GPT (by OpenAI)**: The family that kicked off the ChatGPT wave, offering versatile general assistants and deep reasoning models.',
          callout: {
            type: 'tip',
            title: 'Notice the three sizes inside almost every family',
            body: 'Most labs ship a "Small/Fast" tier (cheap, instant replies for simple tasks), a "Balanced/Workhorse" tier (best everyday quality-to-price), and a "Flagship/Reasoning" tier (slower and pricier, built for thorny planning or tricky bugs).'
          }
        },
        {
          heading: 'Open-weights models: Llama, DeepSeek, Qwen & Mistral',
          body: 'Not all powerful AI is locked behind one company’s servers. Open-weights models publish their finished weight files publicly. Anyone—researchers, startups, or curious beginners—can inspect how they behave, rent cheap servers to host them, or even run smaller versions right on a personal laptop with zero internet connection.\n\nMeta’s **Llama**, **DeepSeek**, **Qwen**, and **Mistral** have narrowed the gap with proprietary giants dramatically, driving AI costs down for everyone.',
          callout: {
            type: 'example',
            title: 'Why a normal person cares about open-weights',
            body: 'Imagine summarizing private medical receipts or personal journal entries on an airplane with Wi-Fi turned off. An open-weights model running locally on your computer keeps 100% of that text on your own machine—and costs $0 per message.'
          }
        },
        {
          heading: 'How to pick a model without overthinking it',
          body: 'Beginners often get paralyzed by version numbers and benchmark charts. You do not need to memorize scores! In practice, the difference between good models matters far less than giving clear instructions.\n\nStart with one fast, generous workhorse model for everyday questions, reach for a stronger coding/reasoning tier when designing an app or untangling a stubborn bug, and explore local open-weights models whenever you want free offline practice.',
          callout: {
            type: 'myth',
            title: 'Myth Buster: Bigger and more expensive is not always better',
            body: 'Using the most expensive flagship model to format a grocery list is like renting a cargo plane to pick up milk. Smaller models like Gemini Flash or GPT mini respond in a split second at a tiny fraction of the cost.'
          }
        }
      ],
      keyTakeaways: [
        'Major AI model families include Claude (Anthropic), Gemini (Google), GPT (OpenAI), and open-weights models like Llama and DeepSeek.',
        'Most families come in speed/cost tiers: fast & cheap models for quick jobs, balanced models for daily work, and flagship models for hard reasoning.',
        'Open-weights models publish their trained weight files publicly so you can host them cheaply or run them privately on your own computer.'
      ],
      glossaryTermIds: ['llm', 'open-weights', 'model-weights', 'local-model'],
      relatedLabId: null,
      quiz: [
        {
          id: 'q-1-3-1',
          type: 'multiple_choice',
          question: 'What makes an "open-weights" model like Llama or DeepSeek different from a closed cloud-only model?',
          options: [
            'Open-weights models can only write short one-sentence answers.',
            'Their trained weight files are published publicly so people can host or run them on their own hardware.',
            'They never use tokens.',
            'They require a $200/month subscription to download.'
          ],
          correctIndex: 1,
          explanation:
            'Open-weights means the trained parameter files are shared publicly. That lets individuals and businesses run them privately on local machines or third-party servers.'
        },
        {
          id: 'q-1-3-2',
          type: 'true_false',
          question:
            'You should always pick the largest, most expensive flagship AI model for every simple task like fixing spelling in an email.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! Fast, smaller tiers handle everyday proofreading, summarizing, and quick formatting in a split second for a tiny fraction of the cost.'
        },
        {
          id: 'q-1-3-3',
          type: 'spot_mistake',
          question:
            'A coworker says: "ChatGPT, Claude, and Gemini are all just different websites connected to the exact same single AI brain." What is wrong with that claim?',
          options: [
            'They are separate model families built and trained independently by different companies (OpenAI, Anthropic, Google) with different strengths.',
            'Claude is not available on websites.',
            'Gemini only works on Android phones.',
            'OpenAI owns Anthropic and Google.'
          ],
          correctIndex: 0,
          explanation:
            'GPT (OpenAI), Claude (Anthropic), and Gemini (Google) are distinct model families trained separately by different teams—each with its own writing style, context limits, and pricing.'
        }
      ]
    },
    {
      id: 'ch-1-4',
      moduleId: 'mod-1-what-is-ai',
      number: 4,
      title: 'Chat Apps vs. Raw Models: What’s Really Under the Hood',
      readMinutes: 4,
      xpReward: 25,
      summary:
        'When you open ChatGPT, Claude.ai, or Gemini in a browser, you are not talking straight to a bare model—you are using a polished app packed with memory, hidden instructions, and extra tools.',
      analogy: {
        title: 'The Car Engine vs. The Full Dealership Car',
        body: 'A raw AI model is like a V6 engine sitting on a wooden crate. By itself it has huge power, yet you cannot drive it to the grocery store. A chat app like Claude.ai or ChatGPT bolts on the seats, dashboard, GPS, fuel gauge, and cupholders so any driver can hop in and go.'
      },
      sections: [
        {
          heading: 'What a raw AI model actually does by itself',
          body: 'Strip away the colorful website and a raw model is shockingly minimalist. You send it a chunk of text (and maybe an image), and it sends back a chunk of text. That is it!\n\nA raw model has no saved sidebar of past chats, no "Upload PDF" button, no built-in internet search, no memory of who you were yesterday, and no way to edit files on your computer. Every single request starts with a completely blank slate unless software sends the prior messages back in.',
          callout: {
            type: 'warning',
            title: 'Why raw models feel like they have amnesia',
            body: 'Raw models are stateless—they do not remember your previous message on their own! Every time you send message #5 in a chat app, the app quietly re-sends messages #1, #2, #3, #4, AND #5 together behind the scenes.'
          }
        },
        {
          heading: 'All the invisible extras a chat app adds for you',
          body: 'When you type into ChatGPT, Claude.ai, or Gemini, the chat wrapper quietly performs half a dozen helpful tricks before and after calling the model:\n\n• **Chat history & memory**: Saves past conversations in a sidebar and re-sends recent turns automatically.\n• **Hidden system instructions**: Tells the model today’s date, how to format tables cleanly, and when to stay safe.\n• **Built-in tools**: Decides when to search the web, run Python code for math, read uploaded PDFs, or render a live webpage preview.\n• **Friendly interface**: Streams words smoothly, highlights code blocks, and offers one-click copy buttons.',
          callout: {
            type: 'example',
            title: 'Same model, wildly different experience',
            body: 'If you ask a raw model via API "What is the weather in Mumbai right now?", it says it cannot check live weather. Ask the exact same model inside a chat app with web search enabled, and it silently searches Google and hands you the forecast in two seconds.'
          }
        },
        {
          heading: 'Why knowing this distinction unlocks superpowers',
          body: 'Once you see the seam between the **raw model** and the **app wrapped around it**, the entire AI ecosystem stops looking mysterious. Coding tools like Claude Code, browser assistants, and apps you build yourself are all simply new wrappers plugging into the exact same raw models—just wired to different tools like your project folder or a spreadsheet.\n\nIn the upcoming modules, you will learn how text turns into tokens, how API credits pay for raw model calls, and how developer tools called harnesses give models hands to build real software.',
          callout: {
            type: 'tip',
            title: 'Preview of Module 4',
            body: 'When a wrapper is specifically engineered to give an AI file access, terminal commands, and multi-step loops, builders call it an AI Harness. You will explore that hands-on in Module 4!'
          }
        }
      ],
      keyTakeaways: [
        'A raw AI model only takes text/media in and returns text out—it has no built-in chat history, web browser, or file access.',
        'Chat apps like ChatGPT, Claude.ai, and Gemini are wrappers that add history, hidden instructions, file uploads, and web search around a raw model.',
        'Understanding the split between raw models and wrapper apps explains how coding tools, agents, and custom AI apps work.'
      ],
      glossaryTermIds: ['chat-wrapper', 'llm', 'system-prompt', 'ai-harness'],
      relatedLabId: 'tokenizer',
      quiz: [
        {
          id: 'q-1-4-1',
          type: 'multiple_choice',
          question: 'Why does a chat app appear to remember message #1 when you send message #5?',
          options: [
            'The raw model permanently memorizes every user’s face and name.',
            'Models can only have five-message conversations.',
            'Your Wi-Fi router stores the AI’s memory.',
            'The chat app quietly bundles and re-sends earlier messages from the conversation along with message #5.'
          ],
          correctIndex: 3,
          explanation:
            'Raw models are stateless! The chat app saves your history and quietly sends the earlier messages back to the model each time you hit Send.'
        },
        {
          id: 'q-1-4-2',
          type: 'true_false',
          question:
            'A raw AI model by itself already includes a chat sidebar, PDF upload button, and live web search without any wrapper app.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! A raw model simply takes input and generates output. Sidebars, PDF readers, and live web search are all features added by the chat app or harness built around the model.'
        },
        {
          id: 'q-1-4-3',
          type: 'spot_mistake',
          question:
            'Priya asks a raw API model to check today’s cricket score and gets "I do not have access to real-time data." She concludes: "The API uses a dumber model than the website!" Spot her mistake.',
          options: [
            'The API cannot answer sports questions.',
            'APIs only run on Sundays.',
            'It can be the exact same model—the website simply wrapped it with a live web-search tool that the raw API call did not attach.',
            'Websites never use LLMs.'
          ],
          correctIndex: 2,
          explanation:
            'Same brain, different accessories! The consumer chat site adds web search and other tools automatically, while a plain API call talks directly to the bare model unless you attach tools.'
        }
      ]
    }
  ]
};
