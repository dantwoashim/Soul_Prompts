import { describe, expect, test } from 'vitest';
import { characters, getSfwCharacters, getNsfwCharacters } from '../src/lib/content/characters';

describe('character content', () => {
  test('ships six characters with the required fields', () => {
    expect(characters).toHaveLength(6);

    for (const character of characters) {
      expect(character.slug).toBeTruthy();
      expect(character.name).toBeTruthy();
      expect(character.tagline).toBeTruthy();
      expect(character.systemPromptLite.length).toBeGreaterThan(300);
      expect(character.modelNotes.length).toBeGreaterThanOrEqual(3);
      expect(character.sampleConversation.length).toBeGreaterThanOrEqual(4);
      expect(character.seo.title).toContain('SoulPrompts');
      expect(character.seo.description.length).toBeGreaterThan(40);
      expect(character.tier).toMatch(/^(free|premium|nsfw)$/);
      expect(character.contentRating).toMatch(/^(sfw|nsfw)$/);
      expect(typeof character.price).toBe('number');
    }
  });

  test('has correct tier distribution', () => {
    const free = characters.filter((c) => c.tier === 'free');
    const premium = characters.filter((c) => c.tier === 'premium');
    const nsfw = characters.filter((c) => c.tier === 'nsfw');
    expect(free.length).toBe(2);
    expect(premium.length).toBe(2);
    expect(nsfw.length).toBe(2);
  });

  test('premium and nsfw characters have price and CPF preview', () => {
    const paid = characters.filter((c) => c.tier === 'premium' || c.tier === 'nsfw');
    for (const character of paid) {
      expect(character.price).toBeGreaterThan(0);
      expect(character.systemPromptCpfPreview.length).toBeGreaterThan(50);
      expect(character.stats.fullLines).toBeGreaterThan(character.stats.liteLines);
    }
  });

  test('SFW/NSFW filter helpers work correctly', () => {
    const sfw = getSfwCharacters();
    const nsfw = getNsfwCharacters();
    expect(sfw.length).toBe(4);
    expect(nsfw.length).toBe(2);
    expect(sfw.every((c) => c.contentRating === 'sfw')).toBe(true);
    expect(nsfw.every((c) => c.contentRating === 'nsfw')).toBe(true);
  });

  test('NSFW characters have higher prices than SFW', () => {
    const nsfw = getNsfwCharacters();
    for (const character of nsfw) {
      expect(character.price).toBeGreaterThan(9.99);
    }
  });
});
