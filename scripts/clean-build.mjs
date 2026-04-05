import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const targets = ['build', '.svelte-kit/output'].map((target) => resolve(process.cwd(), target));

for (const target of targets) {
  await rm(target, { recursive: true, force: true });
}
