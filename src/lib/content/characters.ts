import type { CharacterDefinition, CharacterRegion, CharacterGender, CharacterArchetype, NsfwTier } from './types';
import { meghaUniverse } from './megha-universe';
import { southAsianFemale } from './characters-south-asian-f';
import { remainingCharacters, existingFree } from './characters-global';
import { nsfwCharacters } from './characters-nsfw';

// ── Re-export Megha Universe for dedicated showcase ────────────
export { meghaUniverse } from './megha-universe';

// ── Master character list ──────────────────────────────────────
export const characters: CharacterDefinition[] = [
  ...meghaUniverse,       // Flagship — appears first
  ...southAsianFemale,
  ...remainingCharacters,
  ...existingFree,
  ...nsfwCharacters,
];

// ── Filter Utilities ───────────────────────────────────────────

export function getAllCharacters(): CharacterDefinition[] {
  return characters;
}

export function getCharacterBySlug(slug: string): CharacterDefinition | undefined {
  return characters.find((c) => c.slug === slug);
}

export function getFreeCharacters(): CharacterDefinition[] {
  return characters.filter((c) => c.tier === 'free');
}

export function getPremiumCharacters(): CharacterDefinition[] {
  return characters.filter((c) => c.tier === 'premium');
}

export function getNsfwCharacters(): CharacterDefinition[] {
  return characters.filter((c) => c.tier === 'nsfw');
}

export function getSfwCharacters(): CharacterDefinition[] {
  return characters.filter((c) => c.contentRating === 'sfw');
}

// ── New Filters ────────────────────────────────────────────────

export function getByRegion(region: CharacterRegion): CharacterDefinition[] {
  return characters.filter((c) => c.region === region);
}

export function getByGender(gender: CharacterGender): CharacterDefinition[] {
  return characters.filter((c) => c.gender === gender);
}

export function getByArchetype(archetype: CharacterArchetype): CharacterDefinition[] {
  return characters.filter((c) => c.archetype === archetype);
}

export function getNsfwByTier(tier: NsfwTier): CharacterDefinition[] {
  return characters.filter((c) => c.nsfwTier === tier);
}

export function filterCharacters(opts: {
  contentRating?: 'sfw' | 'nsfw';
  region?: CharacterRegion;
  gender?: CharacterGender;
  archetype?: CharacterArchetype;
  nsfwTier?: NsfwTier;
}): CharacterDefinition[] {
  return characters.filter((c) => {
    if (opts.contentRating && c.contentRating !== opts.contentRating) return false;
    if (opts.region && c.region !== opts.region) return false;
    if (opts.gender && c.gender !== opts.gender) return false;
    if (opts.archetype && c.archetype !== opts.archetype) return false;
    if (opts.nsfwTier && c.nsfwTier !== opts.nsfwTier) return false;
    return true;
  });
}
