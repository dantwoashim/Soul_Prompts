<script lang="ts">
  import { onMount } from 'svelte';
  import AgeGate from '$lib/components/AgeGate.svelte';
  import AnimatedConversation from '$lib/components/AnimatedConversation.svelte';
  import BuyButton from '$lib/components/BuyButton.svelte';
  import CopyPromptButton from '$lib/components/CopyPromptButton.svelte';
  import PromptComparison from '$lib/components/PromptComparison.svelte';
  import ScrollReveal from '$lib/components/ScrollReveal.svelte';
  import Seo from '$lib/components/Seo.svelte';
  import WaitlistForm from '$lib/components/WaitlistForm.svelte';
  import { trackEvent } from '$lib/utils/analytics';
  import type { PageData } from './$types';

  export let data: PageData;

  $: c = data.character;
  $: isPremium = c.tier === 'premium' || c.tier === 'nsfw';
  $: isNsfw = c.contentRating === 'nsfw';

  // Only show a small preview in the DOM, never the full 48KB
  $: promptPreview = c.systemPromptLite.length > 1500
    ? c.systemPromptLite.substring(0, 1500) + '\n\n...\n[Full prompt: ' + Math.round(c.systemPromptLite.length / 1000) + 'K characters — use Copy button above]'
    : c.systemPromptLite;

  onMount(() => {
    trackEvent('Character Page View', { character: c.slug });
  });
</script>

<Seo
  title={c.seo.title}
  description={c.seo.description}
  path={`/characters/${c.slug}/`}
/>

<AgeGate enabled={isNsfw}>
  <main>
  <!-- HERO -->
  <section class="detail-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span>/</span>
        <a href="/#characters">Characters</a>
        <span>/</span>
        <span>{c.name}</span>
      </nav>

      <h1 class="page-title">{c.name}</h1>
      <p class="page-subtitle">{c.tagline}</p>

      <div class="tag-list">
        {#if isPremium}
          <span class="tag tag-accent">Premium — ${c.price}</span>
        {:else}
          <span class="tag">Free</span>
        {/if}
        {#each c.tone as tone}
          <span class="tag">{tone}</span>
        {/each}
      </div>

      <div class="detail-actions">
        <CopyPromptButton prompt={c.systemPromptLite} characterName={c.slug} />
        {#if isPremium}
          <BuyButton productUrl={c.gumroadUrl} price={c.price} characterName={c.slug} />
        {/if}
        <a class="button button-ghost" href="/#waitlist">Join waitlist for updates →</a>
      </div>
    </div>
  </section>

  <!-- PROMPT DISPLAY -->
  <section class="section">
    <div class="container detail-grid">
      <ScrollReveal>
        <div class="detail-grid__panel">
          <div class="prompt-header">
            <div>
              <p class="prompt-label">System prompt</p>
              <p class="body-copy" style="font-size: 0.82rem;">Copy directly into AI Studio system instructions.</p>
            </div>
            <CopyPromptButton
              prompt={c.systemPromptLite}
              characterName={c.slug}
              label="Copy prompt"
            />
          </div>

          <div class="prompt-info-card">
            <div class="prompt-info-stats">
              <span class="prompt-stat">
                <strong>{Math.round(c.systemPromptLite.length / 1000)}K</strong> characters
              </span>
              <span class="prompt-stat">
                <strong>{c.systemPromptLite.split('\n').length}</strong> lines
              </span>
            </div>
            <p class="body-copy" style="font-size: 0.82rem; margin-top: 0.5rem;">
              Click "Copy prompt" above, then paste into AI Studio's System Instructions.
            </p>
          </div>

          <details class="prompt-expand">
            <summary class="button button-secondary" style="font-size: 0.82rem; cursor: pointer; margin-top: 0.75rem;">
              Preview prompt text
            </summary>
            <div class="prompt-shell" style="max-height: 400px; overflow-y: auto; margin-top: 0.5rem;">
              <pre>{promptPreview}</pre>
            </div>
          </details>

          {#if isPremium}
            <div style="display: flex; gap: 0.5rem; margin-top: 0.85rem; flex-wrap: wrap;">
              <span class="tag" style="font-size: 0.75rem;">
                Lite: {c.stats.liteLines} lines / ~{c.stats.liteTokens} tokens
              </span>
              <span class="tag tag-accent" style="font-size: 0.75rem;">
                Full: {c.stats.fullLines} lines / ~{c.stats.fullTokens} tokens
              </span>
            </div>
          {/if}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={150}>
        <div class="detail-grid__panel">
          <h3>Use in AI Studio</h3>
          <div class="instruction-card">
            <p class="body-copy">
              Paste the lite prompt into system instructions, then start with a scene,
              tension, or relationship dynamic.
            </p>
          </div>

          <div class="step-list spacer-top">
            {#each c.modelNotes as note, index}
              <div class="step-item">
                <span class="step-badge">{index + 1}</span>
                <div>
                  <p class="body-copy">{note}</p>
                </div>
              </div>
            {/each}
          </div>

          <div class="instruction-card spacer-top">
            <strong>Coming in full version</strong>
            <p class="body-copy">{c.comingSoonTeaser}</p>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>

  <!-- LITE VS FULL COMPARISON (Premium only) -->
  {#if isPremium && c.systemPromptCpfPreview}
    <section class="section">
      <div class="container">
        <ScrollReveal>
          <div class="section-head">
            <span class="eyebrow">Lite vs Full</span>
            <h2 class="section-title" style="font-size: clamp(1.8rem, 4vw, 2.6rem);">
              See what the full character engine adds.
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <PromptComparison
            litePrompt={c.systemPromptLite}
            cpfPreview={c.systemPromptCpfPreview}
            price={c.price}
            gumroadUrl={c.gumroadUrl}
            characterName={c.slug}
          />
        </ScrollReveal>
      </div>
    </section>
  {/if}

  <!-- SAMPLE CONVERSATION -->
  <section class="section">
    <div class="container detail-grid">
      <ScrollReveal>
        <div class="detail-grid__panel">
          <h3>Sample conversation</h3>
          <p class="body-copy">
            This is the texture you should expect from the lite version when the opening is framed clearly.
          </p>
          <div class="spacer-top">
            <AnimatedConversation
              lines={c.sampleConversation}
              characterName={c.name}
            />
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={150}>
        <WaitlistForm
          placement={`character-${c.slug}`}
          heading="Want the deeper version?"
          body="Join the waitlist for full releases, future variants, and hosted character tools."
          buttonLabel="Notify me"
        />
      </ScrollReveal>
    </div>
  </section>
  </main>
</AgeGate>
