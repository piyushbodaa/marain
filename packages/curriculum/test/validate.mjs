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
  { id: 'mod-1-what-is-ai', accentHex: '#10B981', recommendedLabId: 'tokenizer' },
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

function assertNonEmptyString(value, label, minLen = 1) {
  assert.equal(typeof value, 'string', `${label} must be a string`);
  const trimmed = value.trim();
  assert.ok(trimmed.length >= minLen, `${label} must be at least ${minLen} chars (got ${trimmed.length})`);
  assert.ok(!PLACEHOLDER_PATTERN.test(trimmed), `${label} contains placeholder text`);
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

// 3. Labs validation (exact 6 IDs, valid fields, module references)
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
}
for (const expectedLabId of EXPECTED_LAB_IDS) {
  assert.ok(labIds.has(expectedLabId), `Missing required lab ID: ${expectedLabId}`);
}

// 4. Modules & Chapters validation
assert.equal(data.modules.length, 7, `Expected exactly 7 modules, got ${data.modules.length}`);
const seenChapterIds = new Set();
const seenQuizIds = new Set();
const globalQuizTypes = new Set();
let totalChapters = 0;
let totalSections = 0;
let totalCallouts = 0;
let totalQuizQuestions = 0;

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
  assert.ok(labIds.has(mod.recommendedLabId), `Module ${mod.id} recommendedLabId must resolve`);
  assertNonEmptyString(mod.title, `module[${mod.id}].title`, 4);
  assertNonEmptyString(mod.subtitle, `module[${mod.id}].subtitle`, 15);
  assertNonEmptyString(mod.icon, `module[${mod.id}].icon`, 2);
  assert.ok(
    Number.isInteger(mod.estimatedMinutes) && mod.estimatedMinutes >= 10,
    `module[${mod.id}].estimatedMinutes must be >= 10`
  );

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
      Number.isInteger(ch.readMinutes) && ch.readMinutes >= 2 && ch.readMinutes <= 15,
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

    // Related lab link (nullable)
    if (ch.relatedLabId !== null) {
      assert.ok(
        labIds.has(ch.relatedLabId),
        `chapter[${ch.id}] references unknown relatedLabId "${ch.relatedLabId}"`
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
      assertNonEmptyString(q.id, `chapter[${ch.id}].quiz[${qIdx}].id`, 4);
      assert.ok(!seenQuizIds.has(q.id), `Duplicate quiz id: ${q.id}`);
      seenQuizIds.add(q.id);

      assert.ok(
        VALID_QUIZ_TYPES.has(q.type),
        `Invalid quiz type "${q.type}" in ${q.id}`
      );
      chapterQuizTypes.add(q.type);
      globalQuizTypes.add(q.type);

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
    assert.ok(
      chapterQuizTypes.size >= 2,
      `chapter[${ch.id}] quiz should mix question types (found: ${[...chapterQuizTypes].join(', ')})`
    );
  }
}

assert.equal(totalChapters, 28, `Expected 28 total chapters, got ${totalChapters}`);
assert.equal(
  globalQuizTypes.size,
  VALID_QUIZ_TYPES.size,
  'All 3 quiz types (multiple_choice, true_false, spot_mistake) must be used'
);

// Ensure non-true/false quiz answers are well distributed across A/B/C/D (not stuck on one index)
const mcSlots = new Set();
for (const mod of data.modules) {
  for (const ch of mod.chapters) {
    for (const q of ch.quiz) {
      if (q.type !== 'true_false') {
        mcSlots.add(q.correctIndex);
      }
    }
  }
}
assert.equal(
  mcSlots.size,
  4,
  `Expected multiple_choice/spot_mistake correctIndex values distributed across 0..3, got [${[...mcSlots].sort().join(', ')}]`
);

console.log(
  `PASS: Validated Marain curriculum (${data.modules.length} modules, ${totalChapters} chapters, ` +
    `${totalSections} sections, ${totalCallouts} callouts, ${totalQuizQuestions} quiz questions across ` +
    `all 3 types, ${data.glossary.length} glossary terms across all 6 categories, ${data.labs.length} labs, 0 legacy Zero2AI mentions).`
);
