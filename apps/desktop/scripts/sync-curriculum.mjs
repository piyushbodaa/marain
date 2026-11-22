import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourcePath = path.resolve(__dirname, '../../../packages/curriculum/dist/curriculum.json');
const targetPath = path.resolve(__dirname, '../src/data/curriculum.json');

if (!fs.existsSync(sourcePath)) {
  console.error(`ERROR: Shared curriculum not found at: ${sourcePath}`);
  console.error('Run "npm --prefix packages/curriculum run build" first.');
  process.exit(1);
}

const raw = fs.readFileSync(sourcePath, 'utf-8');
const parsed = JSON.parse(raw);

if (!Array.isArray(parsed.modules) || parsed.modules.length < 7) {
  console.error(`ERROR: Expected >=7 modules in curriculum.json, got ${parsed.modules?.length ?? 0}`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(targetPath), { recursive: true });
fs.writeFileSync(targetPath, raw, 'utf-8');

const totalChapters = parsed.modules.reduce((acc, m) => acc + (m.chapters?.length ?? 0), 0);
console.log(
  `Synced curriculum.json -> ${targetPath} (${parsed.modules.length} modules, ${totalChapters} chapters, ${parsed.glossary?.length ?? 0} glossary terms, ${parsed.labs?.length ?? 0} labs)`
);
