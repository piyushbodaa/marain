import type { CurriculumModule } from '../schema.ts';

export const MODULE_6: CurriculumModule = {
  id: 'mod-6-build-website',
  number: 6,
  title: 'Build a Website with AI',
  subtitle: 'Go from blank idea to a polished, mobile-friendly website live on the internet—no prior coding required.',
  icon: 'globe',
  accentHex: '#06B6D4',
  estimatedMinutes: 17,
  recommendedLabId: 'website-builder',
  chapters: [
    {
      id: 'ch-6-1',
      moduleId: 'mod-6-build-website',
      number: 1,
      title: 'How Websites Work: HTML, CSS & JavaScript in 3 Minutes',
      readMinutes: 4,
      xpReward: 35,
      summary:
        'You do not need to memorize web code to build great websites with AI—you just need a 3-minute mental map of the three files inside every site so you know what to ask for.',
      analogy: {
        title: 'Building a Cozy Cafe Storefront',
        body: 'Every website on Earth is built from the exact same three ingredients as a physical cafe. **HTML** is the wooden frame, walls, tables, and menu board (Structure). **CSS** is the warm paint, cozy lighting, fonts, and neat spacing (Style). **JavaScript** is the espresso machine, door chime, and cash register that actually respond when someone taps a button (Interactivity).'
      },
      sections: [
        {
          heading: 'Meet the three friendly files inside a website folder',
          body: 'Open almost any beginner website folder and you will see just three plain-text files working together as a team:\n\n• **`index.html` (HTML = Structure)**: Lists what exists on the page—headings, paragraphs, photos, links, and buttons. Every browser looks for `index.html` as the front door!\n• **`styles.css` (CSS = Look & Feel)**: Controls colors, fonts, rounded corners, dark mode, and how columns stack neatly on phones.\n• **`script.js` (JavaScript = Actions)**: Makes things happen when visitors interact—opening a mobile menu, toggling pricing monthly/yearly, or validating a contact form.',
          callout: {
            type: 'tip',
            title: 'You do not need complex frameworks to launch a gorgeous site!',
            body: 'Developers love debating React, Next.js, and Astro, yet plain HTML + CSS + JavaScript opens instantly on every computer with a double-click, never breaks from package updates, and takes seconds to publish for free.'
          }
        },
        {
          heading: 'Why knowing this 3-file map makes your AI prompts dramatically better',
          body: 'Once you know which file owns which job, talking to AI feels effortless:\n\n• Want to change wording or add a Testimonials section? That is **HTML**.\n• Want bigger headlines, a softer cream background, or cleaner phone spacing? That is **CSS**.\n• Want a FAQ accordion to expand smoothly when clicked? That is **JavaScript**.\n\nInstead of vaguely waving at the screen, you can guide AI right to the exact layer you want adjusted.',
          callout: {
            type: 'example',
            title: 'A crystal-clear micro-edit request',
            body: '"In `styles.css`, increase the padding on all buttons so they feel easier to tap on mobile phones, and switch the accent color to teal `#06B6D4`. Keep the HTML text unchanged."'
          }
        },
        {
          heading: 'Previewing your site locally takes literally one click',
          body: 'Here is a delightful secret many beginners do not realize: you do NOT need to buy a domain or upload anything just to test your website! Because your web browser (Chrome, Firefox, Safari, Edge) speaks HTML, CSS, and JavaScript natively, double-clicking `index.html` on your computer opens your real live site right in a browser tab—for free, offline, and instantly.',
          callout: {
            type: 'myth',
            title: 'Myth Buster: "You must pay $200/year for website builders to own a real site"',
            body: 'Owning plain `index.html`, `styles.css`, and `script.js` files means YOU own your site 100% forever—no platform lock-in, no watermarks, and free hosting options everywhere!'
          }
        }
      ],
      keyTakeaways: [
        'Every website combines three simple roles: HTML (structure/content), CSS (colors/fonts/layout), and JavaScript (interactive behavior).',
        '`index.html` is the front door of a website folder—you can preview it right on your computer in any web browser.',
        'Plain HTML, CSS, and JavaScript are fast, zero-maintenance, and ideal for your first AI-built sites.'
      ],
      glossaryTermIds: ['html', 'css', 'javascript'],
      relatedLabId: 'website-builder',
      quiz: [
        {
          id: 'q-6-1-1',
          type: 'multiple_choice',
          question: 'You love the words and layout of your site, and now you want to change the font, button colors, and spacing. Which layer controls how the website looks?',
          options: [
            'HTML',
            'Git',
            'CSS',
            'The `.env` file'
          ],
          correctIndex: 2,
          explanation:
            'CSS (Cascading Style Sheets) controls all visual styling—colors, typography, borders, spacing, dark mode, and responsive layout.'
        },
        {
          id: 'q-6-1-2',
          type: 'true_false',
          question:
            'You must buy a paid web domain before you can preview your `index.html` website in a browser on your own computer.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! Any web browser can open your local `index.html` file directly on your computer for free while you build and iterate.'
        },
        {
          id: 'q-6-1-3',
          type: 'spot_mistake',
          question:
            'A friend wants a clickable FAQ section that opens and closes smoothly when tapped, and asks AI to build it "using only plain text with zero CSS or JavaScript." Why will the smooth interactive behavior fall short?',
          options: [
            'Browsers cannot display questions.',
            'CSS provides the clean visual layout and animations, and JavaScript (or interactive HTML/CSS patterns) brings clicks and dynamic behaviors to life.',
            'HTML files cannot be saved on laptops.',
            'FAQs require a $20/month subscription.'
          ],
          correctIndex: 1,
          explanation:
            'HTML gives the skeleton, CSS makes it welcoming and readable, and JavaScript adds interactive click logic—each layer plays a distinct, complementary role.'
        }
      ]
    },
    {
      id: 'ch-6-2',
      moduleId: 'mod-6-build-website',
      number: 2,
      title: 'Writing a Clear Mini-Spec Instead of Vague Prompts',
      readMinutes: 4,
      xpReward: 35,
      summary:
        'Why do some AI-generated websites look generic and purple-neon while others look custom-crafted by a boutique studio? The entire difference happens in the 2-minute Mini-Spec you write first.',
      analogy: {
        title: 'Sketching a Napkin Floor Plan Before Hiring the Builder',
        body: 'If you tell a builder "Build me a cool house," you will get whatever default cookie-cutter box they built last week. Spend two minutes sketching a napkin plan—"A sunny one-story cottage for two writers, big kitchen table, warm oak wood, huge windows facing the garden"—and suddenly the builder creates YOUR dream place on the first try.'
      },
      sections: [
        {
          heading: 'Why "Build me a website for my cafe" fails',
          body: 'When you hand an AI a six-word prompt, it has to guess fifty unspoken design decisions: Who visits? Are you selling luxury wedding cakes or $3 filter coffee? Do you want dark futuristic neon or warm cream editorial? What buttons should appear?\n\nForced to guess everything, the model plays it safe and generates bland placeholder stock text ("Lorem ipsum", "Revolutionizing Synergy") with generic layouts.',
          callout: {
            type: 'example',
            title: 'The 5-Part Mini-Spec Blueprint (copy this for any site!)',
            body: '1. **Who & What**: "Bean & Book — a cozy neighborhood coffee & used-book shop in Pune."\n2. **Primary Goal**: "Help locals see today’s menu, opening hours, and directions."\n3. **Visual Vibe**: "Warm cream background, dark espresso text, sage green accents, editorial serif headings—calm and welcoming, never flashy neon."\n4. **Exact Sections**: "Hero banner with hours, 4-item Signature Drinks grid, About Our Story card, Visit Us map/hours footer."\n5. **Technical Rules**: "Plain responsive HTML/CSS/JS, works great on mobile phones, zero placeholder Lorem Ipsum text."'
          }
        },
        {
          heading: 'Real copy beats "Lorem Ipsum" every single time',
          body: 'Notice rule #5 above: give the AI a couple of real details—your actual brand name, two real offerings, your real city or tagline—and explicitly forbid Lorem Ipsum! Real words let the AI size cards, headings, and buttons realistically instead of producing awkward empty boxes.',
          callout: {
            type: 'tip',
            title: 'Let AI interview you to write your Mini-Spec!',
            body: 'Staring at a blank page? Type: *"I want to build a simple website for [my idea]. Ask me 5 quick questions about my audience, vibe, and sections, then turn my answers into a clean Mini-Spec before writing any HTML."*'
          }
        },
        {
          heading: 'Keeping scope joyfully small for Version 1',
          body: 'A crisp 4-section single-page website that loads in half a second and looks gorgeous on phones beats a half-finished 12-page mega-portal every time. Nail your Hero, Core Offering, Trust/Story, and Call-to-Action first—you can always add extra pages after Version 1 shines!',
          callout: {
            type: 'myth',
            title: 'Myth Buster: "Longer prompts confuse AI"',
            body: 'Messy, contradictory rambles confuse AI—well-organized bullet points make AI **dramatically** smarter! A clean 10-bullet Mini-Spec uses fewer than 250 tokens and saves ten rounds of frustrating revisions.'
          }
        }
      ],
      keyTakeaways: [
        'A 2-minute Mini-Spec covering Brand/Audience, Goal, Visual Vibe, Exact Sections, and Mobile Rules turns generic AI output into custom-crafted design.',
        'Include real wording instead of Lorem Ipsum so layouts and buttons fit realistic content.',
        'If you feel stuck writing a spec, ask AI to interview you with 5 short questions first.'
      ],
      glossaryTermIds: ['mini-spec', 'prompt', 'html', 'css'],
      relatedLabId: 'website-builder',
      quiz: [
        {
          id: 'q-6-2-1',
          type: 'multiple_choice',
          question: 'Which five details belong in a high-impact Website Mini-Spec before asking AI to write HTML?',
          options: [
            'Brand/Audience, Primary Goal, Visual Vibe/Colors, Exact Sections needed, and Mobile/Plain-code constraints.',
            'Your Wi-Fi password, laptop brand, favorite movie, API key, and shoe size.',
            'Only the name of a random color.',
            'Five pages of Lorem Ipsum placeholder text.'
          ],
          correctIndex: 0,
          explanation:
            'Giving AI clear audience, goal, visual vibe, exact sections, and mobile-friendly constraints removes guesswork and yields bespoke results immediately.'
        },
        {
          id: 'q-6-2-2',
          type: 'true_false',
          question:
            'You can ask AI to interview you with 5 quick questions and draft the Mini-Spec together before generating any website code.',
          options: ['True', 'False'],
          correctIndex: 0,
          explanation:
            'True! Having AI interview you is one of the easiest ways for beginners to uncover missing details without staring at a blank page.'
        },
        {
          id: 'q-6-2-3',
          type: 'spot_mistake',
          question:
            'Vikram prompts: "Make an awesome modern website for my photography business with everything a photographer needs." He gets a bizarre purple sci-fi site with fake Latin text and a broken booking portal. Why?',
          options: [
            'AI cannot build photography websites.',
            'He forgot to include a terminal command.',
            'Photography websites require C++.',
            'The prompt was completely open-ended with no visual vibe, no specific section list, and no simple V1 scope—forcing the AI to guess wildly.'
          ],
          correctIndex: 3,
          explanation:
            'A specific Mini-Spec ("Minimal warm white gallery, 6-photo grid, About bio, simple email contact button, no fake Latin text") immediately locks in clean, realistic results.'
        }
      ]
    },
    {
      id: 'ch-6-3',
      moduleId: 'mod-6-build-website',
      number: 3,
      title: 'Iterating Live & Fixing Visual Bugs with AI',
      readMinutes: 4,
      xpReward: 35,
      summary:
        'Almost no great website is born perfect on prompt #1—the magic happens in tiny, joyful 30-second iterations! Learn how to inspect on desktop & mobile and steer AI like a creative director.',
      analogy: {
        title: 'Sculpting Clay vs. Trying to Nail It in One Hammer Swing',
        body: 'Professional designers never expect Draft 1 to be final. Draft 1 puts the rough clay on the table; then you step back, squint at the shape, smooth one curve, widen the doorway, and brighten the glaze—one small adjustment at a time until it feels unmistakably yours.'
      },
      sections: [
        {
          heading: 'The Golden Rule of Iteration: ONE change per prompt',
          body: 'Look at your first generated site and resist the urge to dump fifteen unrelated tweaks into one giant paragraph (*"Change the font, move the pricing cards, add a newsletter popup, invert dark mode, shrink the footer, and animate the logo"*). Asking for ten changes at once often breaks three things that already worked!\n\nInstead, work like a calm creative director—**one crisp adjustment at a time**:\n• Prompt 1: *"Make the hero headline larger and add more breathing room above the button."*\n• Check preview -> Love it! -> Prompt 2: *"Add a 3-card Pricing section right below Features."*\n• Check preview -> Love it! -> Save a Git checkpoint!',
          callout: {
            type: 'tip',
            title: 'Tell AI what NOT to touch',
            body: 'Adding a tiny guardrail like *"Keep the header and colors exactly as they are; ONLY adjust the spacing inside the 3 feature cards"* stops the AI from accidentally redesigning sections you already love.'
          }
        },
        {
          heading: 'Always check BOTH Desktop AND Mobile previews',
          body: 'Over half of all real visitors will open your website link on a phone! A layout that looks spacious on a 1440px laptop monitor can easily squish text or overflow sideways on a 390px phone screen.\n\nIn the Marain Website Builder Studio (or Chrome/Firefox DevTools mobile toggle), flip to the **Mobile viewport** after every big section. Spot buttons touching each other or tiny text? Tell AI specifically: *"On mobile screens under 640px, stack the two columns vertically and give buttons full width."*',
          callout: {
            type: 'example',
            title: 'Describing visual tweaks using everyday words',
            body: 'You never need fancy CSS jargon! Everyday phrases work wonderfully:\n• "Add more white space around the cards"\n• "Make the buttons pill-shaped with a soft shadow"\n• "Increase contrast on the gray subtitle so it is easier to read"\n• "Keep line length narrower so paragraphs are effortless to scan"'
          }
        },
        {
          heading: 'Using screenshots & Inspect Element to squash stubborn visual bugs',
          body: 'If a stubborn spacing bug refuses to budge after one text description, snap a quick screenshot and show it to your AI—or right-click the awkward button in Chrome/Firefox, choose **Inspect**, and note the element’s label (like `.hero-cta`). Handing that tiny clue to AI turns a 20-minute puzzle into a 5-second fix.',
          callout: {
            type: 'warning',
            title: 'Avoid the "infinite polish spiral" before shipping',
            body: 'Once your text is readable, links work, and mobile looks neat, publish Version 1! Real feedback from one friend beats two hours of debating whether a button should be 10px or 12px rounded.'
          }
        }
      ],
      keyTakeaways: [
        'Iterate calmly with ONE focused request per prompt—and explicitly tell AI which sections to leave untouched.',
        'Always toggle between Desktop and Mobile views to catch squished columns or tiny tap targets early.',
        'Plain-English design language ("more breathing room", "higher contrast", "stack vertically on phones") plus screenshots guide AI effortlessly.'
      ],
      glossaryTermIds: ['css', 'html', 'diff', 'multimodal'],
      relatedLabId: 'website-builder',
      quiz: [
        {
          id: 'q-6-3-1',
          type: 'multiple_choice',
          question: 'What is the safest way to refine your AI-generated website without accidentally breaking sections you already love?',
          options: [
            'Ask for 12 unrelated design and layout rewrites in a single giant prompt.',
            'Delete the whole folder and start from zero for every tiny typo.',
            'Request one focused adjustment at a time and tell the AI which existing sections to keep unchanged.',
            'Only edit websites at midnight.'
          ],
          correctIndex: 2,
          explanation:
            'Small, surgical one-change-at-a-time prompts let you verify each improvement cleanly and avoid unintended ripple effects.'
        },
        {
          id: 'q-6-3-2',
          type: 'true_false',
          question:
            'You must know exact CSS property names like `flex-direction` or `border-radius` before asking AI to improve your website’s spacing or button shape.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! Clear everyday phrases like "stack these cards vertically on phones" or "make the buttons pill-shaped with extra padding" translate directly into clean CSS.'
        },
        {
          id: 'q-6-3-3',
          type: 'spot_mistake',
          question:
            'Sara designs her portfolio on a wide desktop monitor and immediately shares the link on Instagram without ever testing a phone-sized viewport. Why might half her visitors struggle?',
          options: [
            'Instagram blocks HTML websites.',
            'Multi-column desktop layouts can squish or overflow sideways on narrow phone screens unless checked in a mobile preview and stacked cleanly.',
            'Phones cannot read CSS files.',
            'Portfolios only work on laptops.'
          ],
          correctIndex: 1,
          explanation:
            'Always click the Mobile viewport toggle before shipping! A 10-second mobile check catches awkward wrapping and tiny tap targets immediately.'
        }
      ]
    },
    {
      id: 'ch-6-4',
      moduleId: 'mod-6-build-website',
      number: 4,
      title: 'Putting Your Website on the Internet for Free',
      readMinutes: 5,
      xpReward: 35,
      summary:
        'Turn your local `index.html` folder into a real public `https://` website anyone in the world can open—using free, beginner-friendly hosts in less than two minutes.',
      analogy: {
        title: 'Moving Muffins from Your Kitchen Counter to a Storefront Window',
        body: 'Right now, your website files live safely on your personal laptop—like freshly baked muffins sitting on your home kitchen counter. Only people standing inside your kitchen can taste them. **Deployment** simply copies that folder onto a tidy always-on server (a storefront window) with a public street address (`https://your-site.netlify.app`) so anyone on Earth can visit 24/7!'
      },
      sections: [
        {
          heading: 'What actually happens when you "deploy" a static site',
          body: 'Publishing a website used to require renting mysterious servers, configuring firewalls, and paying monthly hosting fees. Today, publishing a static site (plain HTML + CSS + JavaScript) is completely **free** and takes under 60 seconds.\n\nWhen you deploy, a hosting platform copies your folder onto fast servers around the globe and automatically wraps it in a secure padlock (`HTTPS`) so browsers trust your link immediately.',
          callout: {
            type: 'example',
            title: 'Three rock-solid FREE ways to put your site online today',
            body: '1. **Netlify Drop** (`app.netlify.com/drop`): Literally drag and drop your exported website folder into the browser window—instant live `https://` link in 15 seconds, zero Git needed!\n2. **GitHub Pages**: Push your folder to a free GitHub repo and flip Settings -> Pages ON. Every future Git push auto-updates your site!\n3. **Cloudflare Pages / Vercel**: Free global speed with automatic previews whenever you test new edits.'
          }
        },
        {
          heading: 'Your 60-second pre-flight checklist before going live',
          body: 'Before sharing your shiny new link with friends, family, or customers, run four quick sanity checks:\n\n1. **Front door check**: Confirm your main file is named exactly `index.html` (lowercase!).\n2. **Zero secrets check**: Confirm NO API keys or `.env` files sit anywhere inside the folder you upload.\n3. **Broken link & image check**: Click every navigation link and button once, and confirm all images load.\n4. **Phone test**: Open the live link on your own phone to feel the exact visitor experience!',
          callout: {
            type: 'warning',
            title: 'Remember: everything in a deployed website folder is public!',
            body: 'Never drop personal documents, private notes, or `.env` secret files into the folder you deploy. Keep your exported website folder super tidy—only the HTML, CSS, JS, and images meant for visitors.'
          }
        },
        {
          heading: 'Optional upgrade: connecting a custom domain later',
          body: 'Free starter links like `bean-and-book.netlify.app` or `yourname.github.io` work wonderfully for portfolios, event invites, and side projects! If you ever want your own custom address like `beanandbook.com` (~$10–$12/year from registrars like Cloudflare Registrar or Porkbun), all three free hosts let you plug in a custom domain in two minutes while keeping hosting $0/month.\n\nHead to the **Website Builder Studio** lab to build, iterate, and export your own real site folder—complete with a step-by-step `HOW_TO_PUT_ONLINE.md` guide!',
          callout: {
            type: 'tip',
            title: 'Celebrate shipping Version 1!',
            body: 'The moment you text a real live `https://` link to a friend that YOU built from scratch, something clicks forever: you are no longer just a consumer of technology—you are a builder.'
          }
        }
      ],
      keyTakeaways: [
        'Deployment simply copies your website folder onto an always-on hosting server with a secure public `https://` URL.',
        'You can host plain HTML/CSS/JS sites 100% free via Netlify Drop (drag-and-drop), GitHub Pages, Vercel, or Cloudflare Pages.',
        'Always verify `index.html` naming, zero leaked secrets, working links, and phone layout before sharing your live link.'
      ],
      glossaryTermIds: ['deployment', 'html', 'env-file', 'git'],
      relatedLabId: 'website-builder',
      quiz: [
        {
          id: 'q-6-4-1',
          type: 'multiple_choice',
          question: 'What is the fastest zero-setup way to put a folder containing `index.html`, `styles.css`, and `script.js` onto the public internet for free?',
          options: [
            'Drag and drop the clean folder onto a free static host like Netlify Drop (or enable GitHub Pages).',
            'Buy a $500 physical server for your bedroom closet.',
            'Email the folder to everyone on Earth.',
            'Rename `index.html` to `index.pdf`.'
          ],
          correctIndex: 0,
          explanation:
            'Free static hosts like Netlify Drop, GitHub Pages, and Cloudflare Pages publish your HTML/CSS/JS folder with free HTTPS in under a minute!'
        },
        {
          id: 'q-6-4-2',
          type: 'true_false',
          question:
            'Because a website is hosted on Netlify or GitHub Pages, any `.env` file placed inside the uploaded folder is automatically hidden from visitors.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! Static web hosting serves files publicly—never put `.env` files, API keys, or private documents inside a folder you upload for a public website.'
        },
        {
          id: 'q-6-4-3',
          type: 'spot_mistake',
          question:
            'Owen drags his finished website folder onto Netlify Drop, opens his shiny new URL, and gets a "Page Not Found (404)" error. Looking inside his folder, his homepage is named `MyHomePage.html`. What caused the 404?',
          options: [
            'Netlify does not allow HTML files.',
            'He forgot to buy a `.com` domain.',
            'The site needed 50 more lines of JavaScript.',
            'Web servers automatically look for a file named `index.html` (all lowercase) as the site’s front door—renaming it fixes the 404 immediately!'
          ],
          correctIndex: 3,
          explanation:
            'Every static host looks for lowercase `index.html` at the root of your folder as the landing page. Naming your main page `index.html` avoids instant 404 surprises!'
        }
      ]
    }
  ]
};
