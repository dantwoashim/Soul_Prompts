import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';
import { describe, expect, test } from 'vitest';

const projectRoot = resolve(process.cwd());
const srcRoot = resolve(projectRoot, 'src');
const codeExtensions = new Set(['.ts', '.svelte']);

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = resolve(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      return walk(fullPath);
    }

    return codeExtensions.has(extname(fullPath)) ? [fullPath] : [];
  });
}

function extractImports(source: string): string[] {
  const matches = source.matchAll(/from\s+['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]/g);
  return [...matches].map((match) => match[1] ?? match[2]).filter(Boolean);
}

describe('project isolation', () => {
  test('does not import from the main Wrong Number app', () => {
    const files = walk(srcRoot);

    for (const file of files) {
      const source = readFileSync(file, 'utf8');
      const imports = extractImports(source);

      for (const specifier of imports) {
        expect(specifier).not.toMatch(/src\/renderer|src\/main|web\//);

        if (specifier.startsWith('.')) {
          const absoluteImport = resolve(dirname(file), specifier);
          expect(absoluteImport.startsWith(projectRoot)).toBe(true);
        }
      }
    }
  });
});
