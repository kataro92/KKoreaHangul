/**
 * Gán illust (slug từ meaning) vào vocabulary.json và xuất catalog prompt minh họa.
 *
 * Usage: node scripts/build-vocab-illustration-prompts.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const vocabPath = path.join(root, 'src', 'data', 'vocabulary.json');
const outPrompts = path.join(root, 'docs', 'vocab-illustration-prompts.json');

const STYLE_PREFIX =
  'Simple cute cartoon illustration, flat 2D, thick clean outlines, soft pastel colors, minimal background, friendly educational flashcard style, no text, no letters, no watermark, square composition, exact image size 256x256 pixels.';

function slugFromMeaning(meaning) {
  let m = (meaning || '').toLowerCase().trim();
  m = m.replace(/\([^)]*\)/g, '');
  m = m.replace(/[^a-z0-9\s-]/g, ' ');
  m = m.replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (!m) return 'unknown';
  return m.slice(0, 60);
}

function buildPrompt(entry) {
  const meaning = entry.meaning || entry.vi || entry.word;
  const vi = entry.vi ? ` (Vietnamese: ${entry.vi})` : '';
  const pos = entry.pos || 'n';
  let subject;
  if (pos === 'v') {
    subject = `A simple scene showing the action "${meaning}"${vi}, one or two cute cartoon characters, clear and easy to understand at a glance.`;
  } else if (pos === 'adj') {
    subject = `A simple visual metaphor representing the adjective/quality "${meaning}"${vi}, cute cartoon style, clear and memorable.`;
  } else {
    subject = `A single clear cute cartoon depiction of "${meaning}"${vi}, centered, easy to recognize for a language flashcard.`;
  }
  return `${STYLE_PREFIX} ${subject}`;
}

const raw = JSON.parse(readFileSync(vocabPath, 'utf8'));
const bySlug = new Map();

for (const level of ['topik1', 'topik2']) {
  const entries = raw[level]?.entries ?? [];
  for (const e of entries) {
    const slug = slugFromMeaning(e.meaning);
    e.illust = slug;
    if (!bySlug.has(slug)) {
      bySlug.set(slug, {
        slug,
        words: [],
        meaning: e.meaning,
        vi: e.vi || '',
        pos: e.pos || 'n',
        levels: new Set(),
        prompt: buildPrompt(e),
      });
    }
    const row = bySlug.get(slug);
    if (!row.words.includes(e.word)) row.words.push(e.word);
    row.levels.add(level);
    if (!row.vi && e.vi) row.vi = e.vi;
  }
}

const catalog = [...bySlug.values()]
  .map((r) => ({
    slug: r.slug,
    words: r.words,
    meaning: r.meaning,
    vi: r.vi,
    pos: r.pos,
    levels: [...r.levels],
    prompt: r.prompt,
  }))
  .sort((a, b) => a.slug.localeCompare(b.slug));

mkdirSync(path.dirname(outPrompts), { recursive: true });
writeFileSync(vocabPath, JSON.stringify(raw, null, 2) + '\n', 'utf8');
writeFileSync(outPrompts, JSON.stringify({ stylePrefix: STYLE_PREFIX, count: catalog.length, items: catalog }, null, 2) + '\n', 'utf8');

const topik1Nouns = catalog.filter((i) => i.levels.includes('topik1') && i.pos === 'n');
console.log(`Updated ${vocabPath}`);
console.log(`Wrote ${catalog.length} unique prompts → ${outPrompts}`);
console.log(`TOPIK I nouns (priority batch): ${topik1Nouns.length}`);
