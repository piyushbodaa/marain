import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Check,
  Code2,
  Copy,
  Download,
  Eye,
  FolderOpen,
  Globe,
  Loader2,
  Monitor,
  Smartphone,
  Sparkles,
  Undo2,
  Wand2,
} from 'lucide-react';
import type { LabProps } from './types';
import {
  buildProviderCallRequest,
  exportProject,
  isByokReady,
  openPath,
  sanitizeFolderName,
  testProviderCall,
} from './bridge';
import { LabHeader, MissionChecklist } from './LabShared';

type GoalId = 'portfolio' | 'cafe' | 'workshop' | 'linkbio' | 'custom';
type VibeId = 'modern-light' | 'sleek-dark' | 'warm-editorial' | 'playful-pop';
type SectionId = 'hero' | 'about' | 'features' | 'pricing' | 'contact' | 'faq';

interface WebsiteConfig {
  goal: GoalId;
  brandName: string;
  tagline: string;
  vibe: VibeId;
  sections: SectionId[];
  pillButtons: boolean;
  accentOverride: string | null;
  customBannerNote: string | null;
}

interface GeneratedSite {
  html: string;
  css: string;
  js: string;
  sourceLabel: string;
}

const GOAL_PRESETS: Record<
  GoalId,
  { label: string; brandName: string; tagline: string; vibe: VibeId; sections: SectionId[] }
> = {
  portfolio: {
    label: 'Personal Portfolio',
    brandName: 'Maya Lin Studio',
    tagline: 'Thoughtful digital products, crisp interfaces, and beginner-friendly design.',
    vibe: 'modern-light',
    sections: ['hero', 'about', 'features', 'contact'],
  },
  cafe: {
    label: 'Local Cafe',
    brandName: 'Roast & Bloom Coffee',
    tagline: 'Small-batch pour-overs, warm cardamom buns, and sunny neighborhood tables.',
    vibe: 'warm-editorial',
    sections: ['hero', 'about', 'features', 'pricing', 'contact'],
  },
  workshop: {
    label: 'Workshop Event',
    brandName: 'Weekend AI Builders',
    tagline: 'Build your very first live website & app in one friendly Saturday afternoon.',
    vibe: 'sleek-dark',
    sections: ['hero', 'features', 'pricing', 'faq'],
  },
  linkbio: {
    label: 'Link-in-Bio',
    brandName: 'Alex Rivera',
    tagline: 'Creator, podcast host, and curious builder sharing weekly notes.',
    vibe: 'playful-pop',
    sections: ['hero', 'features', 'contact'],
  },
  custom: {
    label: 'Custom Idea',
    brandName: 'My First AI Site',
    tagline: 'Designed by me and built step-by-step with AI.',
    vibe: 'modern-light',
    sections: ['hero', 'about', 'features', 'contact'],
  },
};

const VIBES: Record<
  VibeId,
  {
    label: string;
    bg: string;
    surface: string;
    text: string;
    muted: string;
    accent: string;
    accentText: string;
    border: string;
    font: string;
  }
> = {
  'modern-light': {
    label: 'Modern Light',
    bg: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    muted: '#475569',
    accent: '#2563eb',
    accentText: '#ffffff',
    border: '#e2e8f0',
    font: 'system-ui, -apple-system, sans-serif',
  },
  'sleek-dark': {
    label: 'Sleek Dark',
    bg: '#0b1120',
    surface: '#111827',
    text: '#f8fafc',
    muted: '#94a3b8',
    accent: '#8b5cf6',
    accentText: '#ffffff',
    border: '#1f2937',
    font: 'system-ui, -apple-system, sans-serif',
  },
  'warm-editorial': {
    label: 'Warm Editorial',
    bg: '#fdf8f3',
    surface: '#ffffff',
    text: '#292018',
    muted: '#6b5c4d',
    accent: '#c2410c',
    accentText: '#ffffff',
    border: '#eadfd3',
    font: 'Georgia, Cambria, serif',
  },
  'playful-pop': {
    label: 'Playful Pop',
    bg: '#fffbeb',
    surface: '#ffffff',
    text: '#1e1b4b',
    muted: '#4c4976',
    accent: '#db2777',
    accentText: '#ffffff',
    border: '#fde68a',
    font: 'system-ui, -apple-system, sans-serif',
  },
};

const SECTION_LABELS: Record<SectionId, string> = {
  hero: 'Hero Banner',
  about: 'About / Story',
  features: 'Highlights / Menu',
  pricing: 'Pricing Cards',
  contact: 'Contact Form',
  faq: 'FAQ Accordion',
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function generateSiteCode(cfg: WebsiteConfig): GeneratedSite {
  const palette = VIBES[cfg.vibe];
  const accent = cfg.accentOverride || palette.accent;
  const radius = cfg.pillButtons ? '999px' : '12px';
  const safeBrand = escapeHtml(cfg.brandName.trim() || 'My First Website');
  const safeTagline = escapeHtml(cfg.tagline.trim() || 'Crafted with AI and ready for the web.');

  const featureItems =
    cfg.goal === 'cafe'
      ? [
          ['Single-Origin Espresso', 'Dialed in every morning for bright citrus & chocolate notes.'],
          ['Warm Bakery Counter', 'Fresh sourdough loaves and cardamom knots baked at 6 AM.'],
          ['Cozy Wi-Fi Lounge', 'Plenty of outlets, sunlit booths, and zero rush.'],
        ]
      : cfg.goal === 'workshop'
        ? [
            ['Zero Jargon Lessons', 'Learn tokens, prompts, and real tools in plain English.'],
            ['Live Guided Projects', 'Walk away with a real working website & mini-app.'],
            ['Friendly Mentors', 'Small tables where every beginner question is welcome.'],
          ]
        : cfg.goal === 'linkbio'
          ? [
              ['Weekly Newsletter', 'Practical 5-minute stories on learning & building with AI.'],
              ['Latest Podcast Episode', 'Interviews with everyday people creating cool projects.'],
              ['Free Starter Templates', 'Download my favorite checklists and website starters.'],
            ]
          : [
              ['Clean, Fast Design', 'Thoughtfully structured pages that load instantly on any phone.'],
              ['Human-Centered Craft', 'Clear messaging and effortless navigation for visitors.'],
              ['Built to Grow', 'Simple HTML, CSS, and JavaScript you own completely.'],
            ];

  const htmlParts: string[] = [];

  htmlParts.push(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeBrand}</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="navbar">
    <div class="container nav-inner">
      <a href="#" class="brand">${safeBrand}</a>
      <nav class="nav-links">
        ${cfg.sections.includes('about') ? '<a href="#about">About</a>' : ''}
        ${cfg.sections.includes('features') ? '<a href="#highlights">Highlights</a>' : ''}
        ${cfg.sections.includes('pricing') ? '<a href="#pricing">Pricing</a>' : ''}
        ${cfg.sections.includes('contact') ? '<a href="#contact" class="btn btn-sm">Say Hello</a>' : ''}
      </nav>
    </div>
  </header>

  <main>`);

  if (cfg.customBannerNote) {
    htmlParts.push(`    <div class="announcement-bar">${escapeHtml(cfg.customBannerNote)}</div>`);
  }

  if (cfg.sections.includes('hero')) {
    htmlParts.push(`    <section class="hero container">
      <span class="pill">Welcome to ${safeBrand}</span>
      <h1>${safeBrand}</h1>
      <p class="lead">${safeTagline}</p>
      <div class="cta-row">
        <a href="#${cfg.sections.includes('contact') ? 'contact' : 'highlights'}" class="btn btn-primary">Get Started</a>
        <button id="theme-peek-btn" type="button" class="btn btn-outline">Preview Accent Spark</button>
      </div>
    </section>`);
  }

  if (cfg.sections.includes('about')) {
    htmlParts.push(`    <section id="about" class="section container">
      <div class="card about-card">
        <h2>Our Story</h2>
        <p>${safeBrand} started with a simple idea: make great experiences approachable, warm, and genuinely useful. Every detail on this site was planned with a clear prompt and clean web building blocks.</p>
      </div>
    </section>`);
  }

  if (cfg.sections.includes('features')) {
    htmlParts.push(`    <section id="highlights" class="section container">
      <h2>What Makes Us Special</h2>
      <div class="grid-3">
        ${featureItems
          .map(
            ([t, d]) => `<article class="card">
          <h3>${escapeHtml(t)}</h3>
          <p>${escapeHtml(d)}</p>
        </article>`
          )
          .join('\n        ')}
      </div>
    </section>`);
  }

  if (cfg.sections.includes('pricing')) {
    htmlParts.push(`    <section id="pricing" class="section container">
      <h2>Simple, Transparent Pricing</h2>
      <div class="grid-3">
        <div class="card">
          <span class="tag">Starter</span>
          <div class="price">$9</div>
          <p>Perfect for trying things out with zero commitment.</p>
          <a href="#contact" class="btn btn-outline">Choose Starter</a>
        </div>
        <div class="card featured-card">
          <span class="tag">Most Popular</span>
          <div class="price">$24</div>
          <p>Everything you need plus priority support and bonus extras.</p>
          <a href="#contact" class="btn btn-primary">Choose Popular</a>
        </div>
        <div class="card">
          <span class="tag">Team</span>
          <div class="price">$59</div>
          <p>Bring your friends or team along with shared seats.</p>
          <a href="#contact" class="btn btn-outline">Choose Team</a>
        </div>
      </div>
    </section>`);
  }

  if (cfg.sections.includes('faq')) {
    htmlParts.push(`    <section id="faq" class="section container">
      <h2>Quick Questions</h2>
      <div class="faq-list">
        <details class="card" open>
          <summary>Do I need any prior experience?</summary>
          <p>Not at all! Everything is explained step by step in friendly plain English.</p>
        </details>
        <details class="card">
          <summary>How do I put this website online for free?</summary>
          <p>Export the folder and drag-and-drop it onto Netlify Drop or push it to GitHub Pages!</p>
        </details>
      </div>
    </section>`);
  }

  if (cfg.sections.includes('contact')) {
    htmlParts.push(`    <section id="contact" class="section container">
      <div class="card contact-card">
        <h2>Get in Touch</h2>
        <p>Have a question or want to collaborate? Send a quick message below.</p>
        <form id="contact-form" class="contact-form">
          <input type="text" id="visitor-name" placeholder="Your name" required />
          <input type="email" id="visitor-email" placeholder="you@example.com" required />
          <textarea id="visitor-msg" rows="3" placeholder="Write a friendly hello..." required></textarea>
          <button type="submit" class="btn btn-primary">Send Message</button>
          <p id="form-feedback" class="form-feedback" aria-live="polite"></p>
        </form>
      </div>
    </section>`);
  }

  htmlParts.push(`  </main>

  <footer class="footer">
    <div class="container">
      <p>© ${new Date().getFullYear()} ${safeBrand} • Built in Zero2AI Studio</p>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>`);

  const css = `:root {
  --bg: ${palette.bg};
  --surface: ${palette.surface};
  --text: ${palette.text};
  --muted: ${palette.muted};
  --accent: ${accent};
  --accent-text: ${palette.accentText};
  --border: ${palette.border};
  --btn-radius: ${radius};
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: ${palette.font};
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
}

.container { max-width: 960px; margin: 0 auto; padding: 0 20px; }

.navbar {
  position: sticky; top: 0; z-index: 10;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.nav-inner {
  display: flex; align-items: center; justify-content: space-between;
  min-height: 62px; gap: 16px;
}

.brand { font-weight: 800; font-size: 1.05rem; color: var(--text); text-decoration: none; }
.nav-links { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.nav-links a { color: var(--muted); text-decoration: none; font-size: 0.9rem; font-weight: 600; }
.nav-links a:hover { color: var(--accent); }

.announcement-bar {
  background: var(--accent); color: var(--accent-text);
  text-align: center; padding: 8px 16px; font-size: 0.85rem; font-weight: 600;
}

.hero { padding: 64px 20px 44px; text-align: center; }
.pill {
  display: inline-block; padding: 5px 12px; border-radius: 999px;
  border: 1px solid var(--border); background: var(--surface);
  color: var(--accent); font-size: 0.78rem; font-weight: 700; margin-bottom: 14px;
}
.hero h1 { font-size: clamp(2rem, 5vw, 3.2rem); line-height: 1.15; letter-spacing: -0.02em; }
.lead { max-width: 600px; margin: 14px auto 0; color: var(--muted); font-size: 1.05rem; }
.cta-row { margin-top: 26px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

.btn {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 11px 22px; border-radius: var(--btn-radius); font-weight: 700;
  font-size: 0.92rem; cursor: pointer; text-decoration: none; border: 1px solid transparent;
  transition: transform 0.15s ease, opacity 0.15s ease;
}
.btn:hover { transform: translateY(-1px); opacity: 0.93; }
.btn-sm { padding: 7px 14px; font-size: 0.82rem; background: var(--accent); color: var(--accent-text) !important; }
.btn-primary { background: var(--accent); color: var(--accent-text); }
.btn-outline { background: var(--surface); color: var(--text); border-color: var(--border); }

.section { padding: 28px 20px; }
.section h2 { font-size: 1.5rem; margin-bottom: 18px; }

.grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
.card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 16px; padding: 22px;
}
.card h3 { font-size: 1.05rem; margin-bottom: 6px; }
.card p { color: var(--muted); font-size: 0.92rem; }
.featured-card { border: 2px solid var(--accent); }
.tag { font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: var(--accent); }
.price { font-size: 2rem; font-weight: 800; margin: 6px 0 8px; }

.faq-list { display: grid; gap: 12px; }
details summary { font-weight: 700; cursor: pointer; }
details p { margin-top: 8px; }

.contact-form { display: grid; gap: 12px; margin-top: 14px; max-width: 520px; }
.contact-form input, .contact-form textarea {
  width: 100%; padding: 11px 13px; border-radius: 10px;
  border: 1px solid var(--border); background: var(--bg); color: var(--text); font: inherit;
}
.form-feedback { font-size: 0.88rem; font-weight: 700; color: var(--accent); min-height: 20px; }

.footer {
  margin-top: 36px; padding: 24px 0; border-top: 1px solid var(--border);
  text-align: center; color: var(--muted); font-size: 0.85rem;
}`;

  const js = `// Interactive touches for ${cfg.brandName.replace(/[\r\n]/g, ' ')}
const form = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');

if (form && feedback) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const nameInput = document.getElementById('visitor-name');
    const visitor = nameInput ? nameInput.value.trim() : 'friend';
    feedback.textContent = 'Thanks, ' + (visitor || 'friend') + '! Your message was received.';
    form.reset();
  });
}

const sparkBtn = document.getElementById('theme-peek-btn');
if (sparkBtn) {
  const accents = ['${accent}', '#059669', '#e11d48', '#d97706', '#2563eb'];
  let idx = 0;
  sparkBtn.addEventListener('click', function () {
    idx = (idx + 1) % accents.length;
    document.documentElement.style.setProperty('--accent', accents[idx]);
  });
}`;

  return {
    html: htmlParts.join('\n'),
    css,
    js,
    sourceLabel: 'Zero2AI Instant Studio Generator',
  };
}

function buildHowToPublishMd(brandName: string): string {
  return `# How to Put "${brandName}" Online for Free!

Congrats — you just built a real website with **HTML** (structure), **CSS** (style), and **JavaScript** (interactivity)!

## 1. Preview on Your Computer Right Now
Double-click \`index.html\` inside this folder. It opens straight in Chrome, Firefox, or Brave — no server needed!

## 2. Put It Live on the Internet in 60 Seconds (100% Free)
- **Option A — Netlify Drop (Easiest!):**
  1. Go to https://app.netlify.com/drop
  2. Drag and drop this entire folder onto the page.
  3. You immediately get a live public link to share with friends!

- **Option B — GitHub Pages:**
  1. Create a free GitHub repository and upload \`index.html\`, \`styles.css\`, and \`script.js\`.
  2. Open **Settings → Pages → Deploy from branch (main)**.
  3. Your site goes live at \`https://<your-username>.github.io/<repo-name>/\`.
`;
}

const PLAIN_ENGLISH_GUIDES: Record<'html' | 'css' | 'js', Array<{ tag: string; meaning: string }>> = {
  html: [
    { tag: '<header> & <nav>', meaning: 'The sticky navigation bar at the top of your site with your brand name and menu links.' },
    { tag: '<section class="hero">', meaning: 'The big welcome banner visitors see first — headline, tagline, and main buttons.' },
    { tag: '<form id="contact-form">', meaning: 'Input boxes where visitors type their name, email, and message.' },
    { tag: '<script src="script.js">', meaning: 'Connects your JavaScript file at the bottom so buttons and forms come alive.' },
  ],
  css: [
    { tag: ':root { --bg, --accent }', meaning: 'CSS Variables! Change --accent in ONE place and every button & highlight updates together.' },
    { tag: 'display: grid', meaning: 'Automatically arranges cards into clean responsive columns that stack nicely on phones.' },
    { tag: 'border-radius: var(--btn-radius)', meaning: 'Controls whether buttons have soft rounded corners (12px) or full pill shapes (999px).' },
  ],
  js: [
    { tag: 'document.getElementById(...)', meaning: 'Finds a specific HTML element (like your contact form) so code can interact with it.' },
    { tag: 'addEventListener("submit", ...)', meaning: 'Listens for a visitor clicking "Send Message", stops the page from reloading, and shows a friendly thank-you note.' },
    { tag: 'style.setProperty("--accent", ...)', meaning: 'Live-updates your CSS accent color variable whenever someone clicks the accent preview button!' },
  ],
};

const ACCENT_CYCLE = ['#059669', '#e11d48', '#7c3aed', '#d97706', '#0284c7'];

export const WebsiteBuilderLab: React.FC<LabProps> = ({
  onCompleteLab,
  completedLabs,
  apiConfig,
  onOpenSettings,
}) => {
  const [config, setConfig] = useState<WebsiteConfig>({
    goal: 'cafe',
    brandName: GOAL_PRESETS.cafe.brandName,
    tagline: GOAL_PRESETS.cafe.tagline,
    vibe: GOAL_PRESETS.cafe.vibe,
    sections: [...GOAL_PRESETS.cafe.sections],
    pillButtons: false,
    accentOverride: null,
    customBannerNote: null,
  });

  const [site, setSite] = useState<GeneratedSite>(() =>
    generateSiteCode({
      goal: 'cafe',
      brandName: GOAL_PRESETS.cafe.brandName,
      tagline: GOAL_PRESETS.cafe.tagline,
      vibe: GOAL_PRESETS.cafe.vibe,
      sections: [...GOAL_PRESETS.cafe.sections],
      pillButtons: false,
      accentOverride: null,
      customBannerNote: null,
    })
  );

  const [previousConfigs, setPreviousConfigs] = useState<WebsiteConfig[]>([]);
  const [editHistory, setEditHistory] = useState<string[]>([]);
  const [iterateInput, setIterateInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [codeTab, setCodeTab] = useState<'html' | 'css' | 'js'>('html');
  const [plainEnglishMode, setPlainEnglishMode] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [showPromptComparison, setShowPromptComparison] = useState<boolean>(true);

  const [exportPath, setExportPath] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Mission checklist state
  const [didGenerate, setDidGenerate] = useState<boolean>(false);
  const [didIterate, setDidIterate] = useState<boolean>(false);
  const [didInspectCode, setDidInspectCode] = useState<boolean>(false);
  const [didExport, setDidExport] = useState<boolean>(false);

  const assembledPrompt = useMemo(() => {
    const sectionNames = config.sections.map((s) => SECTION_LABELS[s]).join(', ');
    return `Build a responsive single-page website for "${config.brandName}" (${GOAL_PRESETS[config.goal].label}).
Tagline: "${config.tagline}"
Visual Vibe: ${VIBES[config.vibe].label}${config.pillButtons ? ' with pill-shaped buttons' : ''}.
Include sections: ${sectionNames || 'Hero Banner'}.
Output clean, beginner-readable index.html, styles.css, and script.js with mobile-friendly layout.`;
  }, [config]);

  const previewSrcDoc = useMemo(() => {
    return site.html
      .replace(
        /<link[^>]*href=["']styles\.css["'][^>]*>/i,
        `<style>\n${site.css}\n</style>`
      )
      .replace(
        /<script[^>]*src=["']script\.js["'][^>]*>\s*<\/script>/i,
        `<script>\n${site.js}\n</script>`
      );
  }, [site]);

  const handlePickGoal = (goal: GoalId) => {
    const preset = GOAL_PRESETS[goal];
    const next: WebsiteConfig = {
      ...config,
      goal,
      brandName: preset.brandName,
      tagline: preset.tagline,
      vibe: preset.vibe,
      sections: [...preset.sections],
      accentOverride: null,
      customBannerNote: null,
    };
    setConfig(next);
    setSite(generateSiteCode(next));
  };

  const toggleSection = (sec: SectionId) => {
    setConfig((prev) => {
      const exists = prev.sections.includes(sec);
      const nextSections = exists
        ? prev.sections.filter((s) => s !== sec)
        : [...prev.sections, sec];
      return { ...prev, sections: nextSections.length > 0 ? nextSections : ['hero'] };
    });
  };

  const handleGenerateWebsite = async () => {
    setIsGenerating(true);
    setStatusMessage(null);
    setDidGenerate(true);

    const localSite = generateSiteCode(config);

    if (isByokReady(apiConfig)) {
      const req = buildProviderCallRequest(
        apiConfig,
        `${assembledPrompt}\n\nReturn ONLY a JSON object with keys "html", "css", and "js" (no markdown fences). Keep it clean and self-contained.`,
        'You are an expert front-end teacher building clean static HTML/CSS/JS websites.'
      );
      const res = await testProviderCall(req);
      if (res.ok && res.text) {
        try {
          const jsonMatch = res.text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]) as {
              html?: string;
              css?: string;
              js?: string;
            };
            if (parsed.html && parsed.css) {
              setSite({
                html: parsed.html,
                css: parsed.css,
                js: parsed.js || '// Ready for interactive scripts',
                sourceLabel: `Generated Live by ${apiConfig.provider.toUpperCase()} (${apiConfig.model || 'default'})`,
              });
              setStatusMessage(`Generated fresh website via live ${apiConfig.provider.toUpperCase()} API!`);
              setIsGenerating(false);
              return;
            }
          }
        } catch {
          // Graceful fallback below
        }
      }
      setSite({
        ...localSite,
        sourceLabel: 'Practice Generator (BYOK fallback — structured JSON unavailable)',
      });
      setStatusMessage(
        'Built your tailored site with the instant studio generator (live AI fallback).'
      );
      setIsGenerating(false);
      return;
    }

    await new Promise((r) => setTimeout(r, 260));
    setSite(localSite);
    setStatusMessage(`Generated fresh "${config.brandName}" website in Practice Mode!`);
    setIsGenerating(false);
  };

  const applyIteration = (instruction: string) => {
    const trimmed = instruction.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();

    setPreviousConfigs((prev) => [config, ...prev.slice(0, 9)]);
    const next: WebsiteConfig = { ...config, sections: [...config.sections] };
    let note = '';

    if (lower.includes('pricing')) {
      if (!next.sections.includes('pricing')) next.sections.push('pricing');
      note = 'Added 3-tier Pricing Cards section';
    } else if (lower.includes('pill')) {
      next.pillButtons = true;
      note = 'Updated all buttons to pill-shaped (999px radius)';
    } else if (lower.includes('contact')) {
      if (!next.sections.includes('contact')) next.sections.push('contact');
      note = 'Added interactive Contact Form section';
    } else if (lower.includes('accent') || lower.includes('color')) {
      const currentIdx = next.accentOverride
        ? ACCENT_CYCLE.indexOf(next.accentOverride)
        : -1;
      next.accentOverride = ACCENT_CYCLE[(currentIdx + 1) % ACCENT_CYCLE.length];
      note = `Switched accent color variable to ${next.accentOverride}`;
    } else if (lower.includes('dark')) {
      next.vibe = next.vibe === 'sleek-dark' ? 'modern-light' : 'sleek-dark';
      note = `Switched theme vibe to ${VIBES[next.vibe].label}`;
    } else if (lower.includes('faq')) {
      if (!next.sections.includes('faq')) next.sections.push('faq');
      note = 'Added expandable FAQ Accordion section';
    } else {
      next.customBannerNote = trimmed.length > 80 ? `${trimmed.slice(0, 80)}...` : trimmed;
      note = `Applied custom update banner: "${next.customBannerNote}"`;
    }

    setConfig(next);
    setSite(generateSiteCode(next));
    setEditHistory((prev) => [note, ...prev.slice(0, 5)]);
    setStatusMessage(`AI Iteration Applied: ${note}`);
    setIterateInput('');
    setDidIterate(true);
  };

  const handleUndo = () => {
    if (previousConfigs.length === 0) return;
    const [last, ...rest] = previousConfigs;
    setPreviousConfigs(rest);
    setConfig(last);
    setSite(generateSiteCode(last));
    setStatusMessage('Undid last AI edit!');
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);
    const slug = sanitizeFolderName(config.brandName || 'my-first-website');
    const res = await exportProject(slug, {
      'index.html': site.html,
      'styles.css': site.css,
      'script.js': site.js,
      'HOW_TO_PUT_ONLINE.md': buildHowToPublishMd(config.brandName),
    });
    setIsExporting(false);
    if (res.ok) {
      setExportPath(res.path);
      setDidExport(true);
    } else {
      setExportError(res.error || 'Could not export website files.');
    }
  };

  const handleCopyActiveCode = () => {
    const content = codeTab === 'html' ? site.html : codeTab === 'css' ? site.css : site.js;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content).catch(() => {});
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1600);
  };

  const missionSteps = [
    {
      id: 'gen',
      label: 'Customize your brand/vibe & click "Generate Website"',
      done: didGenerate,
    },
    {
      id: 'iter',
      label: 'Use "Iterate with AI" to tweak your site live',
      done: didIterate,
    },
    {
      id: 'code',
      label: 'Open the Code View & Plain-English Explainer',
      done: didInspectCode,
    },
    {
      id: 'export',
      label: 'Export your real HTML/CSS/JS website to your computer',
      done: didExport,
    },
  ];

  const activeCodeText = codeTab === 'html' ? site.html : codeTab === 'css' ? site.css : site.js;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <LabHeader
        badge="Lab 5 • Website Studio"
        title="Build Your First Website with AI"
        subtitle="Turn a clear structured prompt into a real responsive HTML, CSS & JavaScript website, iterate live, and export it to your computer."
        xpReward={100}
        isCompleted={completedLabs.includes('website-builder')}
        apiConfig={apiConfig}
        onOpenSettings={onOpenSettings}
        accent="blue"
        icon={<Globe className="h-6 w-6" />}
      />

      <MissionChecklist
        labId="website-builder"
        xpReward={100}
        steps={missionSteps}
        completedLabs={completedLabs}
        onCompleteLab={onCompleteLab}
      />

      {/* STEP 1 & 2: PROMPT BUILDER + ASSEMBLED PROMPT */}
      <div className="grid gap-5 lg:grid-cols-12">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 lg:col-span-7">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Step 1: Structured Website Prompt Builder
          </h2>

          {/* Goal selector */}
          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.keys(GOAL_PRESETS) as GoalId[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => handlePickGoal(g)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                  config.goal === g
                    ? 'border-blue-500 bg-blue-600 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                }`}
              >
                {GOAL_PRESETS[g].label}
              </button>
            ))}
          </div>

          {/* Inputs */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="wb-brand"
                className="text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                Brand / Site Name
              </label>
              <input
                id="wb-brand"
                type="text"
                value={config.brandName}
                onChange={(e) => setConfig((p) => ({ ...p, brandName: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="wb-tagline"
                className="text-xs font-semibold text-slate-600 dark:text-slate-300"
              >
                One-Line Tagline
              </label>
              <input
                id="wb-tagline"
                type="text"
                value={config.tagline}
                onChange={(e) => setConfig((p) => ({ ...p, tagline: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>

          {/* Vibe picker */}
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Visual Vibe / Theme
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(Object.keys(VIBES) as VibeId[]).map((v) => {
                const pal = VIBES[v];
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setConfig((p) => ({ ...p, vibe: v, accentOverride: null }))}
                    className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs font-semibold transition ${
                      config.vibe === v
                        ? 'border-blue-500 bg-blue-50 text-blue-900 dark:border-blue-400 dark:bg-blue-950/60 dark:text-blue-200'
                        : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <span
                      className="h-4 w-4 shrink-0 rounded-full border border-slate-300"
                      style={{ background: pal.accent }}
                    />
                    <span className="truncate">{pal.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section checkboxes */}
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Page Sections to Include
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(Object.keys(SECTION_LABELS) as SectionId[]).map((sec) => {
                const checked = config.sections.includes(sec);
                return (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => toggleSection(sec)}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                      checked
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200'
                        : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {checked && <Check className="h-3.5 w-3.5" />}
                    {SECTION_LABELS[sec]}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* STEP 2: ASSEMBLED PROMPT TRANSPARENCY */}
        <section className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 lg:col-span-5">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Step 2: Your Assembled AI Prompt
              </h2>
              <button
                type="button"
                onClick={() => setShowPromptComparison((p) => !p)}
                className="text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                {showPromptComparison ? 'Hide tip' : 'Why this works'}
              </button>
            </div>

            {showPromptComparison && (
              <div className="mt-2 rounded-xl border border-rose-200 bg-rose-50/70 p-2.5 text-[11px] text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
                <strong>Vague prompt:</strong> &quot;Make me a website&quot; → AI guesses randomly!
                <br />
                <strong>Structured prompt below:</strong> gives Brand, Goal, Theme, and exact Sections!
              </div>
            )}

            <pre className="mt-3 max-h-44 overflow-y-auto whitespace-pre-wrap rounded-xl bg-slate-950 p-3.5 font-mono text-[11px] leading-relaxed text-sky-200">
              {assembledPrompt}
            </pre>
          </div>

          <div className="mt-4 space-y-2">
            <button
              type="button"
              onClick={handleGenerateWebsite}
              disabled={isGenerating}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-500 disabled:opacity-60"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Generate Website
            </button>
            {statusMessage && (
              <p className="text-center text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                {statusMessage}
              </p>
            )}
          </div>
        </section>
      </div>

      {/* STEP 3: ITERATE WITH AI + LIVE STUDIO PREVIEW & CODE */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Step 3: Iterate with AI & Inspect Live Preview
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real builders rarely stop at draft #1 — ask AI for small focused changes one at a time!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  viewMode === 'preview'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Live Preview
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode('code');
                  setDidInspectCode(true);
                }}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  viewMode === 'code'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <Code2 className="h-3.5 w-3.5" />
                Code & Explainer
              </button>
            </div>

            {viewMode === 'preview' && (
              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => setViewport('desktop')}
                  title="Desktop Viewport"
                  className={`rounded-lg p-1.5 ${
                    viewport === 'desktop'
                      ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400'
                      : 'text-slate-500'
                  }`}
                >
                  <Monitor className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport('mobile')}
                  title="Mobile Viewport (375px)"
                  className={`rounded-lg p-1.5 ${
                    viewport === 'mobile'
                      ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400'
                      : 'text-slate-500'
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Iterate with AI Bar */}
        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 dark:border-blue-900/60 dark:bg-blue-950/30">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 dark:text-blue-200">
              <Wand2 className="h-3.5 w-3.5" />
              Quick Edits:
            </span>
            {[
              'Add pricing cards',
              'Make buttons pill-shaped',
              'Add contact form',
              'Switch accent color',
              'Toggle dark mode',
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => applyIteration(chip)}
                className="rounded-lg border border-blue-200 bg-white px-2.5 py-1 text-xs font-semibold text-blue-800 hover:bg-blue-100 dark:border-blue-800 dark:bg-slate-900 dark:text-blue-200 dark:hover:bg-blue-900/50"
              >
                {chip}
              </button>
            ))}
            {previousConfigs.length > 0 && (
              <button
                type="button"
                onClick={handleUndo}
                className="ml-auto inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <Undo2 className="h-3.5 w-3.5" />
                Undo
              </button>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              applyIteration(iterateInput);
            }}
            className="mt-2.5 flex gap-2"
          >
            <input
              type="text"
              value={iterateInput}
              onChange={(e) => setIterateInput(e.target.value)}
              placeholder='Ask for any custom tweak (e.g., "Grand opening 20% off this Saturday!" or "Add FAQ")...'
              className="flex-1 rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <button
              type="submit"
              disabled={!iterateInput.trim()}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-50"
            >
              Apply Edit
            </button>
          </form>

          {editHistory.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-blue-900/80 dark:text-blue-200/80">
              <span className="font-semibold">Recent edits:</span>
              {editHistory.slice(0, 3).map((item, i) => (
                <span
                  key={`${item}-${i}`}
                  className="rounded bg-white/80 px-2 py-0.5 dark:bg-slate-900/70"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Preview OR Code View */}
        {viewMode === 'preview' ? (
          <div className="mt-4 flex justify-center rounded-2xl border border-slate-200 bg-slate-100 p-3 dark:border-slate-800 dark:bg-slate-950">
            <div
              className={`overflow-hidden rounded-xl border border-slate-300 bg-white shadow-md transition-all dark:border-slate-700 ${
                viewport === 'mobile' ? 'w-[375px]' : 'w-full'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                <span className="font-mono">
                  https://{sanitizeFolderName(config.brandName)}.local/index.html
                </span>
                <span>{site.sourceLabel}</span>
              </div>
              <iframe
                title="Live Website Preview"
                srcDoc={previewSrcDoc}
                sandbox="allow-scripts allow-forms"
                className="h-[460px] w-full bg-white"
              />
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex gap-1.5">
                {(['html', 'css', 'js'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setCodeTab(tab)}
                    className={`rounded-xl border px-3 py-1.5 font-mono text-xs font-bold ${
                      codeTab === tab
                        ? 'border-blue-500 bg-blue-600 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {tab === 'html' ? 'index.html' : tab === 'css' ? 'styles.css' : 'script.js'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPlainEnglishMode((p) => !p)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold ${
                    plainEnglishMode
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200'
                      : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Explain in Plain English: {plainEnglishMode ? 'ON' : 'OFF'}
                </button>
                <button
                  type="button"
                  onClick={handleCopyActiveCode}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedCode ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-12">
              <pre
                className={`max-h-[420px] overflow-auto rounded-xl bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-100 ${
                  plainEnglishMode ? 'lg:col-span-8' : 'lg:col-span-12'
                }`}
              >
                {activeCodeText}
              </pre>

              {plainEnglishMode && (
                <div className="space-y-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30 lg:col-span-4">
                  <div className="text-xs font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                    Plain-English Code Guide ({codeTab.toUpperCase()})
                  </div>
                  {PLAIN_ENGLISH_GUIDES[codeTab].map((item) => (
                    <div
                      key={item.tag}
                      className="rounded-lg border border-emerald-200/80 bg-white p-2.5 text-xs dark:border-emerald-900/50 dark:bg-slate-900"
                    >
                      <code className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400">
                        {item.tag}
                      </code>
                      <p className="mt-1 text-slate-600 dark:text-slate-300">{item.meaning}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* STEP 4: EXPORT WEBSITE TO COMPUTER */}
      <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/30">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-emerald-950 dark:text-emerald-100">
              Step 4: Export Your Real Website to Your Computer
            </h2>
            <p className="mt-1 text-xs text-emerald-900/85 dark:text-emerald-200/85">
              Saves <code className="font-mono">index.html</code>, <code className="font-mono">styles.css</code>,{' '}
              <code className="font-mono">script.js</code>, and a beginner{' '}
              <code className="font-mono">HOW_TO_PUT_ONLINE.md</code> guide directly to your machine!
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-60"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Export Website to My Computer
            </button>

            {exportPath && (
              <button
                type="button"
                onClick={() => openPath(exportPath)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-400 bg-white px-3.5 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-50 dark:border-emerald-700 dark:bg-slate-900 dark:text-emerald-200"
              >
                <FolderOpen className="h-4 w-4" />
                Open Folder
              </button>
            )}
          </div>
        </div>

        {exportPath && (
          <div className="mt-3 rounded-xl border border-emerald-300 bg-white px-3.5 py-2.5 font-mono text-xs text-emerald-900 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-300">
            ✔ Saved successfully to: {exportPath}
          </div>
        )}
        {exportError && (
          <div className="mt-3 rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-800 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-200">
            {exportError}
          </div>
        )}
      </section>
    </div>
  );
};
