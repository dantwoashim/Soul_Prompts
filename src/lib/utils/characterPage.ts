import { error } from '@sveltejs/kit';
import { getAllCharacters, getCharacterBySlug } from '$lib/content/characters';
import type { CharacterDefinition } from '$lib/content/types';

export function getRelatedCharacters(
  character: CharacterDefinition,
  allCharacters: CharacterDefinition[] = getAllCharacters()
) {
  const sameArchetype = allCharacters.filter(
    (candidate) => candidate.slug !== character.slug && candidate.archetype === character.archetype
  );
  const preferredRelated = sameArchetype.filter(
    (candidate) => candidate.contentRating === character.contentRating
  );
  const fallbackRelated = sameArchetype.filter(
    (candidate) => candidate.contentRating !== character.contentRating
  );

  return [...preferredRelated, ...fallbackRelated].slice(0, 4);
}

export function getCharacterPageData(slug: string) {
  const character = getCharacterBySlug(slug);

  if (!character) {
    throw error(404, 'Character not found');
  }

  const related = getRelatedCharacters(character);

  return {
    character,
    related
  };
}
