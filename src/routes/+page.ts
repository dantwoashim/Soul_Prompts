import { getSfwCharacters, getNsfwCharacters, meghaUniverse } from '$lib/content/characters';
import { getDefaultSeo } from '$lib/utils/seo';

export function load() {
  // Megha Universe prompts shown separately as hero product
  const meghaIds = new Set(meghaUniverse.map((c) => c.id));

  return {
    meghaUniverse,
    characters: getSfwCharacters().filter((c) => !meghaIds.has(c.id)),
    nsfwCharacters: getNsfwCharacters().filter((c) => !meghaIds.has(c.id)),
    seo: getDefaultSeo()
  };
}
