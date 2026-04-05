import type { CharacterDefinition } from '$lib/content/types';

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function sentenceClamp(value: string, maxLength = 180): string {
  const clean = normalizeWhitespace(value);
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trimEnd()}...`;
}

function cleanPromptLine(line: string): string {
  return normalizeWhitespace(
    line
      .replace(/^[-*]\s*/, '')
      .replace(/^Core identity:\s*/i, '')
      .replace(/^Voice guide:\s*/i, '')
      .replace(/^Behavior:\s*/i, '')
      .replace(/^Hard rules:\s*/i, '')
  );
}

export function getPromptSnippet(prompt: string, maxLines = 6): string {
  return prompt
    .split(/\r?\n/)
    .map(cleanPromptLine)
    .filter((line) => line.length > 0)
    .slice(0, maxLines)
    .join('\n');
}

export function summarizeRawPrompt(prompt: string): string {
  const snippet = getPromptSnippet(prompt, 3).replace(/\n/g, ' ');
  return sentenceClamp(snippet || 'Paste a prompt to generate a creator-ready summary.', 180);
}

export function getPromptSummary(character: CharacterDefinition): string {
  const base =
    character.tagline ||
    getPromptSnippet(character.systemPromptLite, 2).replace(/\n/g, ' ');
  const tone = character.tone.slice(0, 3).join(', ');
  const audience = sentenceClamp(character.audience, 120).replace(/\.$/, '');

  return sentenceClamp(
    `${base} Best for ${audience}. Expect ${tone} energy with ${character.archetype} pacing.`,
    260
  );
}

export function getPromptTeaser(character: CharacterDefinition): string {
  if (character.comingSoonTeaser) {
    return sentenceClamp(character.comingSoonTeaser, 180);
  }

  return sentenceClamp(getPromptSnippet(character.systemPromptLite, 3).replace(/\n/g, ' '), 180);
}

export function getPromptPreviewTitle(character: CharacterDefinition): string {
  if (character.tier === 'free') return 'Starter prompt';
  if (character.contentRating === 'nsfw') return 'Members-only prompt preview';
  return 'Lite prompt preview';
}
