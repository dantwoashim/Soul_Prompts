import { error } from '@sveltejs/kit';
import { getAllCharacters, getCharacterBySlug } from '$lib/content/characters';

export function entries() {
  return getAllCharacters().map((character) => ({
    slug: character.slug
  }));
}

export function load({ params }: { params: { slug: string } }) {
  const character = getCharacterBySlug(params.slug);

  if (!character) {
    throw error(404, 'Character not found');
  }

  return {
    character
  };
}
