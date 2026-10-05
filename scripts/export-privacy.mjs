import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const policy = JSON.parse(readFileSync(resolve(root, 'src/legal/privacy-policy.json'), 'utf8'));
const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const languages = ['en', 'vi'];
writeFileSync(resolve(root, 'PRIVACY.md'), languages.map((language) => {
  const copy = policy[language];
  return `# ${copy.title}\n\n` + copy.sections.map((section) => `## ${section.title}\n\n${section.paragraphs.join('\n\n')}\n`).join('\n');
}).join('\n---\n\n') + `\nPublic policy: ${policy.url}\n`, 'utf8');
const body = languages.map((language) => {
  const copy = policy[language];
  return `<section id="${language}" lang="${language}"><h1>${escape(copy.title)}</h1>` + copy.sections.map((section) => `<h2>${escape(section.title)}</h2>${section.paragraphs.map((paragraph) => `<p>${escape(paragraph)}</p>`).join('')}`).join('') + '</section>';
}).join('<hr>');
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Privacy Policy | KKorea Hangul</title><style>body{max-width:800px;margin:auto;padding:24px 20px 64px;font:16px/1.7 system-ui,sans-serif;background:#f8f6ff;color:#29263a}h1,h2{line-height:1.3;color:#53439a}h2{font-size:1.25rem;margin-top:2rem}a{color:#53439a}hr{margin:3rem 0;border:0;border-top:1px solid #d9d1ef}</style></head><body><main><nav><a href="#en">English</a> · <a href="#vi">Tiếng Việt</a></nav>${body}<footer><p>Contact: <a href="mailto:${policy.contact}">${policy.contact}</a></p></footer></main></body></html>
`;
writeFileSync(resolve(root, 'store-assets/privacy.html'), html, 'utf8');
console.log('Exported PRIVACY.md and store-assets/privacy.html from the bundled policy.');
