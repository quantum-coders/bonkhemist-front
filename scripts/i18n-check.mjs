import { readFileSync } from 'node:fs';

const flat = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? flat(v, `${prefix}${k}.`)
      : [`${prefix}${k}`]
  );

const en = flat(JSON.parse(readFileSync('locales/en.json', 'utf8')));
const es = flat(JSON.parse(readFileSync('locales/es.json', 'utf8')));
const setEn = new Set(en), setEs = new Set(es);
const missingEs = en.filter(k => !setEs.has(k));
const missingEn = es.filter(k => !setEn.has(k));

if (missingEs.length || missingEn.length) {
  if (missingEs.length) console.error('Missing in es.json:', missingEs);
  if (missingEn.length) console.error('Missing in en.json:', missingEn);
  process.exit(1);
}
console.log(`i18n OK — ${en.length} keys in sync.`);
