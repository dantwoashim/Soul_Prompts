import { describe, expect, test } from 'vitest';
import { buildSeedSnapshot } from '../src/lib/server/cms/seed';
import { MemoryCmsRepository } from '../src/lib/server/cms/memory-store';

describe('cms-backed prompt content', () => {
  test('seeds a non-trivial prompt archive with required fields', () => {
    const snapshot = buildSeedSnapshot();
    expect(snapshot.prompts.length).toBeGreaterThan(20);

    for (const prompt of snapshot.prompts) {
      expect(prompt.id).toBeTruthy();
      expect(prompt.draft.slug).toBeTruthy();
      expect(prompt.draft.title).toBeTruthy();
      expect(prompt.draft.tagline.length).toBeGreaterThan(10);
      expect(prompt.draft.overview.length).toBeGreaterThan(20);
      expect(prompt.draft.modelNotes.length).toBeGreaterThanOrEqual(2);
      expect(prompt.draft.seo.title).toContain('SoulPrompts');
      expect(prompt.draft.contentRating).toMatch(/^(sfw|nsfw)$/);
      expect(prompt.draft.accessMode).toMatch(/^(public|private)$/);
    }
  });

  test('seeded archive includes both public and private prompts', () => {
    const snapshot = buildSeedSnapshot();
    const publicPrompts = snapshot.prompts.filter((prompt) => prompt.draft.accessMode === 'public');
    const privatePrompts = snapshot.prompts.filter((prompt) => prompt.draft.accessMode === 'private');

    expect(publicPrompts.length).toBeGreaterThan(0);
    expect(privatePrompts.length).toBeGreaterThan(0);
  });

  test('public prompt pages expose the full prompt while private ones do not', async () => {
    const repository = new MemoryCmsRepository();
    const publicPage = await repository.getPublishedPromptBySlug('megha-boyfriend');
    const privatePage = await repository.getPublishedPromptBySlug('priya-after-hours');

    expect(publicPage).not.toBeNull();
    expect(privatePage).not.toBeNull();
    expect(publicPage?.isPrivate).toBe(false);
    expect(publicPage?.prompt.fullPrompt.length).toBeGreaterThan(100);
    expect(privatePage?.isPrivate).toBe(true);
    expect(privatePage?.prompt.fullPrompt).toBe('');
    expect(privatePage?.patreonUrl.length).toBeGreaterThan(0);
  });

  test('homepage shelves remain populated from the cms repository', async () => {
    const repository = new MemoryCmsRepository();
    const data = await repository.getPublishedHomePage();

    expect(data.archiveHighlights.length).toBeGreaterThan(0);
    expect(data.memberDrops.length).toBeGreaterThan(0);
    expect(data.promptCounts.totalPrompts).toBeGreaterThan(20);
    expect(data.archiveHighlights.every((prompt) => prompt.accessMode === 'public' || prompt.featuredGroups.includes('home_featured'))).toBe(true);
  });

  test('related prompt recommendations prefer the same content rating', async () => {
    const repository = new MemoryCmsRepository();
    const sfwPage = await repository.getPublishedPromptBySlug('megha-boyfriend');
    const nsfwPage = await repository.getPublishedPromptBySlug('priya-after-hours');

    expect(sfwPage?.related.length).toBeGreaterThan(0);
    expect(sfwPage?.related.every((prompt) => prompt.contentRating === 'sfw')).toBe(true);
    expect(nsfwPage?.related.length).toBeGreaterThan(0);
    expect(nsfwPage?.related.every((prompt) => prompt.contentRating === 'nsfw')).toBe(true);
  });
});
