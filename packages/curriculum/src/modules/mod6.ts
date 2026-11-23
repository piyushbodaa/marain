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
            body: 'Developers love debating React, Next.js, and Astro, yet plain HTML + CSS + JavaScript opens instantly in any browser, never breaks from package updates, and takes seconds to publish for free.'
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
          body: 'Here is a delightful secret many beginners do not realize: you do NOT need to buy a domain or upload anything just to test your website! Because web browsers (Chrome, Firefox, Safari, Edge) speak HTML, CSS, and JavaScript natively, opening `index.html` locally displays your real site right away—offline and free.',
          callout: {
            type: 'myth',
            title: 'Myth Buster: "You must pay $200/year for website builders to own a real site"',
            body: 'Owning plain `index.html`, `styles.css`, and `script.js` files means YOU own your site 100% forever—no platform lock-in, no watermarks, and free static hosting options everywhere!'
          }
        }
      ],
      keyTakeaways: [
        'Every website combines three simple roles: HTML (structure/content), CSS (colors/fonts/layout), and JavaScript (interactive behavior).',
        '`index.html` is the front door of a website folder—you can preview it locally in any browser before publishing.',
        'Plain HTML, CSS, and JavaScript are fast, zero-maintenance, and ideal for your first AI-built sites.'
      ],
      glossaryTermIds: ['html', 'css', 'javascript'],
      relatedLabId: null,
      quiz: [
        {
          id: 'q-6-1-1',
          type: 'multiple_choice',
          question: 'You love the words and layout of your site, and now you want to adjust typography, button colors, and mobile spacing. Which layer controls how the website looks?',
          options: [
            'HTML (page structure and copy)',
            'JavaScript (interactive logic)',
            'CSS (styling and layout)',
            'Git (snapshots)'
          ],
          correctIndex: 2,
          explanation:
            'CSS (Cascading Style Sheets) controls all visual styling—colors, typography, borders, spacing, dark mode, and responsive layout.'
        },
        {
          id: 'q-6-1-2',
          type: 'true_false',
          question:
            'You must buy a paid web domain before you can preview your `index.html` website in a browser.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! Any web browser can open your local `index.html` file directly for free while you build and iterate.'
        },
        {
          id: 'q-6-1-3',
          type: 'spot_mistake',
          question:
            'A friend wants a dynamic filterable pricing calculator with sleek mobile styling, and asks AI to build it "using only plain HTML tags with zero CSS and zero JavaScript." What will fall short?',
          options: [
            'Browsers refuse to render plain HTML unless it is hosted behind a paid custom domain.',
            'HTML alone gives unstyled structure—CSS handles mobile styling and JavaScript powers live calculation.',
            'Plain HTML files cannot display currency numbers or text inputs without a cloud backend database.',
            'Removing CSS automatically prevents visitors from opening the webpage on Android or iPhone browsers.'
          ],
          correctIndex: 1,
          explanation:
            'HTML gives the skeleton, CSS makes it readable and mobile-friendly, and JavaScript powers interactive calculations—each layer plays a complementary role.'
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
        body: 'If you tell a builder "Build me a cool house," you will get whatever default cookie-cutter box they built last week. Spend two minutes sketching a napkin plan—"A sunny one-story cottage for two writers, big kitchen table, warm oak wood, huge windows facing the garden"—and suddenly the builder creates YOUR place on the first try.'
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
            body: 'Messy, contradictory rambles confuse AI—well-organized bullet points make AI **dramatically** sharper! A clean 10-bullet Mini-Spec uses fewer than 250 tokens and saves ten rounds of frustrating revisions.'
          }
        }
      ],
      keyTakeaways: [
        'A 2-minute Mini-Spec covering Brand/Audience, Goal, Visual Vibe, Exact Sections, and Mobile Rules turns generic AI output into custom-crafted design.',
        'Include real wording instead of Lorem Ipsum so layouts and buttons fit realistic content.',
        'If you feel stuck writing a spec, ask AI to interview you with 5 short questions first.'
      ],
      glossaryTermIds: ['mini-spec', 'prompt', 'html', 'css'],
      relatedLabId: null,
      quiz: [
        {
          id: 'q-6-2-1',
          type: 'multiple_choice',
          question: 'Which set of details belongs in a clear Website Mini-Spec before asking AI to generate HTML?',
          options: [
            'Brand, audience, goal, visual vibe, exact sections, and mobile rules.',
            'Your live cloud API key, database password, hosting login, and five pages of Lorem Ipsum text.',
            'Only a single adjective like "modern" so the AI stays free to pick its favorite neon theme.',
            'Exact pixel coordinates for every single word and punctuation mark on desktop and tablet screens.'
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
            'Vikram prompts: "Make an awesome modern website for my photography business with everything a photographer needs." He gets a purple sci-fi site with fake Latin text and a broken booking form. Why?',
          options: [
            'AI defaults to sci-fi layouts without a CSS reset.',
            'Photo galleries require a paid server framework.',
            'His temperature setting was too low, which forced the AI to copy an older template with Latin text.',
            'His vague prompt gave no vibe, sections, or simple V1 scope.'
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
          body: 'Over half of all real visitors will open your website link on a phone! A layout that looks spacious on a wide monitor can easily squish text or overflow sideways on a 390px phone screen.\n\nAlways flip to a **mobile viewport** (in your browser’s DevTools device toggle or by opening the preview on your actual phone) after every major section. Spot buttons touching each other or tiny text? Tell AI specifically: *"On mobile screens under 640px, stack the two columns vertically and give buttons full width."*',
          callout: {
            type: 'example',
            title: 'Describing visual tweaks using everyday words',
            body: 'You never need fancy CSS jargon! Everyday phrases work wonderfully:\n• "Add more white space around the cards"\n• "Make the buttons pill-shaped with a soft shadow"\n• "Increase contrast on the gray subtitle so it is easier to read"\n• "Keep line length narrower so paragraphs are effortless to scan"'
          }
        },
        {
          heading: 'Using screenshots & Inspect Element to squash stubborn visual bugs',
          body: 'If a stubborn spacing bug refuses to budge after one text description, snap a quick screenshot and show it to your AI—or right-click the awkward button in your browser, choose **Inspect**, and note the element’s label (like `.hero-cta`). Handing that tiny clue to AI turns a 20-minute puzzle into a 5-second fix.',
          callout: {
            type: 'warning',
            title: 'Avoid the "infinite polish spiral" before shipping',
            body: 'Once your text is readable, links work, and mobile looks neat, publish Version 1! Real feedback from one friend beats two hours of debating whether a button should be 10px or 12px rounded.'
          }
        }
      ],
      keyTakeaways: [
        'Iterate calmly with ONE focused request per prompt—and explicitly tell AI which sections to leave untouched.',
        'Always check both desktop and phone-sized viewports to catch squished columns or tiny tap targets early.',
        'Plain-English design language ("more breathing room", "higher contrast", "stack vertically on phones") plus screenshots guide AI effortlessly.'
      ],
      glossaryTermIds: ['css', 'html', 'diff', 'multimodal'],
      relatedLabId: null,
      quiz: [
        {
          id: 'q-6-3-1',
          type: 'multiple_choice',
          question: 'What is the safest way to refine an AI-generated website without accidentally breaking sections you already like?',
          options: [
            'Bundle ten design tweaks into one prompt.',
            'Delete the existing CSS file and ask the AI to regenerate the whole site from scratch on each edit.',
            'Ask for one focused edit at a time and state what to keep unchanged.',
            'Avoid saving Git checkpoints until every single button and color looks final.'
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
            'Sara designs her portfolio on a wide monitor and shares the link immediately on social media without checking a phone viewport. Why might half her visitors struggle?',
          options: [
            'Social media apps automatically strip out `styles.css` from links opened inside mobile browsers.',
            'Multi-column desktop layouts can squish or overflow sideways on phones unless checked and stacked cleanly.',
            'Mobile browsers cannot load plain `index.html` pages unless you wrap them in a native mobile framework.',
            'Responsive mobile layouts only activate after you purchase a custom `.com` domain name.'
          ],
          correctIndex: 1,
          explanation:
            'Always check a phone-sized viewport before shipping! A 10-second mobile check catches awkward wrapping, sideways scrolling, and tiny tap targets immediately.'
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
        'Turn your local `index.html` folder into a real public `https://` website anyone in the world can open—using free, beginner-friendly static hosts in less than two minutes.',
      analogy: {
        title: 'Moving Muffins from Your Kitchen Counter to a Storefront Window',
        body: 'Right now, your website files live safely on your personal device—like freshly baked muffins sitting on your home kitchen counter. Only people in your kitchen can taste them. **Deployment** simply copies that clean folder onto an always-on server (a storefront window) with a public street address (`https://your-site.netlify.app`) so anyone on Earth can visit 24/7.'
      },
      sections: [
        {
          heading: 'What actually happens when you "deploy" a static site',
          body: 'Publishing a website used to require renting mysterious servers, configuring firewalls, and paying monthly hosting fees. Today, publishing a static site (plain HTML + CSS + JavaScript) is completely **free** and takes under 60 seconds.\n\nWhen you deploy, a hosting platform copies your clean folder onto fast servers around the globe and automatically wraps it in a secure padlock (`HTTPS`) so browsers trust your link immediately.',
          callout: {
            type: 'example',
            title: 'Three rock-solid FREE ways to put your site online',
            body: '1. **Netlify Drop** (`app.netlify.com/drop`): Drag and drop your clean website folder into the browser—instant live `https://` link in 15 seconds, zero Git needed.\n2. **GitHub Pages**: Push your clean folder to a free GitHub repo and turn Settings -> Pages ON so every push auto-updates your site.\n3. **Cloudflare Pages / Vercel**: Free global hosting with automatic preview links whenever you test edits.'
          }
        },
        {
          heading: 'Your 60-second pre-flight checklist before going live',
          body: 'Before sharing your new link with friends, family, or customers, run four quick sanity checks:\n\n1. **Front door check**: Confirm your main file is named exactly `index.html` (lowercase!).\n2. **Zero secrets check**: Confirm NO API keys, `.env` files, or frontend-exposed secret env vars sit inside the folder you upload.\n3. **Broken link & image check**: Tap every navigation link and button once, and confirm all images load.\n4. **Phone test**: Open the live link right on your phone to verify the real visitor experience!',
          callout: {
            type: 'warning',
            title: 'Remember: everything in a deployed website folder is public!',
            body: 'Never drop personal documents, private notes, or `.env` secret files into the folder you deploy. Keep your upload folder strictly limited to the HTML, CSS, JS, and images meant for visitors.'
          }
        },
        {
          heading: 'Optional upgrade: connecting a custom domain later',
          body: 'Free starter links like `bean-and-book.netlify.app` or `yourname.github.io` work wonderfully for portfolios, event invites, and side projects! If you ever want your own custom address like `beanandbook.com` (~$10–$12/year from registrars like Cloudflare Registrar or Porkbun), all three free hosts let you plug in a custom domain in two minutes while keeping static hosting $0/month.',
          callout: {
            type: 'tip',
            title: 'Celebrate shipping Version 1!',
            body: 'The moment you text a real live `https://` link to a friend that YOU designed and shipped yourself, something clicks forever: you are no longer just a consumer of technology—you are a builder.'
          }
        }
      ],
      keyTakeaways: [
        'Deployment simply copies your clean website folder onto an always-on hosting server with a secure public `https://` URL.',
        'You can host plain HTML/CSS/JS sites 100% free via Netlify Drop, GitHub Pages, Vercel, or Cloudflare Pages.',
        'Always verify lowercase `index.html`, zero leaked secrets or `.env` files, working links, and phone layout before sharing.'
      ],
      glossaryTermIds: ['deployment', 'html', 'env-file', 'git'],
      relatedLabId: 'website-builder',
      quiz: [
        {
          id: 'q-6-4-1',
          type: 'multiple_choice',
          question: 'What is the fastest zero-setup way to publish a clean folder containing `index.html`, `styles.css`, and `script.js` on the public internet for free?',
          options: [
            'Drag the clean folder onto a free static host like Netlify Drop.',
            'Rent a dedicated cloud database server and configure manual SSL certificates from scratch.',
            'Upload the folder together with your `.env` secrets so the host can authenticate visitors.',
            'Convert the HTML and CSS files into a single PDF document and share a cloud drive link.'
          ],
          correctIndex: 0,
          explanation:
            'Free static hosts like Netlify Drop, GitHub Pages, and Cloudflare Pages publish your clean HTML/CSS/JS folder with free HTTPS in under a minute!'
        },
        {
          id: 'q-6-4-2',
          type: 'true_false',
          question:
            'Because a website is hosted on Netlify or GitHub Pages, any `.env` file placed inside the uploaded static folder is automatically hidden from visitors.',
          options: ['True', 'False'],
          correctIndex: 1,
          explanation:
            'False! Static web hosting serves uploaded files publicly—never put `.env` files, API keys, or private documents inside a folder you deploy.'
        },
        {
          id: 'q-6-4-3',
          type: 'spot_mistake',
          question:
            'Owen drags his finished website folder onto Netlify Drop, opens his new URL, and gets a "Page Not Found (404)" error. Inside his folder, the homepage is named `MyHomePage.html`. What caused the 404?',
          options: [
            'Static hosts reject folders mixing CSS and JavaScript.',
            'Netlify Drop needs a paid custom `.com` domain first.',
            'Filenames with capital letters are only supported on GitHub Pages, never on drag-and-drop hosts.',
            'Static hosts look for lowercase `index.html` as the site’s entry page.'
          ],
          correctIndex: 3,
          explanation:
            'Every static host looks for lowercase `index.html` at the root of your folder as the landing page. Naming your main page `index.html` fixes the 404 immediately!'
        }
      ]
    }
  ],
  masteryCheck: {
    id: 'mc-6-build-website',
    title: 'Unit 6 Mastery Check',
    subtitle: 'Confirm you can structure a Mini-Spec, steer web layers cleanly, and deploy without pitfalls.',
    passThreshold: 0.75,
    xpReward: 40,
    estimatedMinutes: 2,
    questions: [
      {
        id: 'mc-6-q1',
        type: 'multiple_choice',
        question: 'Your portfolio copy and layout are final, but the contact form needs email validation when tapped and buttons need larger mobile tap targets. Which two files should you ask AI to edit?',
        options: [
          '`script.js` for validation and `styles.css` for button sizing.',
          'Only `.gitignore` for validation and `index.html` for every color rule.',
          'Only `.env` for validation and `README.md` for mobile button padding.',
          '`styles.css` for form validation logic and a cloud database for button spacing.'
        ],
        correctIndex: 0,
        explanation:
          'JavaScript (`script.js`) handles interactive behavior like validation, while CSS (`styles.css`) controls sizing, spacing, and mobile styling.'
      },
      {
        id: 'mc-6-q2',
        type: 'spot_mistake',
        question: 'Before generating a cafe site, Priya prompts: "Build an amazing modern website for my cafe—add everything a restaurant might need." What is the quickest fix?',
        options: [
          'Add five pages of Lorem Ipsum to keep layout neutral.',
          'Write a 5-part Mini-Spec naming audience, vibe, real sections, and mobile rules.',
          'Switch from plain HTML/CSS to a complex backend framework before choosing colors.',
          'Repeat the exact same one-line prompt at temperature 0.0 until the layout improves.'
        ],
        correctIndex: 1,
        explanation:
          'A concise Mini-Spec with audience, goal, visual vibe, exact sections, real copy, and mobile rules prevents generic guesswork on prompt #1.'
      },
      {
        id: 'mc-6-q3',
        type: 'multiple_choice',
        question: 'You love your site’s header and pricing cards, and only want the footer links stacked cleanly on phones. How should you prompt the change?',
        options: [
          'Bundle ten unrelated font, color, and footer rewrites into a single big prompt.',
          'Delete `styles.css` and ask AI to recreate every section from memory.',
          'Request only the mobile footer stacking tweak and say to keep header/cards untouched.',
          'Avoid checking a mobile viewport until after you purchase a custom `.com` domain.'
        ],
        correctIndex: 2,
        explanation:
          'One focused change per prompt—plus explicitly stating what NOT to touch—prevents regressions in sections that already work.'
      },
      {
        id: 'mc-6-q4',
        type: 'spot_mistake',
        question: 'Before uploading a static site folder to Netlify Drop, Leo leaves `Home.HTML` as the landing file and leaves his `.env` file inside the folder. What two problems will hit immediately?',
        options: [
          'Netlify Drop charges $20/month and converts `Home.HTML` into a PDF.',
          'Browsers hide `.env` safely, yet CSS stops loading on phones.',
          'GitHub Pages is required for any static site folder containing both HTML and JavaScript files.',
          'Visitors will hit a 404 (needs `index.html`), and `.env` gets served publicly.'
        ],
        correctIndex: 3,
        explanation:
          'Static hosts require lowercase `index.html` as the root entry page AND serve uploaded files publicly—never place `.env` or private files inside a deployed folder!'
      }
    ]
  }
};
