<script lang="ts">
  import type { CharacterDefinition } from '$lib/content/types';
  import CopyPromptButton from './CopyPromptButton.svelte';

  export let prompt: CharacterDefinition;

  $: isNsfw = prompt.contentRating === 'nsfw';
</script>

<article class="megha-card" id="megha-{prompt.slug}">
  <div class="megha-card__header">
    <div class="megha-card__meta">
      <h3 class="megha-card__title">{prompt.name}</h3>
      {#if isNsfw}
        <span class="tag tag-nsfw" style="font-size: 0.7rem;">
          🔞 {prompt.nsfwTier ?? 'nsfw'}
        </span>
      {:else}
        <span class="tag" style="font-size: 0.7rem;">SFW</span>
      {/if}
    </div>
    <p class="megha-card__tagline">{prompt.tagline}</p>
  </div>

  <p class="megha-card__audience">{prompt.audience}</p>

  <div class="megha-card__tones">
    {#each prompt.tone.slice(0, 5) as tone}
      <span class="tag">{tone}</span>
    {/each}
  </div>

  <!-- Sample conversation preview -->
  {#if prompt.sampleConversation && prompt.sampleConversation.length > 0}
    <div class="megha-card__preview">
      {#each prompt.sampleConversation.slice(0, 6) as msg}
        <div class="preview-msg preview-msg--{msg.speaker}">
          <span class="preview-msg__label">{msg.speaker === 'character' ? 'Megha' : 'You'}</span>
          <span class="preview-msg__text">{msg.text}</span>
        </div>
      {/each}
      {#if prompt.sampleConversation.length > 6}
        <div class="preview-msg preview-msg--fade">...</div>
      {/if}
    </div>
  {/if}

  <div class="megha-card__actions">
    <a class="button button-primary" href="/characters/{prompt.slug}/">
      Open prompt page
    </a>
    <CopyPromptButton prompt={prompt.systemPromptLite} characterName={prompt.slug} />
  </div>

  {#if prompt.comingSoonTeaser}
    <p class="megha-card__teaser">{prompt.comingSoonTeaser}</p>
  {/if}
</article>

<style>
  .megha-card {
    background: var(--bg-glass);
    border: 1px solid var(--border);
    border-radius: 1rem;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: border-color 0.25s, box-shadow 0.25s;
  }
  .megha-card:hover {
    border-color: var(--accent);
    box-shadow: 0 0 30px rgba(196, 161, 255, 0.06);
  }

  .megha-card__header {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .megha-card__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .megha-card__title {
    font-family: var(--font-serif);
    font-size: 1.25rem;
    color: var(--text-primary);
    margin: 0;
  }
  .megha-card__tagline {
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0;
    font-style: italic;
  }

  .megha-card__audience {
    color: var(--text-muted, var(--text-secondary));
    font-size: 0.82rem;
    line-height: 1.5;
    opacity: 0.8;
  }

  .megha-card__tones {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  /* Sample conversation preview */
  .megha-card__preview {
    background: rgba(0, 0, 0, 0.25);
    border-radius: 0.75rem;
    padding: 0.8rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    max-height: 220px;
    overflow: hidden;
    position: relative;
  }
  .megha-card__preview::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.5));
    pointer-events: none;
  }
  .preview-msg {
    display: flex;
    gap: 0.5rem;
    font-size: 0.78rem;
    line-height: 1.4;
  }
  .preview-msg__label {
    font-weight: 700;
    flex-shrink: 0;
    min-width: 40px;
    color: var(--accent);
  }
  .preview-msg--user .preview-msg__label {
    color: var(--cta, #ff7a5c);
  }
  .preview-msg__text {
    color: var(--text-secondary);
  }
  .preview-msg--fade {
    text-align: center;
    color: var(--text-secondary);
    opacity: 0.5;
    font-size: 0.8rem;
  }

  .megha-card__actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: auto;
  }

  .megha-card__teaser {
    font-size: 0.72rem;
    color: var(--text-secondary);
    opacity: 0.6;
    line-height: 1.4;
    font-style: italic;
    margin: 0;
  }
</style>
