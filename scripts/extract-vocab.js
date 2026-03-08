const fs = require('fs');
const path = require('path');

const txtPath = path.join(__dirname, '../eald-bilingual-dictionary-korean.txt');
const text = fs.readFileSync(txtPath, 'utf8');
const lines = text.split(/\r?\n/);

const entries = [];
const seen = new Set();

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (!/[\uAC00-\uD7AF]/.test(line)) continue;
  // Split by 2+ spaces; last segment that is mostly Hangul = Korean
  const parts = line.split(/\s{2,}/);
  let korean = '';
  let engPart = '';
  for (let j = parts.length - 1; j >= 0; j--) {
    const p = parts[j].trim();
    const hangulCount = (p.match(/[\uAC00-\uD7AF]/g) || []).length;
    if (hangulCount >= 2 && hangulCount >= p.length * 0.4) {
      korean = p;
      engPart = parts.slice(0, j).join('  ').trim();
      break;
    }
  }
  if (!korean || korean.length > 60) continue;
  if (/^[그ㅋㅁ\s\d\.\-]+$/.test(korean)) continue;
  let eng = engPart
    .replace(/^(n|v|adj|adv|prep|conj|pron|phrase|abbrev|collog|phr v|ptv|int|det|ㅁ)\s+/i, '')
    .replace(/^\d+\.\s*/, '')
    .trim();
  if (eng.includes('  ')) eng = eng.split(/\s{2,}/).pop().trim();
  if (eng.length < 2 || eng.length > 45) continue;
  if (/\*see\s/i.test(eng)) continue;
  if (!/^[A-Za-z0-9][a-zA-Z0-9\s\-'\.]*$/.test(eng)) continue;
  const key = korean + '|' + eng;
  if (seen.has(key)) continue;
  seen.add(key);
  entries.push({ word: korean, meaning: eng, pos: 'n' });
}

const out = {
  _comment: 'Vocabulary extracted from EALD Bilingual Dictionary (English/Korean) - OCR, inline format.',
  entries,
};
fs.writeFileSync(path.join(__dirname, '../src/data/vocabulary.json'), JSON.stringify(out, null, 2), 'utf8');
console.log('Wrote', entries.length, 'entries to src/data/vocabulary.json');
