import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const curriculumPath = resolve(__dirname, '..', 'dist', 'curriculum.json');

const raw = readFileSync(curriculumPath, 'utf8');
const data = JSON.parse(raw);

const EXPECTED_MODULES = [
  { id: 'mod-1-what-is-ai', accentHex: '#10B981', recommendedLabId: null },
  { id: 'mod-2-tokens-prompts', accentHex: '#3B82F6', recommendedLabId: 'tokenizer' },
  { id: 'mod-3-credits-keys', accentHex: '#F59E0B', recommendedLabId: 'api-credits' },
  { id: 'mod-4-harnesses-agents', accentHex: '#8B5CF6', recommendedLabId: 'harness-agent' },
  { id: 'mod-5-claude-cli', accentHex: '#EC4899', recommendedLabId: 'claude-cli' },
  { id: 'mod-6-build-website', accentHex: '#06B6D4', recommendedLabId: 'website-builder' },
  { id: 'mod-7-build-app', accentHex: '#F97316', recommendedLabId: 'app-builder' }
];

const EXPECTED_LAB_IDS = [
  'tokenizer',
  'api-credits',
  'harness-agent',
  'claude-cli',
  'website-builder',
  'app-builder'
];

const VALID_CALLOUT_TYPES = new Set(['tip', 'myth', 'example', 'warning']);
const VALID_QUIZ_TYPES = new Set(['multiple_choice', 'true_false', 'spot_mistake']);
const VALID_GLOSSARY_CATEGORIES = new Set([
  'foundations',
  'tokens',
  'money',
  'agents',
  'cli',
  'building'
]);
const VALID_LAB_DIFFICULTIES = new Set(['Beginner', 'Hands-On', 'Builder']);
const PLACEHOLDER_PATTERN = /\b(lorem ipsum dolor|TODO:|TBD|coming soon|insert .+ here)\b|\[placeholder\]/i;

// Banned unsafe/inaccurate guidance patterns that were audited & fixed
const BANNED_SAFETY_REGRESSIONS = [
  { label: 'Google AI hard monthly budget myth', re: /\$5 hard monthly budget in your Anthropic, OpenAI, or Google AI/i },
  { label: 'Read-only tools are harmless myth', re: /Reading a file or searching docs is harmless/i },
  { label: 'Destructive commands always ask myth', re: /anything destructive always requires explicitly asking/i },
  { label: 'AI scanning folder for API keys', re: /Scan my folder and verify that no API keys/i },
  { label: 'Desktop lab dead-end in lesson prose', re: /(Head into the Token & Context Playground|API Keys & Credits Lab|Harness & Agent Simulator lab|Claude Code CLI Dojo|Website Builder Studio|App Builder & Debug Studio)/i }
];

function assertNonEmptyString(value, label, minLen = 1) {
  assert.equal(typeof value, 'string', `${label} must be a string`);
  const trimmed = value.trim();
  assert.ok(trimmed.length >= minLen, `${label} must be at least ${minLen} chars (got ${trimmed.length})`);
  assert.ok(!PLACEHOLDER_PATTERN.test(trimmed), `${label} contains placeholder text`);
}

function validateQuizQuestion(q, label, seenQuizIds) {
  assertNonEmptyString(q.id, `${label}.id`, 4);
  assert.ok(!seenQuizIds.has(q.id), `Duplicate quiz id: ${q.id}`);
  seenQuizIds.add(q.id);

  assert.ok(VALID_QUIZ_TYPES.has(q.type), `Invalid quiz type "${q.type}" in ${q.id}`);
  assertNonEmptyString(q.question, `quiz[${q.id}].question`, 15);
  assert.ok(Array.isArray(q.options), `quiz[${q.id}].options must be an array`);
  if (q.type === 'true_false') {
    assert.equal(q.options.length, 2, `true_false quiz ${q.id} must have exactly 2 options`);
  } else {
    assert.ok(
      q.options.length >= 3 && q.options.length <= 5,
      `quiz ${q.id} must have 3-5 options (got ${q.options.length})`
    );
  }
  for (let oIdx = 0; oIdx < q.options.length; oIdx++) {
    assertNonEmptyString(q.options[oIdx], `quiz[${q.id}].options[${oIdx}]`, 2);
  }
  assert.ok(
    Number.isInteger(q.correctIndex) &&
      q.correctIndex >= 0 &&
      q.correctIndex < q.options.length,
    `quiz[${q.id}].correctIndex (${q.correctIndex}) out of bounds for ${q.options.length} options`
  );
  assertNonEmptyString(q.explanation, `quiz[${q.id}].explanation`, 25);
}

function computeLengthStats(questions) {
  const fourOpt = questions.filter((q) => q.options.length === 4);
  let longestOrTied = 0;
  let strictlyLongest = 0;
  let shortestOrTied = 0;
  let strictlyShortest = 0;
  let totalCorrectChars = 0;
  let totalDistractorChars = 0;
  let distractorCount = 0;
  const slots = [0, 0, 0, 0];

  for (const q of fourOpt) {
    slots[q.correctIndex]++;
    const lens = q.options.map((o) => o.trim().length);
    const maxLen = Math.max(...lens);
    const minLen = Math.min(...lens);
    const corrLen = lens[q.correctIndex];
    if (corrLen === maxLen) {
      longestOrTied++;
      if (lens.filter((l) => l === maxLen).length === 1) {
        strictlyLongest++;
      }
    }
    if (corrLen === minLen) {
      shortestOrTied++;
      if (lens.filter((l) => l === minLen).length === 1) {
        strictlyShortest++;
      }
    }
    totalCorrectChars += corrLen;
    for (let i = 0; i < lens.length; i++) {
      if (i !== q.correctIndex) {
        totalDistractorChars += lens[i];
        distractorCount++;
      }
    }
  }

  const avgCorrect = fourOpt.length ? totalCorrectChars / fourOpt.length : 0;
  const avgDistractor = distractorCount ? totalDistractorChars / distractorCount : 0;

  return {
    count: fourOpt.length,
    longestOrTied,
    strictlyLongest,
    shortestOrTied,
    strictlyShortest,
    longestOrTiedRatio: fourOpt.length ? longestOrTied / fourOpt.length : 0,
    strictlyLongestRatio: fourOpt.length ? strictlyLongest / fourOpt.length : 0,
    strictlyShortestRatio: fourOpt.length ? strictlyShortest / fourOpt.length : 0,
    avgCorrect,
    avgDistractor,
    lengthRatio: avgDistractor ? avgCorrect / avgDistractor : 0,
    slots
  };
}

// 1. Top-level metadata & zero legacy brand leaks
assert.equal(data.version, '1.0.0', 'version must be 1.0.0');
assert.equal(data.appName, 'Marain', 'appName must be Marain');
assert.equal(data.tagline, 'From Zero to Fluent in AI', 'tagline must match contract');
assert.ok(!/zero2ai/i.test(raw), 'dist/curriculum.json must contain zero leftover "Zero2AI" mentions');
assert.ok(Array.isArray(data.modules), 'modules must be an array');
assert.ok(Array.isArray(data.glossary), 'glossary must be an array');
assert.ok(Array.isArray(data.labs), 'labs must be an array');

// 2. Glossary validation (>= 40 terms, unique IDs, all categories valid)
assert.ok(data.glossary.length >= 40, `Expected >= 40 glossary terms, got ${data.glossary.length}`);
const glossaryIds = new Set();
const seenGlossaryCategories = new Set();
for (const entry of data.glossary) {
  assertNonEmptyString(entry.id, 'glossary.id', 2);
  assert.ok(!glossaryIds.has(entry.id), `Duplicate glossary id: ${entry.id}`);
  glossaryIds.add(entry.id);

  assertNonEmptyString(entry.term, `glossary[${entry.id}].term`, 2);
  assertNonEmptyString(entry.shortDef, `glossary[${entry.id}].shortDef`, 20);
  assertNonEmptyString(entry.analogy, `glossary[${entry.id}].analogy`, 20);
  assertNonEmptyString(entry.example, `glossary[${entry.id}].example`, 15);
  assert.ok(
    VALID_GLOSSARY_CATEGORIES.has(entry.category),
    `Invalid glossary category "${entry.category}" for ${entry.id}`
  );
  seenGlossaryCategories.add(entry.category);
}
assert.equal(
  seenGlossaryCategories.size,
  VALID_GLOSSARY_CATEGORIES.size,
  'All 6 glossary categories must be represented'
);

// 3. Labs validation (exact 6 IDs, valid fields, desktopOnly metadata, module references)
const moduleIdSet = new Set(data.modules.map((m) => m.id));
assert.equal(data.labs.length, 6, `Expected exactly 6 labs, got ${data.labs.length}`);
const labIds = new Set();
for (const lab of data.labs) {
  assertNonEmptyString(lab.id, 'lab.id', 2);
  assert.ok(!labIds.has(lab.id), `Duplicate lab id: ${lab.id}`);
  labIds.add(lab.id);

  assertNonEmptyString(lab.title, `lab[${lab.id}].title`, 5);
  assertNonEmptyString(lab.subtitle, `lab[${lab.id}].subtitle`, 10);
  assertNonEmptyString(lab.description, `lab[${lab.id}].description`, 40);
  assert.ok(
    VALID_LAB_DIFFICULTIES.has(lab.difficulty),
    `Invalid lab difficulty "${lab.difficulty}" for ${lab.id}`
  );
  assert.ok(
    Number.isInteger(lab.estimatedMinutes) && lab.estimatedMinutes > 0,
    `lab[${lab.id}].estimatedMinutes must be positive integer`
  );
  assert.ok(
    Number.isInteger(lab.xpReward) && lab.xpReward > 0,
    `lab[${lab.id}].xpReward must be positive integer`
  );
  assert.ok(
    moduleIdSet.has(lab.moduleId),
    `lab[${lab.id}].moduleId "${lab.moduleId}" does not match any module`
  );
  assert.equal(lab.desktopOnly, true, `lab[${lab.id}].desktopOnly must be true`);
}
for (const expectedLabId of EXPECTED_LAB_IDS) {
  assert.ok(labIds.has(expectedLabId), `Missing required lab ID: ${expectedLabId}`);
}

// 4. Modules, Chapters, and Mastery Checks validation
assert.equal(data.modules.length, 7, `Expected exactly 7 modules, got ${data.modules.length}`);
const seenChapterIds = new Set();
const seenQuizIds = new Set();
const seenMasteryIds = new Set();
const globalQuizTypes = new Set();
const allChapterQuizQuestions = [];
const allMasteryQuestions = [];
let totalChapters = 0;
let totalSections = 0;
let totalCallouts = 0;
let totalQuizQuestions = 0;
let totalMasteryQuestions = 0;

for (let mIdx = 0; mIdx < EXPECTED_MODULES.length; mIdx++) {
  const expected = EXPECTED_MODULES[mIdx];
  const mod = data.modules[mIdx];
  assert.equal(mod.id, expected.id, `Module ${mIdx + 1} id mismatch`);
  assert.equal(mod.number, mIdx + 1, `Module ${mod.id} number mismatch`);
  assert.equal(mod.accentHex, expected.accentHex, `Module ${mod.id} accentHex mismatch`);
  assert.equal(
    mod.recommendedLabId,
    expected.recommendedLabId,
    `Module ${mod.id} recommendedLabId mismatch`
  );
  if (mod.recommendedLabId !== null) {
    assert.ok(labIds.has(mod.recommendedLabId), `Module ${mod.id} recommendedLabId must resolve`);
  }
  assertNonEmptyString(mod.title, `module[${mod.id}].title`, 4);
  assertNonEmptyString(mod.subtitle, `module[${mod.id}].subtitle`, 15);
  assertNonEmptyString(mod.icon, `module[${mod.id}].icon`, 2);
  assert.ok(
    Number.isInteger(mod.estimatedMinutes) && mod.estimatedMinutes >= 5,
    `module[${mod.id}].estimatedMinutes must be >= 5`
  );

  // Unit 1 flagship phone-only constraints
  if (mod.number === 1) {
    assert.ok(
      mod.estimatedMinutes <= 6,
      `Unit 1 estimatedMinutes must be <= 6 for crisp ~5-min experience (got ${mod.estimatedMinutes})`
    );
    assert.equal(mod.recommendedLabId, null, 'Unit 1 must be phone-only (recommendedLabId: null)');
  }

  assert.ok(Array.isArray(mod.chapters), `module[${mod.id}].chapters must be an array`);
  assert.equal(
    mod.chapters.length,
    4,
    `Module ${mod.id} must have exactly 4 chapters, got ${mod.chapters.length}`
  );

  for (let cIdx = 0; cIdx < mod.chapters.length; cIdx++) {
    const ch = mod.chapters[cIdx];
    totalChapters++;
    assert.equal(ch.id, `ch-${mIdx + 1}-${cIdx + 1}`, `Unexpected chapter id: ${ch.id}`);
    assert.ok(!seenChapterIds.has(ch.id), `Duplicate chapter id: ${ch.id}`);
    seenChapterIds.add(ch.id);

    assert.equal(ch.moduleId, mod.id, `Chapter ${ch.id} moduleId mismatch`);
    assert.equal(ch.number, cIdx + 1, `Chapter ${ch.id} number mismatch`);
    assertNonEmptyString(ch.title, `chapter[${ch.id}].title`, 6);
    assert.ok(
      Number.isInteger(ch.readMinutes) && ch.readMinutes >= 1 && ch.readMinutes <= 15,
      `chapter[${ch.id}].readMinutes out of range`
    );
    assert.ok(
      Number.isInteger(ch.xpReward) && ch.xpReward >= 10,
      `chapter[${ch.id}].xpReward must be >= 10`
    );
    assertNonEmptyString(ch.summary, `chapter[${ch.id}].summary`, 40);

    // Analogy
    assert.ok(ch.analogy && typeof ch.analogy === 'object', `chapter[${ch.id}].analogy required`);
    assertNonEmptyString(ch.analogy.title, `chapter[${ch.id}].analogy.title`, 5);
    assertNonEmptyString(ch.analogy.body, `chapter[${ch.id}].analogy.body`, 60);

    // Sections (>= 3 substantive sections + callouts)
    assert.ok(
      Array.isArray(ch.sections) && ch.sections.length >= 3,
      `chapter[${ch.id}] must have >= 3 sections`
    );
    let chapterCalloutCount = 0;
    for (let sIdx = 0; sIdx < ch.sections.length; sIdx++) {
      const sec = ch.sections[sIdx];
      totalSections++;
      assertNonEmptyString(sec.heading, `chapter[${ch.id}].sections[${sIdx}].heading`, 6);
      assertNonEmptyString(sec.body, `chapter[${ch.id}].sections[${sIdx}].body`, 120);
      if (sec.callout !== null && sec.callout !== undefined) {
        chapterCalloutCount++;
        totalCallouts++;
        assert.ok(
          VALID_CALLOUT_TYPES.has(sec.callout.type),
          `Invalid callout type "${sec.callout.type}" in ${ch.id}`
        );
        assertNonEmptyString(sec.callout.title, `chapter[${ch.id}].sections[${sIdx}].callout.title`, 4);
        assertNonEmptyString(sec.callout.body, `chapter[${ch.id}].sections[${sIdx}].callout.body`, 30);
      }
    }
    assert.ok(
      chapterCalloutCount >= 2,
      `chapter[${ch.id}] should have at least 2 callouts (got ${chapterCalloutCount})`
    );

    // Key takeaways (>= 3)
    assert.ok(
      Array.isArray(ch.keyTakeaways) && ch.keyTakeaways.length >= 3,
      `chapter[${ch.id}] must have >= 3 keyTakeaways`
    );
    for (let kIdx = 0; kIdx < ch.keyTakeaways.length; kIdx++) {
      assertNonEmptyString(ch.keyTakeaways[kIdx], `chapter[${ch.id}].keyTakeaways[${kIdx}]`, 20);
    }

    // Glossary links
    assert.ok(
      Array.isArray(ch.glossaryTermIds) && ch.glossaryTermIds.length >= 2,
      `chapter[${ch.id}] must reference >= 2 glossaryTermIds`
    );
    for (const termId of ch.glossaryTermIds) {
      assert.ok(
        glossaryIds.has(termId),
        `chapter[${ch.id}] references unknown glossaryTermId "${termId}"`
      );
    }

    // Related lab link (nullable; Unit 1 must have zero desktop-lab pointers)
    if (mod.number === 1) {
      assert.equal(ch.relatedLabId, null, `Unit 1 chapter ${ch.id} must have relatedLabId: null`);
    } else if (ch.relatedLabId !== null) {
      assert.ok(
        labIds.has(ch.relatedLabId),
        `chapter[${ch.id}] references unknown relatedLabId "${ch.relatedLabId}"`
      );
    }

    // Safety & desktop-lab prose regression check on chapter text
    const chapterText = JSON.stringify({
      title: ch.title,
      summary: ch.summary,
      analogy: ch.analogy,
      sections: ch.sections,
      keyTakeaways: ch.keyTakeaways,
      quiz: ch.quiz
    });
    for (const rule of BANNED_SAFETY_REGRESSIONS) {
      assert.ok(
        !rule.re.test(chapterText),
        `chapter[${ch.id}] triggered banned pattern "${rule.label}"`
      );
    }

    // Quiz (>= 3 interactive questions, valid options, correctIndex, explanation, type variety)
    assert.ok(
      Array.isArray(ch.quiz) && ch.quiz.length >= 3,
      `chapter[${ch.id}] must have >= 3 quiz questions`
    );
    const chapterQuizTypes = new Set();
    for (let qIdx = 0; qIdx < ch.quiz.length; qIdx++) {
      const q = ch.quiz[qIdx];
      totalQuizQuestions++;
      validateQuizQuestion(q, `chapter[${ch.id}].quiz[${qIdx}]`, seenQuizIds);
      chapterQuizTypes.add(q.type);
      globalQuizTypes.add(q.type);
      allChapterQuizQuestions.push(q);
    }
    assert.ok(
      chapterQuizTypes.size >= 2,
      `chapter[${ch.id}] quiz should mix question types (found: ${[...chapterQuizTypes].join(', ')})`
    );
  }

  // Per-unit Mastery Check validation
  const mc = mod.masteryCheck;
  assert.ok(mc && typeof mc === 'object', `module[${mod.id}].masteryCheck is required`);
  assertNonEmptyString(mc.id, `module[${mod.id}].masteryCheck.id`, 4);
  assert.ok(!seenMasteryIds.has(mc.id), `Duplicate masteryCheck id: ${mc.id}`);
  seenMasteryIds.add(mc.id);
  assertNonEmptyString(mc.title, `module[${mod.id}].masteryCheck.title`, 6);
  assertNonEmptyString(mc.subtitle, `module[${mod.id}].masteryCheck.subtitle`, 15);
  assert.ok(
    typeof mc.passThreshold === 'number' && mc.passThreshold >= 0.6 && mc.passThreshold <= 1,
    `module[${mod.id}].masteryCheck.passThreshold out of range (${mc.passThreshold})`
  );
  assert.ok(
    Number.isInteger(mc.xpReward) && mc.xpReward >= 20,
    `module[${mod.id}].masteryCheck.xpReward must be >= 20`
  );
  assert.ok(
    Number.isInteger(mc.estimatedMinutes) && mc.estimatedMinutes >= 1 && mc.estimatedMinutes <= 10,
    `module[${mod.id}].masteryCheck.estimatedMinutes out of range`
  );
  assert.ok(
    Array.isArray(mc.questions) && mc.questions.length >= 4,
    `module[${mod.id}].masteryCheck must have >= 4 questions (got ${mc.questions?.length})`
  );
  for (let qIdx = 0; qIdx < mc.questions.length; qIdx++) {
    const q = mc.questions[qIdx];
    totalMasteryQuestions++;
    validateQuizQuestion(q, `module[${mod.id}].masteryCheck.questions[${qIdx}]`, seenQuizIds);
    allMasteryQuestions.push(q);
  }
}

// Check glossary against banned safety regressions as well
const glossaryText = JSON.stringify(data.glossary);
for (const rule of BANNED_SAFETY_REGRESSIONS) {
  assert.ok(
    !rule.re.test(glossaryText),
    `glossary triggered banned pattern "${rule.label}"`
  );
}

assert.equal(totalChapters, 28, `Expected 28 total chapters, got ${totalChapters}`);
assert.equal(
  globalQuizTypes.size,
  VALID_QUIZ_TYPES.size,
  'All 3 quiz types (multiple_choice, true_false, spot_mistake) must be used'
);

// 5. Answer-length bias & slot-distribution checks (anti-length-tell guardrails)
const chapterStats = computeLengthStats(allChapterQuizQuestions);
const masteryStats = computeLengthStats(allMasteryQuestions);
const combinedStats = computeLengthStats([...allChapterQuizQuestions, ...allMasteryQuestions]);

for (const [label, stats] of [
  ['chapter 4-option quizzes', chapterStats],
  ['mastery check 4-option questions', masteryStats],
  ['all 4-option questions combined', combinedStats]
]) {
  assert.ok(
    stats.longestOrTiedRatio <= 0.35,
    `${label}: longest-or-tied correct ratio ${(stats.longestOrTiedRatio * 100).toFixed(1)}% (${stats.longestOrTied}/${stats.count}) exceeds 35% ceiling`
  );
  assert.ok(
    stats.strictlyLongestRatio <= 0.35,
    `${label}: strictly-longest correct ratio ${(stats.strictlyLongestRatio * 100).toFixed(1)}% (${stats.strictlyLongest}/${stats.count}) exceeds 35% ceiling`
  );
  assert.ok(
    stats.strictlyShortestRatio <= 0.35,
    `${label}: strictly-shortest correct ratio ${(stats.strictlyShortestRatio * 100).toFixed(1)}% (${stats.strictlyShortest}/${stats.count}) exceeds 35% ceiling`
  );
  assert.ok(
    stats.lengthRatio >= 0.85 && stats.lengthRatio <= 1.15,
    `${label}: mean correct/distractor length ratio ${stats.lengthRatio.toFixed(2)} outside [0.85, 1.15]`
  );
  assert.ok(
    stats.slots.every((count) => count > 0),
    `${label}: correctIndex slots must cover 0..3, got [${stats.slots.join(', ')}]`
  );
}

console.log(
  `PASS: Validated Marain curriculum (${data.modules.length} modules, ${totalChapters} chapters, ` +
    `${totalSections} sections, ${totalCallouts} callouts, ${totalQuizQuestions} chapter quiz questions + ` +
    `${totalMasteryQuestions} mastery check questions, ${data.glossary.length} glossary terms, ${data.labs.length} desktop labs, ` +
    `0 legacy Zero2AI mentions).\n` +
    `Length balance (4-opt): chapter=${chapterStats.strictlyLongest}/${chapterStats.count} (${(chapterStats.strictlyLongestRatio * 100).toFixed(1)}%, avg ratio ${chapterStats.lengthRatio.toFixed(2)}), ` +
    `mastery=${masteryStats.strictlyLongest}/${masteryStats.count} (${(masteryStats.strictlyLongestRatio * 100).toFixed(1)}%, avg ratio ${masteryStats.lengthRatio.toFixed(2)}), ` +
    `combined=${combinedStats.strictlyLongest}/${combinedStats.count} (${(combinedStats.strictlyLongestRatio * 100).toFixed(1)}%, slots [${combinedStats.slots.join('/')}]).`
);
