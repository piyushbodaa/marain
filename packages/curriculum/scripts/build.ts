import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CURRICULUM } from '../src/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkgRoot = resolve(__dirname, '..');
const outFile = resolve(pkgRoot, 'dist', 'curriculum.json');

mkdirSync(dirname(outFile), { recursive: true });
const json = `${JSON.stringify(CURRICULUM, null, 2)}\n`;
writeFileSync(outFile, json, 'utf8');

const totalChapters = CURRICULUM.modules.reduce((sum, mod) => sum + mod.chapters.length, 0);
const totalQuizzes = CURRICULUM.modules.reduce(
  (sum, mod) => sum + mod.chapters.reduce((cSum, ch) => cSum + ch.quiz.length, 0),
  0
);

console.log(
  `Built ${outFile} (${(Buffer.byteLength(json, 'utf8') / 1024).toFixed(1)} KB): ` +
    `${CURRICULUM.modules.length} modules, ${totalChapters} chapters, ` +
    `${totalQuizzes} quiz questions, ${CURRICULUM.glossary.length} glossary terms, ` +
    `${CURRICULUM.labs.length} labs.`
);
