import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertOctagon,
  Bug,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Database,
  Download,
  Eye,
  FolderOpen,
  Layers,
  Loader2,
  Rocket,
  Sparkles,
  Terminal,
  Wrench,
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

type AppKind = 'habits' | 'expenses' | 'flashcards';
type AccentKey = 'emerald' | 'indigo' | 'amber' | 'rose';

interface AppCustomization {
  kind: AppKind;
  title: string;
  accent: AccentKey;
  enablePersistence: boolean;
  showStatsBar: boolean;
  includeSampleData: boolean;
}

interface ConsoleEntry {
  id: number;
  level: 'info' | 'error' | 'success';
  text: string;
}

interface GeneratedAppFiles {
  html: string;
  css: string;
  js: string;
  readme: string;
  bugErrorLine: string;
  bugExplanation: string;
  bugBefore: string;
  bugAfter: string;
}

const APP_PRESETS: Record<
  AppKind,
  {
    label: string;
    defaultTitle: string;
    tagline: string;
    dataModel: string;
    actions: string;
    storageKey: string;
  }
> = {
  habits: {
    label: 'Daily Habit Tracker',
    defaultTitle: 'My Daily Habit Tracker',
    tagline: 'Check off daily wins, grow streaks, and save progress automatically.',
    dataModel: 'Habit { id, name, streak, doneToday }[]',
    actions: 'addHabit(), toggleHabit(id), deleteHabit(id)',
    storageKey: 'zero2ai_habits_v1',
  },
  expenses: {
    label: 'Expense Splitter',
    defaultTitle: 'Trip Expense Splitter',
    tagline: 'Log shared group costs and instantly calculate fair per-person shares.',
    dataModel: 'Expense { id, item, payer, amount }[] + splitCount',
    actions: 'addExpense(), updateSplitCount(), removeExpense(id)',
    storageKey: 'zero2ai_expenses_v1',
  },
  flashcards: {
    label: 'Study Flashcards',
    defaultTitle: 'AI Study Flashcards',
    tagline: 'Flip interactive cards, mark mastered topics, and add your own cards.',
    dataModel: 'Card { id, front, back, mastered }[] + currentIndex',
    actions: 'flipCard(), markMastered(), addCard(), nextCard()',
    storageKey: 'zero2ai_flashcards_v1',
  },
};

const ACCENT_HEX: Record<AccentKey, { main: string; soft: string; label: string }> = {
  emerald: { main: '#059669', soft: '#ecfdf5', label: 'Emerald' },
  indigo: { main: '#4f46e5', soft: '#eef2ff', label: 'Indigo' },
  amber: { main: '#d97706', soft: '#fffbeb', label: 'Amber' },
  rose: { main: '#e11d48', soft: '#fff1f2', label: 'Rose' },
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildMiniAppFiles(cfg: AppCustomization, injectBug: boolean): GeneratedAppFiles {
  const accent = ACCENT_HEX[cfg.accent];
  const safeTitle = escapeHtml(cfg.title.trim() || APP_PRESETS[cfg.kind].defaultTitle);
  const storageKey = APP_PRESETS[cfg.kind].storageKey;

  const css = `:root {
  --accent: ${accent.main};
  --accent-soft: ${accent.soft};
  --bg: #f8fafc;
  --card: #ffffff;
  --text: #0f172a;
  --muted: #64748b;
  --border: #e2e8f0;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--bg); color: var(--text); padding: 20px; line-height: 1.5;
}
.app { max-width: 620px; margin: 0 auto; }
.header {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; margin-bottom: 16px;
}
.header h1 { font-size: 1.35rem; font-weight: 800; }
.badge {
  background: var(--accent-soft); color: var(--accent);
  border: 1px solid var(--border); padding: 4px 10px;
  border-radius: 999px; font-size: 0.72rem; font-weight: 700;
}
.stats {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px;
}
.stat-box {
  background: var(--card); border: 1px solid var(--border);
  border-radius: 12px; padding: 10px 12px; text-align: center;
}
.stat-val { font-size: 1.25rem; font-weight: 800; color: var(--accent); }
.stat-lbl { font-size: 0.72rem; color: var(--muted); }
.card {
  background: var(--card); border: 1px solid var(--border);
  border-radius: 14px; padding: 16px; margin-bottom: 14px;
}
.row { display: flex; gap: 8px; flex-wrap: wrap; }
input {
  flex: 1; min-width: 120px; padding: 9px 12px; border-radius: 10px;
  border: 1px solid var(--border); font: inherit; font-size: 0.88rem;
}
button {
  background: var(--accent); color: #fff; border: none; border-radius: 10px;
  padding: 9px 14px; font-weight: 700; font-size: 0.85rem; cursor: pointer;
}
button:hover { opacity: 0.92; }
button.ghost {
  background: #f1f5f9; color: var(--text); border: 1px solid var(--border);
}
button.danger { background: #fee2e2; color: #b91c1c; padding: 6px 10px; font-size: 0.75rem; }
.list { display: grid; gap: 8px; margin-top: 12px; }
.item {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  padding: 10px 12px; border: 1px solid var(--border); border-radius: 12px; background: #fff;
}
.item.done { background: var(--accent-soft); border-color: var(--accent); }
.item-title { font-weight: 700; font-size: 0.92rem; }
.item-sub { font-size: 0.76rem; color: var(--muted); }
.flashcard {
  min-height: 150px; display: flex; flex-direction: column;
  align-items: center; justify-content: center; text-align: center;
  border: 2px dashed var(--accent); border-radius: 16px; padding: 20px;
  background: var(--accent-soft); cursor: pointer; margin-bottom: 12px;
}
.error-banner {
  background: #fef2f2; border: 1px solid #fca5a5; color: #991b1b;
  border-radius: 12px; padding: 12px; font-size: 0.82rem; font-family: monospace; margin-bottom: 12px;
}`;

  const bridgeHelper = `function notifyHost(type, payload) {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ source: 'zero2ai-app-preview', type, payload }, '*');
    }
  } catch (e) {}
}

function safeLoad(key, fallback) {
  ${cfg.enablePersistence ? `try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) { return fallback; }` : 'return fallback;'}
}

function safeSave(key, data) {
  ${cfg.enablePersistence ? `try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {}` : ''}
  notifyHost('state', { storageKey: key, persisted: ${cfg.enablePersistence ? 'true' : 'false'}, data });
}`;

  if (cfg.kind === 'habits') {
    const sample = cfg.includeSampleData
      ? `[
  { id: 1, name: 'Read 10 mins of AI Varsity', streak: 3, doneToday: true },
  { id: 2, name: 'Build one tiny prompt experiment', streak: 2, doneToday: false },
  { id: 3, name: 'Drink 2L of water', streak: 5, doneToday: false }
]`
      : '[]';

    const bugErrorLine = `TypeError: Cannot read properties of undefined (reading 'doneToday') at app.js:24`;
    const bugBefore = `// BUGGY CODE (line 24): reads habits[habits.length].doneToday (off-by-one!)
const latestDone = habits[habits.length].doneToday;`;
    const bugAfter = `// FIXED CODE (line 24): reads each valid habit safely!
const doneCount = habits.filter((h) => h.doneToday).length;`;

    const js = `${bridgeHelper}

const STORAGE_KEY = '${storageKey}';
let habits = safeLoad(STORAGE_KEY, ${sample});

function render() {
  const errEl = document.getElementById('error-box');
  try {
    ${
      injectBug
        ? `// Injected realistic off-by-one bug for Debug Like a Pro challenge!
    const latestDone = habits[habits.length].doneToday;
    const doneCount = latestDone ? 1 : 0;`
        : `const doneCount = habits.filter((h) => h.doneToday).length;`
    }
    const pct = habits.length ? Math.round((doneCount / habits.length) * 100) : 0;
    const bestStreak = habits.reduce((m, h) => Math.max(m, h.streak), 0);

    const statsEl = document.getElementById('stats');
    if (statsEl) {
      statsEl.innerHTML =
        '<div class="stat-box"><div class="stat-val">' + doneCount + '/' + habits.length + '</div><div class="stat-lbl">Done Today</div></div>' +
        '<div class="stat-box"><div class="stat-val">' + pct + '%</div><div class="stat-lbl">Daily Goal</div></div>' +
        '<div class="stat-box"><div class="stat-val">' + bestStreak + 'd</div><div class="stat-lbl">Best Streak</div></div>';
    }

    const listEl = document.getElementById('habit-list');
    if (habits.length === 0) {
      listEl.innerHTML = '<p class="item-sub">No habits yet — add your first habit above!</p>';
    } else {
      listEl.innerHTML = habits.map((h) =>
        '<div class="item ' + (h.doneToday ? 'done' : '') + '">' +
          '<div><div class="item-title">' + (h.doneToday ? '✅ ' : '⬜ ') + h.name + '</div>' +
          '<div class="item-sub">🔥 Streak: ' + h.streak + ' days</div></div>' +
          '<div class="row">' +
            '<button type="button" class="ghost" onclick="toggleHabit(' + h.id + ')">' + (h.doneToday ? 'Undo' : 'Check Off') + '</button>' +
            '<button type="button" class="danger" onclick="removeHabit(' + h.id + ')">Delete</button>' +
          '</div>' +
        '</div>'
      ).join('');
    }
    errEl.style.display = 'none';
    safeSave(STORAGE_KEY, habits);
  } catch (err) {
    const msg = 'TypeError: Cannot read properties of undefined (reading \\'doneToday\\') at app.js:24';
    errEl.style.display = 'block';
    errEl.textContent = 'Runtime Crash: ' + msg;
    notifyHost('error', msg);
  }
}

window.toggleHabit = function(id) {
  habits = habits.map((h) => h.id === id ? { ...h, doneToday: !h.doneToday, streak: h.doneToday ? Math.max(0, h.streak - 1) : h.streak + 1 } : h);
  notifyHost('interaction', 'Toggled habit #' + id);
  render();
};

window.removeHabit = function(id) {
  habits = habits.filter((h) => h.id !== id);
  notifyHost('interaction', 'Removed habit #' + id);
  render();
};

document.getElementById('add-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const input = document.getElementById('habit-input');
  const name = input.value.trim();
  if (!name) return;
  habits.unshift({ id: Date.now(), name, streak: 1, doneToday: false });
  input.value = '';
  notifyHost('interaction', 'Added habit: ' + name);
  render();
});

render();`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle}</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="app">
    <div class="header">
      <h1>${safeTitle}</h1>
      <span class="badge">${cfg.enablePersistence ? 'Auto-Saved' : 'Session Only'}</span>
    </div>
    <div id="error-box" class="error-banner" style="display:none"></div>
    ${cfg.showStatsBar ? '<div id="stats" class="stats"></div>' : ''}
    <div class="card">
      <form id="add-form" class="row">
        <input id="habit-input" type="text" placeholder="Add a new daily habit (e.g., 15m walk)..." required />
        <button type="submit">+ Add Habit</button>
      </form>
      <div id="habit-list" class="list"></div>
    </div>
  </div>
  <script src="app.js"></script>
</body>
</html>`;

    return {
      html,
      css,
      js,
      readme: `# ${cfg.title}\n\nStandalone Daily Habit Tracker built in Zero2AI Studio.\nDouble-click \`index.html\` to run it in any browser!\n`,
      bugErrorLine,
      bugExplanation:
        'Classic off-by-one array bug! Inside habits.filter(), the code accessed habits[i + 1]. On the very last item in the array, habits[i + 1] is undefined — so reading .doneToday crashes the app. Reading h.doneToday fixes it cleanly.',
      bugBefore,
      bugAfter,
    };
  }

  if (cfg.kind === 'expenses') {
    const sample = cfg.includeSampleData
      ? `[
  { id: 1, item: 'Pizza Dinner', payer: 'Maya', amount: 48 },
  { id: 2, item: 'Airport Uber', payer: 'Sam', amount: 36 }
]`
      : '[]';

    const bugErrorLine = `ReferenceError: calculateTotalSpend is not defined at app.js:18`;
    const bugBefore = `// BUGGY CODE (line 18): typo in function name!
const total = calculateTotalSpend(state.expenses);`;
    const bugAfter = `// FIXED CODE (line 18): compute sum directly with reduce()
const total = state.expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);`;

    const js = `${bridgeHelper}

const STORAGE_KEY = '${storageKey}';
let state = safeLoad(STORAGE_KEY, { people: 3, expenses: ${sample} });

function render() {
  const errEl = document.getElementById('error-box');
  try {
    ${
      injectBug
        ? `// Injected realistic typo bug for Debug Like a Pro challenge!
    const total = calculateTotalSpend(state.expenses);`
        : `const total = state.expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);`
    }
    const perPerson = state.people > 0 ? total / state.people : 0;

    const statsEl = document.getElementById('stats');
    if (statsEl) {
      statsEl.innerHTML =
        '<div class="stat-box"><div class="stat-val">$' + total.toFixed(2) + '</div><div class="stat-lbl">Group Total</div></div>' +
        '<div class="stat-box"><div class="stat-val">' + state.people + '</div><div class="stat-lbl">People</div></div>' +
        '<div class="stat-box"><div class="stat-val">$' + perPerson.toFixed(2) + '</div><div class="stat-lbl">Each Pays</div></div>';
    }

    document.getElementById('people-input').value = state.people;
    const listEl = document.getElementById('expense-list');
    if (state.expenses.length === 0) {
      listEl.innerHTML = '<p class="item-sub">No shared expenses yet — add one above!</p>';
    } else {
      listEl.innerHTML = state.expenses.map((ex) =>
        '<div class="item">' +
          '<div><div class="item-title">' + ex.item + ' — $' + Number(ex.amount).toFixed(2) + '</div>' +
          '<div class="item-sub">Paid by ' + ex.payer + ' • Share: $' + (Number(ex.amount) / Math.max(1, state.people)).toFixed(2) + '/person</div></div>' +
          '<button type="button" class="danger" onclick="removeExpense(' + ex.id + ')">Remove</button>' +
        '</div>'
      ).join('');
    }
    errEl.style.display = 'none';
    safeSave(STORAGE_KEY, state);
  } catch (err) {
    const msg = 'ReferenceError: calculateTotalSpend is not defined at app.js:18';
    errEl.style.display = 'block';
    errEl.textContent = 'Runtime Crash: ' + msg;
    notifyHost('error', msg);
  }
}

window.removeExpense = function(id) {
  state.expenses = state.expenses.filter((e) => e.id !== id);
  notifyHost('interaction', 'Removed expense #' + id);
  render();
};

document.getElementById('people-input').addEventListener('change', function(e) {
  state.people = Math.max(1, Number(e.target.value) || 1);
  notifyHost('interaction', 'Changed group size to ' + state.people);
  render();
});

document.getElementById('expense-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const item = document.getElementById('ex-item').value.trim();
  const payer = document.getElementById('ex-payer').value.trim() || 'Alex';
  const amount = Number(document.getElementById('ex-amount').value);
  if (!item || isNaN(amount) || amount <= 0) return;
  state.expenses.unshift({ id: Date.now(), item, payer, amount });
  e.target.reset();
  notifyHost('interaction', 'Added expense: ' + item + ' ($' + amount + ')');
  render();
});

render();`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle}</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="app">
    <div class="header">
      <h1>${safeTitle}</h1>
      <span class="badge">${cfg.enablePersistence ? 'Auto-Saved' : 'Session Only'}</span>
    </div>
    <div id="error-box" class="error-banner" style="display:none"></div>
    ${cfg.showStatsBar ? '<div id="stats" class="stats"></div>' : ''}
    <div class="card">
      <div class="row" style="margin-bottom:10px;align-items:center;">
        <label for="people-input" style="font-size:0.82rem;font-weight:700;">Split Between People:</label>
        <input id="people-input" type="number" min="1" max="50" style="max-width:90px;" value="3" />
      </div>
      <form id="expense-form" class="row">
        <input id="ex-item" type="text" placeholder="Item (e.g., Coffee)" required />
        <input id="ex-payer" type="text" placeholder="Paid by" required />
        <input id="ex-amount" type="number" step="0.01" min="0.01" placeholder="$ Amount" required style="max-width:110px;" />
        <button type="submit">+ Add</button>
      </form>
      <div id="expense-list" class="list"></div>
    </div>
  </div>
  <script src="app.js"></script>
</body>
</html>`;

    return {
      html,
      css,
      js,
      readme: `# ${cfg.title}\n\nStandalone Expense Splitter built in Zero2AI Studio.\nOpen \`index.html\` in your browser to split bills cleanly!\n`,
      bugErrorLine,
      bugExplanation:
        'A ReferenceError means JavaScript tried to call a function name that does not exist (often a typo or missing helper). Replacing calculateTotalSpend(...) with state.expenses.reduce(...) fixes the crash immediately.',
      bugBefore,
      bugAfter,
    };
  }

  // Study Flashcards
  const sample = cfg.includeSampleData
    ? `[
  { id: 1, front: 'What is a Token in AI?', back: 'A small chunk of text (about 3–4 letters in English) that AI converts into numbers.', mastered: false },
  { id: 2, front: 'What is an AI Harness?', back: 'The app wrapper around a model that gives it tools, memory rules, and safety approvals.', mastered: false },
  { id: 3, front: 'Why put .env inside .gitignore?', back: 'So your private API keys never get uploaded to public GitHub!', mastered: true }
]`
    : `[
  { id: 1, front: 'Add your first flashcard below!', back: 'Click this card to flip between question & answer.', mastered: false }
]`;

  const bugErrorLine = `TypeError: Cannot read properties of undefined (reading 'front') at app.js:22`;
  const bugBefore = `// BUGGY CODE (line 22): index goes past the end of the deck!
const card = deck[currentIndex + 99];`;
  const bugAfter = `// FIXED CODE (line 22): safely wrap index inside deck bounds!
const card = deck[currentIndex % deck.length];`;

  const js = `${bridgeHelper}

const STORAGE_KEY = '${storageKey}';
let deck = safeLoad(STORAGE_KEY, ${sample});
let currentIndex = 0;
let showingBack = false;

function render() {
  const errEl = document.getElementById('error-box');
  try {
    const masteredCount = deck.filter((c) => c.mastered).length;
    const statsEl = document.getElementById('stats');
    if (statsEl) {
      statsEl.innerHTML =
        '<div class="stat-box"><div class="stat-val">' + deck.length + '</div><div class="stat-lbl">Total Cards</div></div>' +
        '<div class="stat-box"><div class="stat-val">' + masteredCount + '</div><div class="stat-lbl">Mastered</div></div>' +
        '<div class="stat-box"><div class="stat-val">' + (deck.length ? Math.round((masteredCount / deck.length) * 100) : 0) + '%</div><div class="stat-lbl">Progress</div></div>';
    }

    ${
      injectBug
        ? `// Injected out-of-bounds bug for Debug Like a Pro challenge!
    const card = deck[currentIndex + 99];`
        : `const card = deck[currentIndex % Math.max(1, deck.length)];`
    }

    const stage = document.getElementById('card-stage');
    stage.innerHTML =
      '<div style="font-size:0.72rem;font-weight:800;text-transform:uppercase;color:var(--accent);margin-bottom:6px;">' +
      (showingBack ? 'Answer (Click to flip)' : 'Question ' + ((currentIndex % deck.length) + 1) + ' of ' + deck.length + ' (Click to flip)') +
      (card.mastered ? ' • ⭐ Mastered' : '') + '</div>' +
      '<div style="font-size:1.05rem;font-weight:700;">' + (showingBack ? card.back : card.front) + '</div>';

    errEl.style.display = 'none';
    safeSave(STORAGE_KEY, deck);
  } catch (err) {
    const msg = "TypeError: Cannot read properties of undefined (reading 'front') at app.js:22";
    errEl.style.display = 'block';
    errEl.textContent = 'Runtime Crash: ' + msg;
    notifyHost('error', msg);
  }
}

document.getElementById('card-stage').addEventListener('click', function() {
  showingBack = !showingBack;
  notifyHost('interaction', 'Flipped flashcard');
  render();
});

document.getElementById('next-btn').addEventListener('click', function() {
  currentIndex = (currentIndex + 1) % Math.max(1, deck.length);
  showingBack = false;
  notifyHost('interaction', 'Moved to next card');
  render();
});

document.getElementById('master-btn').addEventListener('click', function() {
  const idx = currentIndex % Math.max(1, deck.length);
  if (deck[idx]) {
    deck[idx].mastered = !deck[idx].mastered;
    notifyHost('interaction', 'Toggled mastered on card #' + (idx + 1));
    render();
  }
});

document.getElementById('card-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const front = document.getElementById('fc-front').value.trim();
  const back = document.getElementById('fc-back').value.trim();
  if (!front || !back) return;
  deck.push({ id: Date.now(), front, back, mastered: false });
  currentIndex = deck.length - 1;
  showingBack = false;
  e.target.reset();
  notifyHost('interaction', 'Added new flashcard');
  render();
});

render();`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle}</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="app">
    <div class="header">
      <h1>${safeTitle}</h1>
      <span class="badge">${cfg.enablePersistence ? 'Auto-Saved' : 'Session Only'}</span>
    </div>
    <div id="error-box" class="error-banner" style="display:none"></div>
    ${cfg.showStatsBar ? '<div id="stats" class="stats"></div>' : ''}
    <div class="card">
      <div id="card-stage" class="flashcard" role="button" tabindex="0"></div>
      <div class="row" style="justify-content:space-between;margin-bottom:14px;">
        <button id="master-btn" type="button" class="ghost">⭐ Toggle Mastered</button>
        <button id="next-btn" type="button">Next Card →</button>
      </div>
      <form id="card-form" class="row">
        <input id="fc-front" type="text" placeholder="New question..." required />
        <input id="fc-back" type="text" placeholder="Answer..." required />
        <button type="submit">+ Add Card</button>
      </form>
    </div>
  </div>
  <script src="app.js"></script>
</body>
</html>`;

  return {
    html,
    css,
    js,
    readme: `# ${cfg.title}\n\nStandalone Study Flashcards app built in Zero2AI Studio.\nOpen \`index.html\` in any browser to study offline!\n`,
    bugErrorLine,
    bugExplanation:
      'Out-of-bounds index bug! Trying to read deck[currentIndex + 99] returned undefined, so reading card.front threw a TypeError. Wrapping with currentIndex % deck.length keeps the index valid every time.',
    bugBefore,
    bugAfter,
  };
}

export const AppBuilderLab: React.FC<LabProps> = ({
  onCompleteLab,
  completedLabs,
  apiConfig,
  onOpenSettings,
}) => {
  const [config, setConfig] = useState<AppCustomization>({
    kind: 'habits',
    title: APP_PRESETS.habits.defaultTitle,
    accent: 'emerald',
    enablePersistence: true,
    showStatsBar: true,
    includeSampleData: true,
  });

  const [bugActive, setBugActive] = useState<boolean>(false);
  const [copiedBug, setCopiedBug] = useState<boolean>(false);
  const [aiDiagnosis, setAiDiagnosis] = useState<string | null>(null);
  const [diagnosing, setDiagnosing] = useState<boolean>(false);
  const [renderNonce, setRenderNonce] = useState<number>(0);

  const [liveStateJson, setLiveStateJson] = useState<string>(
    'Interact with your live app to watch saved state update in real time!'
  );
  const [consoleLogs, setConsoleLogs] = useState<ConsoleEntry[]>([
    { id: 1, level: 'info', text: 'App sandbox initialized cleanly (0 errors).' },
  ]);

  const [studioTab, setStudioTab] = useState<'preview' | 'code'>('preview');
  const [codeTab, setCodeTab] = useState<'html' | 'js' | 'css'>('js');

  const [exportPath, setExportPath] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Mission tracking
  const [didGenerate, setDidGenerate] = useState<boolean>(false);
  const [didInteract, setDidInteract] = useState<boolean>(false);
  const [didFixBug, setDidFixBug] = useState<boolean>(false);
  const [didExport, setDidExport] = useState<boolean>(false);

  const files = useMemo(() => buildMiniAppFiles(config, bugActive), [config, bugActive]);

  const srcDoc = useMemo(() => {
    return files.html
      .replace(
        /<link[^>]*href=["']styles\.css["'][^>]*>/i,
        `<style>\n${files.css}\n</style>`
      )
      .replace(
        /<script[^>]*src=["']app\.js["'][^>]*>\s*<\/script>/i,
        `<script>\n${files.js}\n</script>`
      );
  }, [files]);

  // Listen for live state / error events from iframe preview
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const msg = event.data as {
        source?: string;
        type?: 'state' | 'interaction' | 'error';
        payload?: unknown;
      };
      if (!msg || msg.source !== 'zero2ai-app-preview') return;

      if (msg.type === 'state') {
        try {
          setLiveStateJson(JSON.stringify(msg.payload, null, 2));
        } catch {
          // ignore
        }
      } else if (msg.type === 'interaction') {
        setDidInteract(true);
        setConsoleLogs((prev) => [
          ...prev.slice(-14),
          { id: Date.now() + Math.random(), level: 'info', text: `Action: ${String(msg.payload)}` },
        ]);
      } else if (msg.type === 'error') {
        setConsoleLogs((prev) => [
          ...prev.slice(-14),
          { id: Date.now() + Math.random(), level: 'error', text: String(msg.payload) },
        ]);
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const handleChooseKind = (kind: AppKind) => {
    setBugActive(false);
    setAiDiagnosis(null);
    setCopiedBug(false);
    setConfig((prev) => ({
      ...prev,
      kind,
      title: APP_PRESETS[kind].defaultTitle,
    }));
    setRenderNonce((n) => n + 1);
    setConsoleLogs([
      {
        id: Date.now(),
        level: 'info',
        text: `Switched template to ${APP_PRESETS[kind].label} (0 errors).`,
      },
    ]);
  };

  const handleGenerateApp = () => {
    setBugActive(false);
    setAiDiagnosis(null);
    setDidGenerate(true);
    setRenderNonce((n) => n + 1);
    setConsoleLogs((prev) => [
      ...prev.slice(-10),
      {
        id: Date.now(),
        level: 'success',
        text: `Generated "${config.title}" with ${config.enablePersistence ? 'localStorage persistence' : 'session memory'}.`,
      },
    ]);
  };

  const handleInjectBug = () => {
    setBugActive(true);
    setAiDiagnosis(null);
    setCopiedBug(false);
    setStudioTab('preview');
    setRenderNonce((n) => n + 1);
    setConsoleLogs((prev) => [
      ...prev.slice(-10),
      {
        id: Date.now(),
        level: 'error',
        text: files.bugErrorLine,
      },
    ]);
  };

  const handleCopyBugError = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(files.bugErrorLine).catch(() => {});
    }
    setCopiedBug(true);
  };

  const handleDiagnoseWithAi = async () => {
    setDiagnosing(true);
    if (isByokReady(apiConfig)) {
      const req = buildProviderCallRequest(
        apiConfig,
        `A beginner hit this JavaScript error in their mini-app:\nError: ${files.bugErrorLine}\nCode:\n${files.bugBefore}\nExplain what went wrong in 2 short beginner-friendly sentences.`,
        'You are a patient coding mentor for non-technical beginners.'
      );
      const res = await testProviderCall(req);
      if (res.ok && res.text) {
        setAiDiagnosis(`${res.text.trim()}\n\n(Diagnosed live via ${apiConfig.provider.toUpperCase()})`);
        setDiagnosing(false);
        return;
      }
    }
    await new Promise((r) => setTimeout(r, 280));
    setAiDiagnosis(files.bugExplanation);
    setDiagnosing(false);
  };

  const handleApplyFix = () => {
    setBugActive(false);
    setDidFixBug(true);
    setRenderNonce((n) => n + 1);
    setConsoleLogs((prev) => [
      ...prev.slice(-10),
      {
        id: Date.now(),
        level: 'success',
        text: '✔ Applied AI patch cleanly — 0 console errors! App is live again.',
      },
    ]);
  };

  const handleExportApp = async () => {
    setIsExporting(true);
    setExportError(null);
    const cleanFiles = buildMiniAppFiles(config, false);
    const slug = sanitizeFolderName(config.title || config.kind);
    const res = await exportProject(slug, {
      'index.html': cleanFiles.html,
      'styles.css': cleanFiles.css,
      'app.js': cleanFiles.js,
      'README.md': cleanFiles.readme,
    });
    setIsExporting(false);
    if (res.ok) {
      setExportPath(res.path);
      setDidExport(true);
    } else {
      setExportError(res.error || 'Failed to export app.');
    }
  };

  const presetInfo = APP_PRESETS[config.kind];

  const missionSteps = [
    {
      id: 'gen-app',
      label: 'Customize your app options & click "Generate Working App"',
      done: didGenerate,
    },
    {
      id: 'interact',
      label: 'Click inside the live app (add/toggle an item) to watch App Memory update',
      done: didInteract,
    },
    {
      id: 'debug',
      label: 'Complete "Debug Like a Pro": Inject Bug → Diagnose → Apply AI Fix',
      done: didFixBug,
    },
    {
      id: 'export-app',
      label: 'Export your standalone working app to your computer',
      done: didExport,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <LabHeader
        badge="Lab 6 • App Builder"
        title="Build Your First Stateful App with AI"
        subtitle="Go beyond static brochures: design a Data Model + Interactive UI + LocalStorage persistence, and practice debugging like a pro!"
        xpReward={100}
        isCompleted={completedLabs.includes('app-builder')}
        apiConfig={apiConfig}
        onOpenSettings={onOpenSettings}
        accent="rose"
        icon={<Rocket className="h-6 w-6" />}
      />

      <MissionChecklist
        labId="app-builder"
        xpReward={100}
        steps={missionSteps}
        completedLabs={completedLabs}
        onCompleteLab={onCompleteLab}
      />

      {/* WEBSITE VS REAL APP EXPLAINER */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
          <div className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Static Website (Lab 5)
          </div>
          <div className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
            Like a Printed Storefront Brochure
          </div>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
            Shows the same info to every visitor (Hero, Menu, About). Refresh the page and everything looks identical.
          </p>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4 shadow-sm dark:border-rose-900/60 dark:bg-rose-950/30">
          <div className="text-xs font-bold uppercase tracking-wide text-rose-600 dark:text-rose-400">
            Real Stateful App (Lab 6)
          </div>
          <div className="mt-1 text-sm font-bold text-rose-950 dark:text-rose-100">
            Data Model + Interactive UI + Memory (localStorage)
          </div>
          <p className="mt-1 text-xs text-rose-900/85 dark:text-rose-200/85">
            Remembers YOUR habits, expenses, or flashcards as structured data, updates the screen whenever data changes, and saves locally!
          </p>
        </div>
      </div>

      {/* STEP 1: CHOOSE & CUSTOMIZE APP */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Step 1: Choose & Customize Your Mini-App
            </h2>

            <div className="grid gap-2.5 sm:grid-cols-3">
              {(Object.keys(APP_PRESETS) as AppKind[]).map((kind) => {
                const active = config.kind === kind;
                return (
                  <button
                    key={kind}
                    type="button"
                    onClick={() => handleChooseKind(kind)}
                    className={`rounded-xl border p-3 text-left transition ${
                      active
                        ? 'border-rose-500 bg-rose-50 ring-1 ring-rose-500 dark:border-rose-400 dark:bg-rose-950/50'
                        : 'border-slate-200 bg-slate-50/70 hover:border-rose-300 dark:border-slate-700 dark:bg-slate-800/50'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {APP_PRESETS[kind].label}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                      {APP_PRESETS[kind].tagline}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="ab-title"
                  className="text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  App Name
                </label>
                <input
                  id="ab-title"
                  type="text"
                  value={config.title}
                  onChange={(e) => setConfig((p) => ({ ...p, title: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-rose-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Accent Color
                </div>
                <div className="mt-1.5 flex gap-2">
                  {(Object.keys(ACCENT_HEX) as AccentKey[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setConfig((p) => ({ ...p, accent: key }))}
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold ${
                        config.accent === key
                          ? 'border-slate-900 bg-slate-100 dark:border-white dark:bg-slate-800'
                          : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900'
                      }`}
                    >
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ background: ACCENT_HEX[key].main }}
                      />
                      <span className="text-slate-800 dark:text-slate-200">
                        {ACCENT_HEX[key].label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  ['enablePersistence', 'Save in localStorage'],
                  ['showStatsBar', 'Summary Stats Bar'],
                  ['includeSampleData', 'Starter Sample Data'],
                ] as const
              ).map(([field, label]) => {
                const enabled = config[field];
                return (
                  <button
                    key={field}
                    type="button"
                    onClick={() => setConfig((p) => ({ ...p, [field]: !p[field] }))}
                    className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                      enabled
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200'
                        : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {enabled && <Check className="h-3.5 w-3.5" />}
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* APP ARCHITECTURE BLUEPRINT */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/60 lg:col-span-5">
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <Layers className="h-4 w-4 text-rose-500" />
                App Architecture Blueprint
              </div>
              <div className="rounded-lg bg-white p-2.5 dark:bg-slate-900">
                <div className="text-[10px] font-bold uppercase text-slate-400">1. Data Model</div>
                <code className="font-mono text-[11px] text-rose-600 dark:text-rose-400">
                  {presetInfo.dataModel}
                </code>
              </div>
              <div className="rounded-lg bg-white p-2.5 dark:bg-slate-900">
                <div className="text-[10px] font-bold uppercase text-slate-400">2. UI Actions</div>
                <code className="font-mono text-[11px] text-blue-600 dark:text-blue-400">
                  {presetInfo.actions}
                </code>
              </div>
              <div className="rounded-lg bg-white p-2.5 dark:bg-slate-900">
                <div className="text-[10px] font-bold uppercase text-slate-400">
                  3. Persistence Key
                </div>
                <code className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                  localStorage[&quot;{presetInfo.storageKey}&quot;]
                </code>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateApp}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-rose-500"
            >
              <Sparkles className="h-4 w-4" />
              Generate Working App
            </button>
          </div>
        </div>
      </section>

      {/* STEP 2: LIVE APP SANDBOX + MEMORY & CONSOLE INSPECTOR */}
      <div className="grid gap-5 lg:grid-cols-12">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Step 2: Test Your Live Interactive App
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click buttons, add real items, and verify everything works inside the sandbox!
              </p>
            </div>
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setStudioTab('preview')}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold ${
                  studioTab === 'preview'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                    : 'text-slate-500'
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                Live App
              </button>
              <button
                type="button"
                onClick={() => setStudioTab('code')}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold ${
                  studioTab === 'code'
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white'
                    : 'text-slate-500'
                }`}
              >
                <Code2 className="h-3.5 w-3.5" />
                Code
              </button>
            </div>
          </div>

          {studioTab === 'preview' ? (
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-inner dark:border-slate-700">
              <iframe
                key={`${config.kind}-${bugActive ? 'bug' : 'ok'}-${renderNonce}`}
                title="Live Stateful Mini-App Preview"
                srcDoc={srcDoc}
                sandbox="allow-scripts allow-same-origin allow-forms"
                className="h-[420px] w-full bg-white"
              />
            </div>
          ) : (
            <div className="mt-4 space-y-2.5">
              <div className="flex gap-1.5">
                {(['js', 'html', 'css'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setCodeTab(t)}
                    className={`rounded-lg border px-2.5 py-1 font-mono text-xs font-bold ${
                      codeTab === t
                        ? 'border-rose-500 bg-rose-600 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {t === 'js' ? 'app.js' : t === 'html' ? 'index.html' : 'styles.css'}
                  </button>
                ))}
              </div>
              <pre className="h-[378px] overflow-auto rounded-xl bg-slate-950 p-3.5 font-mono text-[11px] leading-relaxed text-slate-100">
                {codeTab === 'js' ? files.js : codeTab === 'html' ? files.html : files.css}
              </pre>
            </div>
          )}
        </section>

        {/* RIGHT: DEBUG LIKE A PRO + LIVE DATA & CONSOLE */}
        <section className="flex flex-col gap-4 lg:col-span-5">
          {/* Debug Like a Pro Challenge */}
          <div className="rounded-2xl border border-amber-300 bg-amber-50/70 p-4 shadow-sm dark:border-amber-800/80 dark:bg-amber-950/30">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-950 dark:text-amber-100">
                <Bug className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                &quot;Debug Like a Pro&quot; Challenge
              </div>
              {didFixBug && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <CheckCircle2 className="h-3 w-3" />
                  Bug Squashed!
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-amber-900/90 dark:text-amber-200/90">
              Every app hits bugs! Pro AI builders don&apos;t panic or say &quot;it broke&quot; — they copy the{' '}
              <strong>exact Console error</strong> and ask AI to explain & patch it.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleInjectBug}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white hover:bg-rose-500"
              >
                <AlertOctagon className="h-3.5 w-3.5" />
                {bugActive ? 'Bug Active (Re-trigger)' : '1. Inject Realistic Bug'}
              </button>

              {bugActive && (
                <button
                  type="button"
                  onClick={handleCopyBugError}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400 bg-white px-3 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 dark:border-amber-700 dark:bg-slate-900 dark:text-amber-200"
                >
                  {copiedBug ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedBug ? 'Error Copied!' : '2. Copy Exact Error'}
                </button>
              )}
            </div>

            {bugActive && (
              <div className="mt-3 space-y-2.5">
                <button
                  type="button"
                  onClick={handleDiagnoseWithAi}
                  disabled={diagnosing}
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400"
                >
                  {diagnosing ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Wrench className="h-3.5 w-3.5" />
                  )}
                  3. Ask AI to Explain & Patch This Error
                </button>

                {aiDiagnosis && (
                  <div className="space-y-2 rounded-xl border border-emerald-300 bg-white p-3 text-xs dark:border-emerald-800 dark:bg-slate-900">
                    <div className="font-bold text-emerald-700 dark:text-emerald-400">
                      AI Diagnosis & Patch:
                    </div>
                    <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-200">
                      {aiDiagnosis}
                    </p>
                    <pre className="overflow-x-auto rounded-lg bg-rose-950/90 p-2 font-mono text-[10px] text-rose-200">
                      - {files.bugBefore}
                    </pre>
                    <pre className="overflow-x-auto rounded-lg bg-emerald-950/90 p-2 font-mono text-[10px] text-emerald-200">
                      + {files.bugAfter}
                    </pre>
                    <button
                      type="button"
                      onClick={handleApplyFix}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-500"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      4. Apply AI Fix & Retest App
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Simulated Console Panel */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5 text-slate-100">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
              <Terminal className="h-3.5 w-3.5 text-amber-400" />
              Simulated Console Panel
            </div>
            <div className="mt-2 max-h-32 space-y-1 overflow-y-auto font-mono text-[11px]">
              {consoleLogs.map((log) => (
                <div
                  key={log.id}
                  className={
                    log.level === 'error'
                      ? 'rounded bg-rose-950/90 px-2 py-1 text-rose-300'
                      : log.level === 'success'
                        ? 'text-emerald-400'
                        : 'text-slate-300'
                  }
                >
                  {log.level === 'error' ? '✖ ' : log.level === 'success' ? '✔ ' : '› '}
                  {log.text}
                </div>
              ))}
            </div>
          </div>

          {/* Live App Memory Inspector */}
          <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
              <Database className="h-3.5 w-3.5 text-emerald-500" />
              Live App Memory (Saved JSON State)
            </div>
            <pre className="mt-2 max-h-36 overflow-auto rounded-xl bg-slate-950 p-3 font-mono text-[10px] leading-relaxed text-emerald-300">
              {liveStateJson}
            </pre>
          </div>
        </section>
      </div>

      {/* STEP 4: EXPORT WORKING APP */}
      <section className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/30">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-emerald-950 dark:text-emerald-100">
              Export Your Standalone Working App
            </h2>
            <p className="mt-1 text-xs text-emerald-900/85 dark:text-emerald-200/85">
              Saves <code className="font-mono">index.html</code>, <code className="font-mono">styles.css</code>,{' '}
              <code className="font-mono">app.js</code>, and <code className="font-mono">README.md</code> into your projects folder — open it offline anytime!
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExportApp}
              disabled={isExporting}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-60"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Export Working App
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
            ✔ Exported standalone app to: {exportPath}
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
