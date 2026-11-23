import type { CurriculumModule } from '../schema.ts';

export const MODULE_2: CurriculumModule = {
  id: 'mod-2-tokens-prompts',
  number: 2,
  title: 'Tokens, Context & Talking to AI',
  subtitle: 'Learn how AI slices your text, why it forgets long chats, and how to prompt cleanly.',
  icon: 'layers',
  accentHex: '#3B82F6',
  estimatedMinutes: 16,
  recommendedLabId: 'tokenizer',
  chapters: [
    {
      id: 'ch-2-1',
      moduleId: 'mod-2-tokens-prompts',
      number: 1,
      title: 'What Are Tokens? Why AI Reads Chunks, Not Letters',
      readMinutes: 4,
      xpReward: 25,
      summary:
        'AI does not read English letter by letter or even strictly word by word. Before a model sees your message, a tokenizer chops it into bite-sized numbered pieces called tokens.',
      analogy: {
        title: 'Lego Bricks of Language',
        body: 'Imagine building sentences out of Lego bricks instead of individual letters. Common everyday words like "house" or "coffee" come as a single pre-molded brick. Less common words like "unbelievable" snap together from three smaller bricks: "un" + "believ" + "able". Every AI model reads, counts, and charges by the brick.'
      },
      sections: [
        {
          heading: 'Why AI uses tokens instead of letters or whole words',
          body: 'Computers only understand numbers, so every piece of text has to be turned into numbers before an AI can process it. If we numbered every single letter (a=1, b=2), sentences would turn into super long chains that are slow to read. If we numbered every possible word in every language plus typos and code names, the dictionary would explode to millions of entries.\n\nTokens are the sweet spot in the middle. A program called a tokenizer keeps a vocabulary of roughly 50,000 to 200,000 common word pieces. In everyday English, **1 token equals roughly ¾ of a word**—so 100 tokens is about 75 words, and a 300-word email is around 400 tokens.',
          callout: {
            type: 'example',
            title: 'Why AI sometimes miscounts the "r"s in "strawberry"',
            body: 'Because the tokenizer hands the model chunks like ["str", "aw", "berry"] represented as ID numbers—not individual spelled-out letters—counting letters inside a chunk feels like counting how many bricks are inside a sealed box without opening it!'
          }
        },
        {
          heading: 'Spaces, emojis, code, and other languages cost different tokens',
          body: 'Not all characters cost the same number of tokens. Punctuation, blank spaces, and leading spaces often attach right onto the start of a word token. Meanwhile, emojis, complex code symbols, and non-English scripts (like Hindi, Tamil, Arabic, or Japanese) frequently split into 2 to 4 tokens per word or symbol.\n\nThat means two messages that look the same length on screen can use very different token counts under the hood.',
          callout: {
            type: 'tip',
            title: 'Quick mental check: estimate tokens on your phone',
            body: 'Picture four inputs side by side: `"coffee"` is **1 token**, `"unbelievable"` splits into **3 tokens** (`un` + `believ` + `able`), a single emoji like `🚀` can take **2–3 tokens**, and a 75-word text message lands right around **100 tokens**.'
          }
        },
        {
          heading: 'Three everyday reasons tokens matter to you',
          body: 'You never need to count tokens manually, yet knowing they exist immediately clears up three common mysteries:\n\n1. **Speed**: Generating 1,000 tokens takes roughly twice as long as generating 500 tokens because the model creates one token at a time.\n2. **Memory limits**: Every AI has a maximum token budget per conversation (its context window).\n3. **Cost**: When you use pay-as-you-go API credits in Unit 3, providers bill per million tokens—not per message or per minute.',
          callout: {
            type: 'myth',
            title: 'Myth Buster: "One token = one word"',
            body: 'Close, but not exact! Short common words like "cat" are 1 token, long words like "extraordinary" are 2–3 tokens, and messy URLs or emojis can burn through tokens surprisingly fast.'
          }
        }
      ],
      keyTakeaways: [
        'A token is a chunk of text (roughly ¾ of an English word) that AI models read, generate, and measure.',
        'A tokenizer converts your text into numbered tokens going in and converts the model’s numbered tokens back into readable words coming out.',
        'Tokens explain why AI occasionally struggles with spelling puzzles, why longer replies take longer, and how AI pricing works.'
      ],
      glossaryTermIds: ['token', 'tokenizer', 'next-token-prediction'],
      relatedLabId: null,
      quiz: [
        {
          id: 'q-2-1-1',
          type: 'multiple_choice',
          question: 'Roughly how many everyday English words correspond to 100 tokens?',
          options: [
            'Roughly 25 English words',
            'Roughly 200 English words',
            'Roughly 75 English words',
            'Exactly 100 English words'
          ],
          correctIndex: 2,
          explanation:
            'In typical English text, 1 token is roughly ¾ of a word—so 100 tokens works out to around 75 words.'
        },
        {
          id: 'q-2-1-2',
          type: 'true_false',
          question:
            'An emoji or a word in a non-English language can sometimes use more than one token.',
          options: ['True', 'False'],
          correctIndex: 0,
          explanation:
            'True! Tokenizers optimize common English words into single tokens, while emojis, special symbols, and less-frequent scripts often split into 2–4 tokens.'
        },
        {
          id: 'q-2-1-3',
          type: 'spot_mistake',
          question:
            'Sam thinks: "My AI miscounted the letters in strawberry, which proves it is bad at all logic and coding." What is the real explanation?',
          options: [
            'Models ignore lowercase letters unless separated by hyphens.',
            'Tokenizers feed models numbered word-chunks rather than individual letters.',
            'Spelling puzzles need live search because dictionaries are excluded.',
            'Modern LLMs only process whole sentences at once and cannot inspect anything shorter than a word.'
          ],
          correctIndex: 1,
          explanation:
            'Letter-counting quirks come from how tokenizers chunk text into multi-letter pieces before the model even sees them—not from an inability to reason.'
        }
      ]
    },
    {
      id: 'ch-2-2',
      moduleId: 'mod-2-tokens-prompts',
      number: 2,
      title: 'The Context Window: AI’s Working Desk',
      readMinutes: 4,
      xpReward: 25,
      summary:
        'Every AI model has a fixed "working desk" called its context window. Understanding how that desk fills up explains why super long chats get sluggish, pricey, or forgetful—and how to keep them sharp.',
      analogy: {
        title: 'Papers on a Working Desk',
        body: 'Picture an analyst sitting at a desk of fixed size. Every instruction you give, every PDF you attach, every back-and-forth message, and every reply the AI writes is another sheet of paper spread across that desk. Once the desk is covered edge to edge, sliding a brand-new sheet onto the front pushes the oldest sheet off the back—out of sight and completely forgotten.'
      },
      sections: [
        {
          heading: 'What actually sits inside the context window?',
          body: 'Beginners often think the context window only counts the single message they just typed. In reality, it holds **everything** active in that conversation at once:\n\n• Hidden system instructions and tool descriptions\n• Files, screenshots, or code snippets you attached\n• Every previous message you sent in this thread\n• Every previous reply the AI generated\n• The new answer the AI is about to write right now',
          callout: {
            type: 'example',
            title: 'How big are modern context windows?',
            body: 'Early AI models had tiny 4,000-token desks (about 6 pages). Today’s models commonly offer 128,000 to 200,000 tokens (a thick 400-page book), and some Gemini models stretch up to 1,000,000+ tokens!'
          }
        },
        {
          heading: 'Why a cluttered desk still hurts quality',
          body: 'Even if your model boasts a massive 200,000-token desk, piling 80 unrelated topics onto one endless chat thread causes "context rot." Just like a human trying to focus at a messy desk buried in old receipts, the AI can get distracted by dead-end ideas or outdated drafts you abandoned twenty messages ago.\n\nEven worse, because the app re-sends the whole desk on every turn, a bloated chat gets slower and uses far more tokens on every single message.',
          callout: {
            type: 'tip',
            title: 'Start a fresh chat when switching topics',
            body: 'Finished planning your weekend trip and now want help writing a resume? Tap "New Chat"! A clean desk gives faster, smarter, and cheaper answers.'
          }
        },
        {
          heading: 'Keeping long projects crisp without losing your work',
          body: 'What if you are working on one big project—like planning an event or designing a site—and your chat gets really long? You have two pro moves:\n\n1. **Summarize and restart**: Ask the AI, "Summarize all our agreed decisions and current progress in 8 bullet points," copy that crisp summary, and paste it into a brand-new chat.\n2. **Use `/compact`**: Modern AI coding tools include a built-in `/compact` command that tidies up the desk for you automatically.',
          callout: {
            type: 'warning',
            title: 'Watch out for silent forgetting',
            body: 'When a conversation overflows the context window, the AI usually will not shout "I forgot message #1!" It quietly stops seeing the earliest messages—so if it suddenly ignores a rule you set an hour ago, your desk is probably full.'
          }
        }
      ],
      keyTakeaways: [
        'The context window is the maximum total tokens an AI can keep on its working desk at once (instructions + files + full chat history + new reply).',
        'Once the context window fills up, older messages get dropped or summarized, causing the AI to forget earlier details.',
        'Starting fresh chats for new topics—or summarizing progress into a clean thread—keeps AI sharper, faster, and cheaper.'
      ],
      glossaryTermIds: ['context-window', 'token', 'compact-command'],
      relatedLabId: null,
      quiz: [
        {
          id: 'q-2-2-1',
          type: 'multiple_choice',
          question: 'Which items count toward a model’s context window on turn 10 of a conversation?',
          options: [
            'System instructions, attached files, all prior turns, and the new reply.',
            'Only the newest message you typed plus any PDF or image uploaded on that turn.',
            'Only the AI’s previous answers, since user prompts are compressed out after turn one.',
            'Everything in your account’s entire chat sidebar across all past conversations.'
          ],
          correctIndex: 0,
          explanation:
            'Everything active in the current thread counts together: hidden instructions, attached files, all prior back-and-forth turns, and the reply currently being generated.'
        },
        {
          id: 'q-2-2-2',
          type: 'true_false',
          question:
            'Keeping one giant 300-message chat thread for every unrelated question all month is the best way to get sharp answers.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! Unrelated old messages clutter the context window, distract the model, slow responses down, and burn extra tokens. Open a fresh chat for new topics!'
        },
        {
          id: 'q-2-2-3',
          type: 'spot_mistake',
          question:
            'Maya uploaded 40 pages of notes and chatted for two hours. Suddenly the AI ignores a formatting rule she gave in message #1. She thinks it is deliberately ignoring her. What likely happened?',
          options: [
            'The model automatically resets its formatting rules every thirty minutes for privacy reasons.',
            'Uploading PDF notes switches the model into read-only mode where formatting instructions stop working.',
            'The provider quietly downgraded her chat mid-thread to a smaller model that cannot follow lists.',
            'The long thread diluted or pushed message #1 out of active context; a fresh thread with a brief summary restores focus.'
          ],
          correctIndex: 3,
          explanation:
            'Long threads dilute or push out early rules. Summarizing your key decisions into a clean new thread (or running `/compact` in CLI tools) restores laser focus.'
        }
      ]
    },
    {
      id: 'ch-2-3',
      moduleId: 'mod-2-tokens-prompts',
      number: 3,
      title: 'System Prompts, User Prompts & Temperature',
      readMinutes: 4,
      xpReward: 25,
      summary:
        'Great results come less from "secret magic prompts" and more from clear roles, concrete context, and knowing how the creativity dial (temperature) shapes replies.',
      analogy: {
        title: 'The Director’s Brief vs. The Scene Line',
        body: 'Imagine filming a movie. The System Prompt is the director’s overall brief handed to the actor before cameras roll ("You play a calm, empathetic family doctor who speaks in simple everyday words"). The User Prompt is the specific line the patient says in that scene ("My knee clicks when I climb stairs"). Temperature is how much improvisation the director allows.'
      },
      sections: [
        {
          heading: 'System prompt vs. User prompt: two layers of instruction',
          body: 'Almost every AI conversation has two distinct layers:\n\n• **System Prompt**: Top-level standing rules that set the AI’s persona, tone, format, and boundaries for the entire session. In apps you build (or tools like Claude Code), you write this once so the AI remembers your style automatically.\n• **User Prompt**: The specific request you type right now ("Draft a polite 3-sentence reply declining this meeting").\n\nSeparating standing rules from today’s task prevents you from repeating "keep it concise and jargon-free" twenty times a day.',
          callout: {
            type: 'example',
            title: 'Vague prompt vs. Clear 4-part prompt',
            body: 'Vague: "Write an email about our workshop."\nClear: "Write a warm 120-word invite email (Goal) for non-technical small-business owners (Audience) announcing our free Saturday AI Basics workshop at 10 AM (Context). End with one bold RSVP link placeholder and no cheesy exclamation marks (Constraints)."'
          }
        },
        {
          heading: 'The 4 ingredients of a rock-solid prompt',
          body: 'You do not need to buy "500 secret prompt templates." Nearly every strong prompt simply answers four human questions:\n\n1. **Goal**: What exact outcome do you want?\n2. **Context / Audience**: Who is this for, and what background facts matter?\n3. **Examples**: Show one sample of the tone or structure you love ("Match this style: ...").\n4. **Constraints**: Word limit, format (bullet list, table, JSON), and what to avoid.\n\nBonus trick: if you are unsure what details matter, finish your prompt with **"Ask me 3 quick clarifying questions before you start."**',
          callout: {
            type: 'tip',
            title: 'Show, do not just tell',
            body: 'Giving even ONE short example of what "good" looks like beats two paragraphs of abstract adjectives like "make it engaging, punchy, and modern."'
          }
        },
        {
          heading: 'Temperature: the predictability vs. creativity dial',
          body: 'Remember how an LLM assigns probabilities to every possible next token? **Temperature** is a numeric dial (commonly `0.0` to `1.0`) that decides whether the model sticks strictly to the top-ranked token or occasionally picks surprising runners-up.\n\n• **Low temperature (0.0–0.2)**: Calm, steady, repeatable. Ideal for extracting invoice numbers, translating accurately, or editing code.\n• **Medium temperature (0.4–0.7)**: Natural everyday conversation and clear explanations.\n• **High temperature (0.8–1.0+)**: Playful, unexpected, diverse—great for brainstorming brand names or story twists (though too high turns into gibberish!).',
          callout: {
            type: 'myth',
            title: 'Myth Buster: Lowering temperature to 0 eliminates hallucinations',
            body: 'Temperature 0 makes the AI pick its most predictable guess every time—which makes answers repeatable, NOT guaranteed true. If the model does not know a fact, its most predictable guess can still be confidently wrong!'
          }
        }
      ],
      keyTakeaways: [
        'System prompts set standing rules, role, and tone for a whole session; user prompts ask for today’s specific task.',
        'Clear prompts cover four simple pieces: Goal, Context/Audience, Examples, and Constraints—no magic phrases required.',
        'Temperature controls randomness: keep it low for precise, repeatable work and higher for creative brainstorming.'
      ],
      glossaryTermIds: ['prompt', 'system-prompt', 'temperature'],
      relatedLabId: null,
      quiz: [
        {
          id: 'q-2-3-1',
          type: 'multiple_choice',
          question: 'When should you prefer a LOW temperature setting (like 0.0–0.2)?',
          options: [
            'Brainstorming playful names for a new coffee roaster.',
            'Generating several contrasting short-story endings so every retry feels surprising and fresh.',
            'Extracting invoice dates or fixing a focused software bug.',
            'Forcing the model to write longer multi-page essays with richer descriptive adjectives.'
          ],
          correctIndex: 2,
          explanation:
            'Low temperature keeps the AI steady and focused on the highest-probability tokens, which is ideal for structured extraction, math steps, and reliable code edits.'
        },
        {
          id: 'q-2-3-2',
          type: 'true_false',
          question:
            'Setting temperature to 0 guarantees that an AI will never hallucinate or make factual mistakes.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! Temperature 0 only makes output more consistent and predictable. If the AI lacks real facts, it can still repeat a plausible-sounding wrong guess.'
        },
        {
          id: 'q-2-3-3',
          type: 'spot_mistake',
          question:
            'Alex wants a landing page headline for his neighborhood bakery and types only: "Give me marketing copy." Why will the result feel generic?',
          options: [
            'Short prompts automatically trigger a weaker small model.',
            'Missing audience, vibe, example, and length forces generic average phrasing.',
            'Marketing copy needs a system prompt to specify brand tone.',
            'Without setting temperature above 0.9, the model can only repeat standard dictionary definitions.'
          ],
          correctIndex: 1,
          explanation:
            'Vague inputs produce average generic outputs. Adding who the bakery serves, the vibe (cozy sourdough vs. luxury pastry), and a short length constraint transforms the result immediately.'
        }
      ]
    },
    {
      id: 'ch-2-4',
      moduleId: 'mod-2-tokens-prompts',
      number: 4,
      title: 'Hallucinations: Why AI Sounds Confident When It’s Wrong',
      readMinutes: 4,
      xpReward: 25,
      summary:
        'AI does not lie out of malice—it invents plausible-sounding falsehoods because predicting smooth text is its core job. Learn the simple verification habits that keep you completely safe.',
      analogy: {
        title: 'The Smooth Improv Actor',
        body: 'Think of an AI like a brilliantly eloquent improv actor on stage. If someone shouts "Tell us about the 1842 Treaty of Bluebell!", the actor refuses to freeze in silence—they smoothly invent an ambassador’s name, a cozy town, and a realistic clause that fits the rhythm of a history book. It sounds 100% confident even though none of it happened.'
      },
      sections: [
        {
          heading: 'Why hallucinations happen in the first place',
          body: 'Because an LLM generates words by asking "What token looks most likely to come next?", its training rewards fluent, helpful-sounding answers. When you ask about something rare, hyper-specific, or brand new—like an obscure book citation, a small local restaurant’s hours, or a software feature released yesterday—the model may not have exact facts stored in its weights.\n\nInstead of stopping cold, it fills the blank with whatever looks statistically right: a realistic author name, a plausible URL, or a convincing phone number. Researchers call this a **hallucination**.',
          callout: {
            type: 'warning',
            title: 'High-risk spots where AI hallucinates most',
            body: 'Always double-check: exact legal/medical claims, academic citations and page numbers, live prices or store hours, exact quotes, and obscure biographical dates.'
          }
        },
        {
          heading: 'Grounding: turning a closed-book guess into an open-book check',
          body: 'The single best antidote to hallucinations is **grounding**—putting the real source material right onto the AI’s desk instead of asking it to recall from memory.\n\nRather than asking "What is my company’s refund policy?", paste the public refund policy text into the prompt and ask: *"Using ONLY the policy pasted below, answer the customer’s question and quote the exact sentence. If the policy does not say, reply: Not covered in the document."* Giving the AI explicit permission to say "I do not know" cuts guesswork dramatically—just remember to **redact private personal IDs, passwords, API keys, or confidential secrets** before pasting documents into any cloud chat.',
          callout: {
            type: 'example',
            title: 'The "Quote the source" prompt pattern',
            body: 'Add this line whenever summarizing non-sensitive PDFs, public policies, or articles: "Only use facts explicitly stated in the text above. Cite the exact heading or line for every claim, and flag anything missing."'
          }
        },
        {
          heading: 'A 30-second verification checklist for everyday life',
          body: 'You do not need to be paranoid about AI—just treat it like a sharp, fast intern whose work you glance over before signing your name:\n\n1. **Check high-stakes facts at the source**: Click links, open the official site, or check the original document for numbers, dates, and medical/legal advice.\n2. **Verify code by running it**: Never assume code works because it looks neat—run it and test the buttons!\n3. **Ask AI to critique itself**: Prompting "List any assumptions you made or places where you might be uncertain" often catches shaky spots right away.',
          callout: {
            type: 'tip',
            title: 'Safe mental model',
            body: 'Trust AI for drafts, structure, explanations, and starting points. Verify AI for facts, numbers, links, and final decisions—and never paste passwords or API keys into prompts.'
          }
        }
      ],
      keyTakeaways: [
        'A hallucination is a fluent, confident-sounding invention produced because LLMs optimize for plausible text patterns.',
        'Grounding—pasting non-sensitive source documents or enabling live web search—turns risky memory guesses into verifiable open-book answers.',
        'Give AI explicit permission to say "I don’t know," redact private secrets before pasting, and verify high-stakes facts before relying on them.'
      ],
      glossaryTermIds: ['hallucination', 'grounding', 'prompt'],
      relatedLabId: 'tokenizer',
      quiz: [
        {
          id: 'q-2-4-1',
          type: 'multiple_choice',
          question: 'What is the most effective way to reduce hallucinations when asking AI about a specific clause in your apartment lease?',
          options: [
            'Paste the redacted lease text and ask it to quote the exact clause or say if missing.',
            'Add a system rule warning the model to never guess wrong.',
            'Lower temperature to 0.0 so it only outputs verified legal facts.',
            'Ask three times in separate chats and trust the majority answer.'
          ],
          correctIndex: 0,
          explanation:
            'Grounding places the real (redacted) document on the AI’s working desk so it quotes actual clauses instead of guessing generic lease terms from memory.'
        },
        {
          id: 'q-2-4-2',
          type: 'true_false',
          question:
            'If an AI writes a detailed citation with an author name, journal title, and publication year, that guarantees the paper actually exists.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! Citations are one of the most famous places LLMs hallucinate—they know exactly what a realistic citation looks like and can assemble convincing fake ones unless verified.'
        },
        {
          id: 'q-2-4-3',
          type: 'spot_mistake',
          question:
            'Jordan asks an AI (without web search): "What time does the new cafe on Oak Street close tonight?" and drives over based on its confident "9:00 PM" reply. What went wrong?',
          options: [
            'He should have raised temperature to 0.8 so the model checked wider local business listings.',
            'The model only stores store hours for major national chains unless you give it your zip code.',
            'His prompt lacked a system prompt specifying the local time zone for the closing hour.',
            'Ungrounded models guess plausible closing hours from patterns instead of checking live info.'
          ],
          correctIndex: 3,
          explanation:
            'Local live facts like business hours are classic hallucination territory when ungrounded. Always check live sources (or a search-grounded tool) for current real-world details.'
        }
      ]
    }
  ],
  masteryCheck: {
    id: 'mc-2-tokens-prompts',
    title: 'Unit 2 Mastery Check',
    subtitle: 'Apply tokens, context hygiene, temperature, and grounding to four realistic situations.',
    passThreshold: 0.75,
    xpReward: 40,
    estimatedMinutes: 2,
    questions: [
      {
        id: 'mc-2-q1',
        type: 'multiple_choice',
        question: 'You have been brainstorming a holiday trip for 60 messages and now need an AI to draft a formal job cover letter. What is the smartest move?',
        options: [
          'Stay in the same thread so the AI warms up faster from all the previous tokens.',
          'Raise temperature to 1.0 inside the travel thread so it ignores the trip details.',
          'Start a fresh chat so old travel messages do not clutter context.',
          'Paste "Forget everything above" three times in capital letters before your prompt.'
        ],
        correctIndex: 2,
        explanation:
          'Opening a fresh chat clears unrelated messages off the working desk, preventing context distraction, lower quality, and wasted tokens.'
      },
      {
        id: 'mc-2-q2',
        type: 'spot_mistake',
        question: 'A team sets `temperature = 0` on an ungrounded customer-support bot and tells management: "Now the AI cannot hallucinate wrong return policies." What is wrong with that claim?',
        options: [
          'Temperature 0 only makes outputs repeatable; ungrounded models can still guess wrong.',
          'Temperature 0 disables the tokenizer so replies shrink to one word.',
          'Customer-support bots require temperature 0.9 to read pasted policy documents accurately.',
          'Lowering temperature forces the chat wrapper to turn off live web search automatically.'
        ],
        correctIndex: 0,
        explanation:
          'Temperature controls randomness, not truth. Without grounding the model in the real return policy text, temperature 0 simply makes its guesses consistent.'
      },
      {
        id: 'mc-2-q3',
        type: 'multiple_choice',
        question: 'You want an AI to extract warranty exclusions from a 12-page appliance manual PDF without guessing. Which prompt strategy works best?',
        options: [
          'Ask from memory first, then attach the PDF only if uncertain.',
          'Attach the manual, ask it to answer strictly from that text, and cite exact headings.',
          'Tell it to invent plausible terms whenever a section is tricky.',
          'Ask for a creative story summarizing the manual at high temperature so nothing feels dry.'
        ],
        correctIndex: 1,
        explanation:
          'Grounding with the real document, constraining answers to the pasted text, requiring citations, and allowing "not stated" sharply reduces hallucinations.'
      },
      {
        id: 'mc-2-q4',
        type: 'multiple_choice',
        question: 'Two messages have the exact same character count on screen: one is plain English prose, and the other mixes emojis, URLs, and non-English script. Which statement is accurate?',
        options: [
          'Both messages always use identical tokens because characters map 1-to-1.',
          'Plain English costs more tokens because common words split per letter.',
          'Token count depends only on spaces, so emojis add zero tokens.',
          'The emoji, URL, and non-English message will usually consume noticeably more tokens.'
        ],
        correctIndex: 3,
        explanation:
          'Tokenizers pack common English words into single tokens, while emojis, dense URLs, and many non-English scripts frequently split into 2–4 tokens each.'
      }
    ]
  }
};
