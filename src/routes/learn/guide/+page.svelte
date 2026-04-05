<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<Seo title={data.seo.title} description={data.seo.description} path="/learn/guide/" />

<section class="site-wrap-wide px-0 pb-12 pt-12 md:pb-16 md:pt-20">
  <div class="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
    <div class="space-y-5">
      <div class="eyebrow">{data.document.eyebrow}</div>
      <h1 class="display-hero max-w-4xl text-[var(--text)]">
        {data.document.title}
      </h1>
      <p class="max-w-2xl text-base leading-8 text-[var(--text-muted)]">
        {data.document.body}
      </p>
      <div class="flex flex-col gap-3 sm:flex-row">
        <a href={data.document.primaryCtaHref} class="gold-button" target="_blank" rel="noopener noreferrer">
          {data.document.primaryCtaLabel}
        </a>
        <a href={data.document.secondaryCtaHref} class="ghost-button">
          {data.document.secondaryCtaLabel}
        </a>
      </div>
    </div>

    <div class="editorial-panel p-7 md:p-10">
      <div class="eyebrow">Quick Rule</div>
      <h2 class="font-display mt-4 text-[2.5rem] leading-none tracking-[-0.03em] text-[var(--text)]">
        {data.document.quickRuleTitle}
      </h2>
      <p class="mt-4 text-sm leading-7 text-[var(--text-muted)]">
        {data.document.quickRuleBody}
      </p>
    </div>
  </div>
</section>

<section class="site-wrap-wide px-0 py-12 md:py-16">
  <div class="grid gap-6">
    {#each data.document.steps as step, index}
      <article class="editorial-panel grid gap-6 overflow-hidden p-5 md:grid-cols-[1.1fr_0.9fr] md:p-6 lg:grid-cols-[1fr_0.9fr]">
        <div class="order-2 flex flex-col justify-between gap-6 md:order-1">
          <div class="space-y-4">
            <div class="text-xs uppercase tracking-[0.22em] text-[var(--gold)]">Step {index + 1}</div>
            <h2 class="font-display text-[2.6rem] leading-none tracking-[-0.03em] text-[var(--text)]">
              {step.title}
            </h2>
            <p class="max-w-xl text-sm leading-7 text-[var(--text-muted)]">{step.summary}</p>
          </div>

          <div class="border-t border-[rgba(255,198,62,0.08)] pt-4 text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">
            This image is taken from the real setup flow.
          </div>
        </div>

        <div class="order-1 md:order-2">
          <img
            src={step.image}
            alt={step.title}
            class="h-full min-h-[220px] w-full object-cover"
            loading="lazy"
          />
        </div>
      </article>
    {/each}
  </div>
</section>

<section class="site-wrap-wide px-0 py-12 md:py-16">
  <div class="grid gap-5 lg:grid-cols-2">
    <article class="editorial-panel p-6 md:p-8">
      <div class="eyebrow">What You Copy</div>
      <h2 class="font-display mt-4 text-[2.4rem] leading-none tracking-[-0.03em] text-[var(--text)]">
        {data.document.copyTitle}
      </h2>
      <p class="mt-4 text-sm leading-7 text-[var(--text-muted)]">
        {data.document.copyBody}
      </p>
    </article>

    <article class="editorial-panel p-6 md:p-8">
      <div class="eyebrow">How You Open</div>
      <h2 class="font-display mt-4 text-[2.4rem] leading-none tracking-[-0.03em] text-[var(--text)]">
        {data.document.openTitle}
      </h2>
      <div class="mt-6 grid gap-3">
        {#each data.document.starterMessages as message}
          <div class="border-b border-[rgba(255,198,62,0.08)] pb-3 text-sm leading-7 text-[var(--text-muted)]">
            "{message}"
          </div>
        {/each}
      </div>
    </article>
  </div>
</section>

<section class="site-wrap-wide px-0 py-12 md:py-16">
  <div class="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
    <div class="space-y-5">
      <div class="eyebrow">Quick Tips</div>
      <h2 class="display-section max-w-xl text-[var(--text)]">
        {data.document.quickTipsTitle}
      </h2>
    </div>

    <div class="grid gap-4">
      {#each data.document.quickTips as tip}
        <article class="editorial-panel p-6 text-sm leading-7 text-[var(--text-muted)]">
          {tip}
        </article>
      {/each}
    </div>
  </div>
</section>
