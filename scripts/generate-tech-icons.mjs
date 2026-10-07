// Gera src/content/techIcons.generated.ts só com os logos citados no conteúdo
// (content/taxonomy.json e o `icon.logo` de cada trilha). Fonte: pacote
// simple-icons (CC0). Rode com `npm run tech-icons` depois de citar um logo novo.
import fs from 'node:fs';
import path from 'node:path';
import * as simpleIcons from 'simple-icons';

const root = path.resolve(import.meta.dirname, '..');
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));

const slugs = new Set();
const taxonomy = readJson('content/taxonomy.json');
for (const item of [...taxonomy.languages, ...taxonomy.frameworks]) if (item.icon) slugs.add(item.icon);
const tracksDir = path.join(root, 'content/tracks');
for (const dir of fs.readdirSync(tracksDir)) {
  const file = path.join('content/tracks', dir, 'track.json');
  if (!fs.existsSync(path.join(root, file))) continue;
  const logo = readJson(file).icon?.logo;
  if (logo) slugs.add(logo);
}

const bySlug = new Map(
  Object.values(simpleIcons)
    .filter((i) => i?.slug)
    .map((i) => [i.slug, i]),
);
const missing = [...slugs].filter((s) => !bySlug.has(s));
if (missing.length) {
  console.error(`Logos inexistentes no simple-icons: ${missing.join(', ')}`);
  process.exit(1);
}

const sorted = [...slugs].sort();
const entries = sorted
  .map((s) => {
    const { title, hex, path: d } = bySlug.get(s);
    return `  ${JSON.stringify(s)}: { title: ${JSON.stringify(title)}, hex: '#${hex}', path: ${JSON.stringify(d)} },`;
  })
  .join('\n');

const out = `// Arquivo gerado por scripts/generate-tech-icons.mjs (npm run tech-icons). Não edite à mão.
// Logos do Simple Icons (CC0); as marcas pertencem aos seus donos.

export const TECH_ICON_SLUGS = ${JSON.stringify(sorted)} as const;

export type TechIconSlug = (typeof TECH_ICON_SLUGS)[number];

export const TECH_ICONS: Record<TechIconSlug, { title: string; hex: string; path: string }> = {
${entries}
};
`;
fs.writeFileSync(path.join(root, 'src/content/techIcons.generated.ts'), out);
console.log(`techIcons.generated.ts: ${sorted.length} logos (${sorted.join(', ')})`);
