const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

function parseTopikContent(content) {
  const entries = [];
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('--') || /^TOPIK\s/.test(trimmed) || trimmed.startsWith('No.') || trimmed === 'English') continue;
    const segments = trimmed.split(/\s+(\d+)\s+/);
    for (let i = 1; i < segments.length; i += 2) {
      const rest = (segments[i] || '').trim();
      const hangulMatch = rest.match(/^([\uAC00-\uD7AF\u3130-\u318F]+)\s+(.*)$/);
      if (hangulMatch) {
        const word = hangulMatch[1].trim();
        const meaning = hangulMatch[2].trim();
        if (word.length >= 2 && meaning.length >= 1 && !meaning.startsWith('*see'))
          entries.push({ word, meaning, pos: 'n' });
      }
    }
  }
  const byWord = new Map();
  for (const e of entries) byWord.set(e.word, e);
  return Array.from(byWord.values());
}

const dir = path.join(__dirname, '..');
const pdf1Path = path.join(dir, 'TOPIK-I-1671.pdf');
const pdf2Path = path.join(dir, 'topik-2662.pdf');

async function main() {
  let topik1 = [];
  let topik2 = [];
  const buf1 = fs.readFileSync(pdf1Path);
  const buf2 = fs.readFileSync(pdf2Path);
  try {
    const data1 = await pdf(buf1);
    if (data1.text && data1.text.includes('가게')) topik1 = parseTopikContent(data1.text);
  } catch (e) {
    console.warn('TOPIK-I:', e.message);
  }
  try {
    const data2 = await pdf(buf2);
    if (data2.text && data2.text.includes('가계부')) topik2 = parseTopikContent(data2.text);
  } catch (e) {
    console.warn('topik-2662:', e.message);
  }
  const out = {
    _comment: 'Từ vựng TOPIK I (Beginner) và TOPIK II (Intermediate) từ file PDF.',
    topik1: { label: 'TOPIK I (Sơ cấp)', entries: topik1 },
    topik2: { label: 'TOPIK II (Trung cấp)', entries: topik2 },
  };
  fs.writeFileSync(path.join(dir, 'src/data/vocabulary.json'), JSON.stringify(out, null, 2), 'utf8');
  console.log('topik1:', topik1.length, 'topik2:', topik2.length);
}
main();
