<script lang="ts">
  import AgeGate from '$lib/components/AgeGate.svelte';
  import CharacterCard from '$lib/components/CharacterCard.svelte';
  import MeghaCard from '$lib/components/MeghaCard.svelte';
  import FaqList from '$lib/components/FaqList.svelte';
  import ScrollReveal from '$lib/components/ScrollReveal.svelte';
  import Seo from '$lib/components/Seo.svelte';
  import WaitlistForm from '$lib/components/WaitlistForm.svelte';
  import { aiStudioSteps, featureCards, pricingTiers } from '$lib/site';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<Seo title={data.seo.title} description={data.seo.description} path="/" />

<main>
  <!-- HERO — Megha Universe -->
  <section class="hero">
    <div class="container" style="text-align: center; max-width: 800px;">
      <span class="eyebrow" style="margin-bottom: 0.5rem;">The Flagship Experience</span>
      <h1 class="hero-title" style="font-size: clamp(2rem, 5vw, 3.2rem); line-height: 1.15;">
        One wrong number.<br/>Four ways to get addicted.
      </h1>
      <p class="hero-copy" style="max-width: 600px; margin: 1rem auto 0;">
        Megha texted the wrong number at midnight. She should have stopped talking.
        She can't. Choose your perspective. Every conversation goes further than the last.
      </p>
      <p class="hero-copy" style="max-width: 500px; margin: 0.5rem auto 0; font-size: 0.82rem; opacity: 0.7;">
        All 4 prompts free. Paste into Google AI Studio. Start talking.
      </p>

      <div class="hero-actions" style="justify-content: center; margin-top: 1.5rem;">
        <a class="button button-primary" href="#megha-universe">Explore the universe</a>
        <a class="button button-secondary" href="#how-it-works">How to use</a>
      </div>

      <div class="hero-stats" aria-label="Megha Universe stats" style="justify-content: center; margin-top: 2rem;">
        <div class="stat-card">
          <strong>4</strong>
          <span>Perspectives</span>
        </div>
        <div class="stat-card">
          <strong>Free</strong>
          <span>All prompts</span>
        </div>
        <div class="stat-card">
          <strong>3k+</strong>
          <span>Tokens each</span>
        </div>
        <div class="stat-card">
          <strong>∞</strong>
          <span>Conversations</span>
        </div>
      </div>
    </div>
  </section>

  <!-- MEGHA UNIVERSE — The 4 Prompts -->
  <section class="section" id="megha-universe">
    <div class="container">
      <ScrollReveal>
        <div class="section-head">
          <span class="eyebrow">The Megha Universe</span>
          <h2 class="section-title">Same story. Four doors. Choose who you are.</h2>
          <p class="section-copy">
            Each prompt is a different entry point into one interconnected world.
            Megha is the AI character. You are the human. The question is: which human?
          </p>
        </div>
      </ScrollReveal>

      <div class="megha-grid">
        {#each data.meghaUniverse as prompt, i}
          <ScrollReveal delay={i * 120}>
            <MeghaCard {prompt} />
          </ScrollReveal>
        {/each}
      </div>
    </div>
  </section>

  <!-- HOW IT WORKS -->
  <section class="section" id="how-it-works">
    <div class="container">
      <ScrollReveal>
        <div class="section-head">
          <span class="eyebrow">Get started in 60 seconds</span>
          <h2 class="section-title">Copy. Paste. Talk.</h2>
          <p class="section-copy">
            All prompts work with Google AI Studio (free). Here's exactly how to set it up.
          </p>
        </div>
      </ScrollReveal>

      <div class="tutorial-steps">
        <!-- Step 1 -->
        <ScrollReveal>
          <div class="tutorial-step">
            <div class="tutorial-step__info">
              <span class="step-badge">1</span>
              <div>
                <strong>Open AI Studio & find System Instructions</strong>
                <p class="body-copy">
                  Go to <a href="https://aistudio.google.com/prompts/new_chat" target="_blank" rel="noopener">aistudio.google.com</a>.
                  Click <strong>"System Instructions"</strong> in the right sidebar. This is where the character prompt goes.
                </p>
              </div>
            </div>
            <div class="tutorial-step__image">
              <img src="/tutorial-1.jpg" alt="AI Studio — click System Instructions" loading="lazy" />
            </div>
          </div>
        </ScrollReveal>

        <!-- Step 2 -->
        <ScrollReveal delay={120}>
          <div class="tutorial-step">
            <div class="tutorial-step__info">
              <span class="step-badge">2</span>
              <div>
                <strong>Paste the copied prompt</strong>
                <p class="body-copy">
                  Click "Copy lite prompt" on any character card above. Then paste (Ctrl+V) into the System Instructions panel.
                  The title auto-fills. You're good.
                </p>
              </div>
            </div>
            <div class="tutorial-step__image">
              <img src="/tutorial-2.png" alt="AI Studio — paste prompt into System Instructions" loading="lazy" />
            </div>
          </div>
        </ScrollReveal>

        <!-- Step 3 -->
        <ScrollReveal delay={240}>
          <div class="tutorial-step">
            <div class="tutorial-step__info">
              <span class="step-badge">3</span>
              <div>
                <strong>Set Thinking Level to Low or Minimal</strong>
                <p class="body-copy">
                  <strong>Important for NSFW prompts:</strong> In the right sidebar, find <strong>"Thinking level"</strong>
                  and set it to <strong>Low</strong> or <strong>Minimal</strong>. This allows the model to work with mature content.
                  Then start chatting!
                </p>
              </div>
            </div>
            <div class="tutorial-step__image">
              <img src="/tutorial-3.png" alt="AI Studio — set Thinking Level to Low or Minimal" loading="lazy" />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>


  <!-- MORE CHARACTERS (existing library) -->
  {#if data.characters.length > 0}
    <section class="section" id="characters">
      <div class="container">
        <ScrollReveal>
          <div class="section-head">
            <span class="eyebrow">More characters</span>
            <h2 class="section-title">The expanding roster. Coming soon.</h2>
            <p class="section-copy">
              Beyond the Megha Universe — standalone characters from around the world,
              each with their own world, voice, and addiction mechanic.
            </p>
          </div>
        </ScrollReveal>

        <div class="character-grid">
          {#each data.characters as character, i}
            <ScrollReveal delay={i * 100}>
              <CharacterCard {character} />
            </ScrollReveal>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  <!-- NSFW CHARACTERS (Age-gated) -->
  {#if data.nsfwCharacters.length > 0}
    <section class="section" id="nsfw">
      <div class="container">
        <ScrollReveal>
          <div class="section-head">
            <span class="eyebrow nsfw-eyebrow">🔞 Adult content</span>
            <h2 class="section-title">Characters with no safety rails.</h2>
            <p class="section-copy">
              Explicit sexual content, mature psychological themes, and
              uncensored character behavior. Age verification required.
            </p>
          </div>
        </ScrollReveal>

        <AgeGate>
          <div class="character-grid">
            {#each data.nsfwCharacters as character, i}
              <ScrollReveal delay={i * 100}>
                <CharacterCard {character} />
              </ScrollReveal>
            {/each}
          </div>
        </AgeGate>
      </div>
    </section>
  {/if}

  <!-- PRICING -->
  <section class="section" id="pricing">
    <div class="container">
      <ScrollReveal>
        <div class="section-head">
          <span class="eyebrow">Pricing</span>
          <h2 class="section-title">The Megha Universe is free. Full engines are coming.</h2>
          <p class="section-copy">
            All 4 Megha prompts are free forever. Premium expansions, custom character engines,
            and conversation tools are on the way.
          </p>
        </div>
      </ScrollReveal>

      <div class="pricing-grid">
        {#each pricingTiers as tier, i}
          <ScrollReveal delay={i * 120}>
            <div class="pricing-card {tier.featured ? 'pricing-card-featured' : ''}">
              <span class="eyebrow">{tier.name}</span>
              <div class="price-tag">{tier.price} {#if tier.name === 'Full CPF'}<span>/character</span>{/if}</div>
              <p class="body-copy" style="margin-bottom: 1.2rem;">{tier.description}</p>
              <ul style="list-style: none; padding: 0; margin: 0 0 1.5rem; text-align: left;">
                {#each tier.features as feature}
                  <li style="padding: 0.35rem 0; color: var(--text-secondary); font-size: 0.88rem;">
                    <span style="color: var(--accent); margin-right: 0.5rem;">✓</span>{feature}
                  </li>
                {/each}
              </ul>
              <a
                class="button {tier.featured ? 'button-cta' : 'button-secondary'}"
                href={tier.ctaHref}
                style="width: 100%;"
              >
                {tier.cta}
              </a>
            </div>
          </ScrollReveal>
        {/each}
      </div>
    </div>
  </section>

  <!-- CTA + FAQ -->
  <section class="section" id="waitlist">
    <div class="container faq-grid">
      <ScrollReveal>
        <div class="detail-grid__panel">
          <span class="eyebrow">Stay updated</span>
          <h2 class="section-title" style="font-size: clamp(1.8rem, 4vw, 2.6rem);">
            New perspectives and characters drop when demand proves the craft is valued.
          </h2>
          <p class="section-copy">
            Join the list for new character drops, NSFW expansions, and the conversation parser tool.
          </p>
          <div class="spacer-top">
            <WaitlistForm
              placement="home-bottom"
              heading="Get first access"
              body="Waitlist members get new characters and tools first."
              buttonLabel="Reserve my spot"
            />
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={150}>
        <FaqList />
      </ScrollReveal>
    </div>
  </section>
</main>

<style>
  .megha-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-top: 2rem;
  }
  @media (max-width: 900px) {
    .megha-grid {
      grid-template-columns: 1fr;
    }
  }

  /* Tutorial steps */
  .tutorial-steps {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    margin-top: 2rem;
  }
  .tutorial-step {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 2rem;
    align-items: center;
    background: var(--bg-glass);
    border: 1px solid var(--border);
    border-radius: 1rem;
    padding: 1.5rem;
    transition: border-color 0.25s;
  }
  .tutorial-step:hover {
    border-color: var(--accent);
  }
  .tutorial-step__info {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }
  .tutorial-step__info strong {
    display: block;
    font-size: 1.05rem;
    color: var(--text-primary);
    margin-bottom: 0.4rem;
  }
  .tutorial-step__info .body-copy {
    font-size: 0.88rem;
    line-height: 1.6;
  }
  .tutorial-step__info a {
    color: var(--accent);
    text-decoration: underline;
  }
  .tutorial-step__image {
    border-radius: 0.75rem;
    overflow: hidden;
    border: 1px solid var(--border);
  }
  .tutorial-step__image img {
    width: 100%;
    height: auto;
    display: block;
  }
  @media (max-width: 768px) {
    .tutorial-step {
      grid-template-columns: 1fr;
    }
  }
</style>
