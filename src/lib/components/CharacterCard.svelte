<script lang="ts">
  import type { CharacterDefinition } from '$lib/content/types';
  import CopyPromptButton from './CopyPromptButton.svelte';

  export let character: CharacterDefinition;

  $: previewLines = character.systemPromptLite.split('\n').slice(0, 8).join('\n');
  $: isPremium = character.tier === 'premium' || character.tier === 'nsfw';
  $: isNsfw = character.contentRating === 'nsfw';
</script>

<article class="card">
  <div class="card-topline">
    <div>
      <h3 class="card-title">{character.name}</h3>
      <p class="card-subtitle">{character.tagline}</p>
    </div>
    {#if isNsfw}
      <div style="display:flex; flex-direction:column; align-items:flex-end; gap:0.3rem;">
        <span class="tag tag-nsfw">🔞 ${character.price}</span>
        {#if character.nsfwTier}
          <span class="tag tag-nsfw-tier tag-nsfw-{character.nsfwTier}">{character.nsfwTier}</span>
        {/if}
      </div>
    {:else if isPremium}
      <span class="tag tag-accent">${character.price}</span>
    {:else}
      <span class="tag">Free</span>
    {/if}
  </div>

  <div class="tag-list" aria-label="{character.name} tones">
    <span class="tag tag-region">{character.region}</span>
    <span class="tag tag-gender">{character.gender}</span>
    {#each character.tone as tone}
      <span class="tag">{tone}</span>
    {/each}
  </div>

  <div class="code-window" aria-label="{character.name} prompt preview">
    <pre>{previewLines}</pre>
  </div>

  <p class="body-copy spacer-top" style="font-size: 0.85rem;">{character.audience}</p>

  {#if isPremium}
    <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap;">
      <span class="tag tag-cta" style="font-size: 0.75rem;">
        {character.stats.fullLines} lines
      </span>
      <span class="tag tag-cta" style="font-size: 0.75rem;">
        ~{character.stats.fullTokens} tokens saved
      </span>
    </div>
  {/if}

  <div class="card-actions">
    <a class="button button-primary" href="/characters/{character.slug}/">
      {isPremium ? 'View full character' : 'Open character page'}
    </a>
    <CopyPromptButton prompt={character.systemPromptLite} characterName={character.slug} />
  </div>
</article>
