import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd(), 'build');
const requiredFiles = [
  'index.html',
  'faq/index.html',
  'privacy/index.html',
  'characters/nila-after-rain/index.html',
  'characters/juno-blackline/index.html',
  'characters/sable-astral/index.html',
  'characters/vale-midnight/index.html'
];

for (const file of requiredFiles) {
  const target = resolve(root, file);
  if (!existsSync(target)) {
    throw new Error(`Missing prerendered file: ${file}`);
  }
}

const assertions = [
  {
    file: 'index.html',
    includes: [
      '<title>SoulPrompts | Engineered roleplay characters for AI Studio</title>',
      'name="description"',
      'Free lite prompts for immersive roleplay characters'
    ]
  },
  {
    file: 'characters/nila-after-rain/index.html',
    includes: [
      '<title>Nila After Rain | SoulPrompts</title>',
      'content="Nila After Rain is a slow-burn confidante prompt built for emotionally rich roleplay."',
      'Use in AI Studio'
    ]
  }
];

for (const { file, includes } of assertions) {
  const html = readFileSync(resolve(root, file), 'utf8');
  for (const fragment of includes) {
    if (!html.includes(fragment)) {
      throw new Error(`Expected "${fragment}" in ${file}`);
    }
  }
}

console.log('Build output looks correct.');
