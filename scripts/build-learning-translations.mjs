// Build-time only: public lesson text is translated and bundled for offline use.
// Run: node scripts/build-learning-translations.mjs [--refresh-glossary] [en|zh|hi|es|fr|ja ...]
// Existing translations are retained, so reviewed wording is not overwritten.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (name) => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'));
const grammar = read('src/data/grammar.json');
const sentences = read('src/data/sentences.json');
const vocabulary = read('src/data/vocabulary.json');
const policy = read('src/legal/privacy-policy.json');
const glossary = read('scripts/learning-translation-glossary.json');
const englishEdits = read('scripts/grammar-english-edits.json');
for (const section of Object.values(grammar)) {
  for (const item of section.items ?? []) {
    for (const [field, english] of Object.entries(englishEdits[item.id] ?? {})) {
      glossary[item[field]] = english;
    }
  }
}

// Sentence pronunciation needs whole-word rules (e.g. 앉아 -> anja), rather
// than joining isolated syllable spellings. Keep these guides offline too.
const pronunciationPath = path.join(root, 'src/data/sentenceRomanization.json');
const romanization = fs.existsSync(pronunciationPath) ? read('src/data/sentenceRomanization.json') : {};
const missingPronunciations = [...sentences.topik1, ...sentences.topik2].filter((sentence) => !romanization[sentence.id]);
for (let start = 0; start < missingPronunciations.length; start += 4) {
  await Promise.all(missingPronunciations.slice(start, start + 4).map(async (sentence) => {
    const url = new URL('https://translate.googleapis.com/translate_a/single');
    for (const [key, value] of [['client', 'gtx'], ['sl', 'ko'], ['tl', 'en'], ['dt', 't'], ['dt', 'rm'], ['q', sentence.ko]]) {
      url.searchParams.append(key, value);
    }
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`Romanization: HTTP ${response.status}`);
    const result = await response.json();
    const guide = result[0].filter((part) => typeof part[3] === 'string').map((part) => part[3]).join('').trim();
    if (!guide) throw new Error(`Missing romanization: ${sentence.id}`);
    romanization[sentence.id] = guide;
  }));
  fs.writeFileSync(pronunciationPath, JSON.stringify(romanization, null, 2) + '\n');
}
const vi = new Set();
const en = new Set();
for (const section of Object.values(grammar)) {
  for (const item of section.items ?? []) {
    [item.title, item.structure, item.explanation, item.usage, ...item.tags,
      ...item.examples.flatMap((example) => [example.vi, example.note])]
      .filter(Boolean).forEach((value) => vi.add(value));
  }
}
for (const level of ['topik1', 'topik2']) {
  sentences[level].forEach((sentence) => vi.add(sentence.vi));
  vocabulary[level].entries.forEach((entry) => en.add(entry.meaning));
}
[policy.en.title, ...policy.en.sections.flatMap((section) => [section.title, ...section.paragraphs])]
  .forEach((value) => en.add(value));

export const uiEnglish = {
  aboutDescription: 'KKorea Hangul helps you learn Korean with the Hangul alphabet, reading and pronunciation practice, TOPIK I and II grammar and vocabulary, and spaced repetition (SM2). Lessons and the interface follow your selected language. The app supports seven languages, text to speech, and light or dark mode.',
  alphabetSubtitle: 'Korean letters and pronunciation',
  vocabEmptyHint: 'No vocabulary is available for this level yet.',
};
Object.values(uiEnglish).forEach((value) => en.add(value));

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function translate(text, source, target) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  Object.entries({ client: 'gtx', sl: source, tl: target === 'zh' ? 'zh-CN' : target, dt: 't', q: text })
    .forEach(([key, value]) => url.searchParams.set(key, value));
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      return result[0].map((part) => part[0] ?? '').join('');
    } catch (error) {
      if (attempt === 4) throw error;
      await sleep(1000 * (attempt + 1));
    }
  }
}

function mask(text) {
  const tokens = [];
  // Korean examples, jamo and formula notation must survive translation unchanged.
  const value = text.replace(/[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]+|\n/g, (match) => {
    tokens.push(match);
    return `__K${tokens.length - 1}__`;
  });
  return {
    value,
    restore: (translated) => {
      for (let index = 0; index < tokens.length; index++) {
        const token = `__K${index}__`;
        if (!translated.includes(token)) throw new Error(`Missing ${token}: ${text}`);
        translated = translated.replaceAll(token, tokens[index]);
      }
      return translated.trim();
    },
  };
}

async function translateOne(text, source, target) {
  // Long formula lists can cause a translator to omit repeated placeholders.
  // Translate their lines independently, then fall back to prose segments.
  if (text.includes('\n')) {
    const lines = [];
    for (const line of text.split('\n')) lines.push(await translateOne(line, source, target));
    return lines.join('\n');
  }
  const masked = mask(text);
  try { return masked.restore(await translate(masked.value, source, target)); }
  catch {
    const parts = text.split(/([\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]+)/g);
    const result = [];
    for (const part of parts) {
      if (!part || /^[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af\s\d\W]+$/u.test(part) || !/[a-zA-ZÀ-ỹ]/.test(part)) result.push(part);
      else result.push(await translate(part, source, target));
    }
    return result.join('');
  }
}

const refreshGlossary = process.argv.includes('--refresh-glossary');
const requestedLocales = process.argv.slice(2).filter((arg) => arg !== '--refresh-glossary');
const locales = requestedLocales.length ? requestedLocales : ['en', 'zh', 'hi', 'es', 'fr', 'ja'];
for (const locale of locales) {
  if (!['en', 'zh', 'hi', 'es', 'fr', 'ja'].includes(locale)) throw new Error(`Unsupported locale ${locale}`);
}
await Promise.all(locales.map(async (locale) => {
  const filename = path.join(root, `src/localization/content/${locale}.json`);
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  const catalog = fs.existsSync(filename) ? read(`src/localization/content/${locale}.json`) : { fromVietnamese: {}, fromEnglish: {} };
  const save = () => fs.writeFileSync(filename, JSON.stringify(catalog, null, 2) + '\n');
  const terms = Object.entries(glossary).filter(([text]) => vi.has(text) && (refreshGlossary || !catalog.fromVietnamese[text]));
  if (locale === 'en') {
    for (const [text, translation] of terms) catalog.fromVietnamese[text] = translation;
  } else {
    for (let start = 0; start < terms.length; start += 30) {
      const batch = terms.slice(start, start + 30);
      const masked = batch.map(([, english]) => mask(english));
      const lines = (await translate(masked.map((item) => item.value).join('\n'), 'en', locale)).split('\n').filter(Boolean);
      for (let index = 0; index < batch.length; index++) {
        const [text, english] = batch[index];
        try {
          if (lines.length !== batch.length) throw new Error('Line count mismatch');
          catalog.fromVietnamese[text] = masked[index].restore(lines[index]);
        } catch { catalog.fromVietnamese[text] = await translateOne(english, 'en', locale); }
      }
    }
  }
  save();
  for (const [source, entries, dictionary] of [['vi', vi, catalog.fromVietnamese], ['en', en, catalog.fromEnglish]]) {
    if (source === locale) continue;
    const pending = [...entries].filter((text) => !dictionary[text]);
    let completed = 0;
    while (pending.length) {
      const batch = [];
      let length = 0;
      while (pending.length && length + pending[0].length < 2400) {
        const text = pending.shift();
        batch.push(text);
        length += text.length + 1;
      }
      if (!batch.length) batch.push(pending.shift());
      const masked = batch.map(mask);
      const translated = await translate(masked.map((item) => item.value).join('\n'), source, locale);
      const lines = translated.split('\n').map((line) => line.trim()).filter(Boolean);
      if (lines.length === batch.length) {
        for (let index = 0; index < batch.length; index++) {
          try { dictionary[batch[index]] = masked[index].restore(lines[index]); }
          catch { dictionary[batch[index]] = await translateOne(batch[index], source, locale); }
        }
      } else {
        for (let index = 0; index < batch.length; index++) {
          dictionary[batch[index]] = await translateOne(batch[index], source, locale);
        }
      }
      completed += batch.length;
      save();
      console.log(`${locale} ${source}: ${completed} translated, ${pending.length} remaining`);
      await sleep(150);
    }
  }
  save();
}));
