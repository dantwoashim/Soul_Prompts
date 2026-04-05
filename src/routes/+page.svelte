<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  $: spotlight = data.spotlight;
  $: archiveHighlights = data.archiveHighlights;
  $: memberDrops = data.memberDrops;
  $: document = data.document;
</script>

<Seo title={data.seo.title} description={data.seo.description} path="/" />

<section class="site-wrap-wide px-0 pb-20 pt-16 md:pb-32 md:pt-28 relative">
  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-64 bg-gradient-to-b from-[var(--gold)]/10 to-transparent blur-3xl pointer-events-none"></div>

  <div class="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center relative z-10">
    <div class="space-y-8">
      <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[var(--gold)]/20 bg-[var(--gold)]/5 backdrop-blur-md">
        <span class="relative flex h-2.5 w-2.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--gold)] opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--gold)]"></span>
        </span>
        <span class="text-xs uppercase tracking-widest text-[var(--gold)] font-semibold">{document.heroBadge}</span>
      </div>

      <div class="space-y-6">
        <h1 class="display-hero">
          {document.heroTitle}
        </h1>
        <p class="max-w-2xl text-[1.1rem] leading-relaxed text-[var(--text-muted)]">
          {document.heroBody}
        </p>
      </div>

      <div class="flex flex-col gap-4 sm:flex-row pt-4">
        <a href={document.primaryCtaHref} class="gold-button w-full sm:w-auto">
          {document.primaryCtaLabel}
        </a>
        <a href={document.secondaryCtaHref} class="ghost-button w-full sm:w-auto">
          <span class="material-symbols-outlined text-[1.2rem]">menu_book</span>
          {document.secondaryCtaLabel}
        </a>
      </div>

      <div class="grid gap-6 border-t border-[var(--border)] pt-10 text-sm md:grid-cols-3">
        <div class="group">
          <div class="font-display text-5xl font-medium text-[var(--text)] transition-transform group-hover:-translate-y-1">{data.promptCounts.publicPrompts}</div>
          <div class="mt-3 text-xs uppercase tracking-widest text-[var(--text-dim)] font-semibold">Public Entries</div>
        </div>
        <div class="group">
          <div class="font-display text-5xl font-medium text-[var(--text)] transition-transform group-hover:-translate-y-1">{data.promptCounts.totalPrompts}</div>
          <div class="mt-3 text-xs uppercase tracking-widest text-[var(--text-dim)] font-semibold">Total Drops</div>
        </div>
        <div class="group">
          <div class="font-display text-5xl font-medium text-[var(--gold)] transition-transform group-hover:-translate-y-1">Studio</div>
          <div class="mt-3 text-xs uppercase tracking-widest text-[var(--text-dim)] font-semibold">Copy, Paste, Scene</div>
        </div>
      </div>
    </div>

    <div class="premium-glass card-hover relative min-h-[580px] p-8 md:p-12 group flex flex-col justify-between overflow-hidden lg:-mr-8 xl:-mr-12 border-t border-t-[var(--gold)]/20 shadow-2xl">
      <div class="absolute inset-0 z-0 bg-gradient-to-br from-[var(--bg-elevated)]/90 via-[var(--bg)]/80 to-[var(--bg)]/95"></div>

      <div class="absolute -right-12 -top-12 font-display text-[24rem] italic leading-none text-[var(--gold)]/5 transition-transform duration-700 group-hover:-translate-x-8 mix-blend-screen pointer-events-none">
        {spotlight?.title?.[0] ?? 'S'}
      </div>

      <div class="relative z-10 flex h-full flex-col justify-between gap-10">
        <div class="flex items-center justify-between gap-4">
          <span class="meta-chip border-[var(--accent)]/30 text-[var(--accent)] bg-[var(--accent)]/10 font-bold tracking-widest px-3 py-1.5 rounded-md"><span class="animate-pulse mr-1.5 h-1.5 w-1.5 rounded-full bg-[var(--accent)] inline-block"></span> Featured Entry</span>
          <span class="text-[0.65rem] uppercase tracking-widest text-[var(--text-dim)] font-bold">{spotlight?.accessMode === 'public' ? 'Public prompt' : 'Private vault prompt'}</span>
        </div>

        {#if spotlight}
          <div class="max-w-md space-y-6 mt-auto">
            <div>
              <div class="eyebrow flex items-center gap-2"><span class="h-px w-6 bg-[var(--gold)] inline-block"></span> Spotlight</div>
              <h2 class="font-display mt-4 text-[4rem] leading-[0.9] tracking-tight text-white group-hover:text-[var(--gold)] transition-colors duration-300">
                {spotlight.title}
              </h2>
              <p class="mt-5 text-[1.05rem] leading-relaxed text-[var(--text-muted)] border-l-2 border-[var(--border)] pl-4 italic">{spotlight.tagline}</p>
            </div>

            <div class="grid gap-4 text-sm text-[var(--text-muted)] sm:grid-cols-2 pt-4">
              <div class="bg-white/5 p-4 rounded-xl border border-white/5">
                <div class="text-[0.65rem] uppercase tracking-widest text-[var(--text-dim)] font-bold mb-2">Best For</div>
                <div class="font-medium text-white/90 leading-relaxed">{spotlight.archetype} scenes with long memory.</div>
              </div>
              <div class="bg-white/5 p-4 rounded-xl border border-white/5">
                <div class="text-[0.65rem] uppercase tracking-widest text-[var(--text-dim)] font-bold mb-2">Access</div>
                <div class="font-medium text-white/90 leading-relaxed">{spotlight.accessMode === 'public' ? 'Instant copy flow.' : 'Overview public, full prompt inside Patreon.'}</div>
              </div>
            </div>
          </div>

          <div class="space-y-4 pt-6">
            <a href={`/characters/${spotlight.slug}/`} class="gold-button w-full justify-between items-center group/btn">
              <span>Open Prompt</span>
              <span class="material-symbols-outlined transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
            </a>
            <a href="/vault/" class="ghost-button w-full border-white/10 hover:border-white/20 hover:bg-white/5">
              Open Membership
            </a>
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>

<section class="site-wrap-wide px-0 py-20 md:py-32 relative">
  <div class="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
    <div class="space-y-6">
      <div class="eyebrow flex items-center gap-2"><span class="h-px w-6 bg-[var(--gold)] inline-block"></span> {document.tutorialEyebrow}</div>
      <h2 class="display-section max-w-xl text-white">
        {document.tutorialTitle}
      </h2>
      <p class="max-w-xl text-[1.1rem] leading-relaxed text-[var(--text-muted)]">
        {document.tutorialBody}
      </p>
    </div>

    <div class="grid gap-5 md:grid-cols-3">
      {#each data.shell.settings.aiStudioUrl ? archiveHighlights.slice(0, 3) : archiveHighlights.slice(0, 3) as prompt, index}
        <article class="premium-glass card-hover flex min-h-[260px] flex-col justify-between p-7 group relative">
          <div class="absolute top-0 right-0 p-6 font-display text-7xl font-bold text-white/5 group-hover:text-[var(--gold)]/10 transition-colors pointer-events-none">{index + 1}</div>
          <div class="space-y-5 relative z-10">
            <div class="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--gold)] bg-[var(--gold)]/10 px-2.5 py-1 rounded inline-block">
              {prompt.accessMode === 'public' ? 'Public' : 'Private'}
            </div>
            <h3 class="font-display text-[2rem] leading-[1.1] tracking-tight text-white group-hover:text-[var(--gold)] transition-colors">
              {prompt.title}
            </h3>
            <p class="text-[0.9rem] leading-relaxed text-[var(--text-muted)]">{prompt.overview}</p>
          </div>
          <a href={`/characters/${prompt.slug}/`} class="link-underline mt-8 text-[0.7rem] font-bold uppercase tracking-widest w-fit group-hover:text-white transition-colors relative z-10 flex items-center gap-1.5">
            Open Prompt <span class="material-symbols-outlined text-sm">arrow_right_alt</span>
          </a>
        </article>
      {/each}
    </div>
  </div>
</section>

<section class="site-wrap-wide px-0 py-20 md:py-32 relative border-t border-[var(--border)]">
  <div class="absolute inset-0 bg-gradient-to-b from-[var(--bg-elevated)] to-transparent opacity-50 pointer-events-none"></div>
  <div class="relative z-10">
    <div class="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <div class="eyebrow flex items-center gap-2"><span class="h-px w-6 bg-[var(--accent)] inline-block"></span> {document.startFreeEyebrow}</div>
        <h2 class="display-section mt-4 text-white">{document.startFreeTitle}</h2>
      </div>
      <a href="/catalog/" class="gold-button px-6 py-3 text-[0.75rem]">
        {document.startFreeCtaLabel}
      </a>
    </div>

    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {#each archiveHighlights as prompt}
        <a href={`/characters/${prompt.slug}/`} class="premium-glass card-hover group min-h-[380px] p-8 flex flex-col justify-between overflow-hidden">
          <div class="absolute right-[-2rem] top-[-2rem] font-display text-[12rem] italic leading-none text-white/5 transition-transform duration-500 group-hover:scale-110 group-hover:text-[var(--gold)]/10 group-hover:-rotate-3 pointer-events-none">
            {prompt.title[0]}
          </div>

          <div class="relative z-10 flex items-start justify-between gap-4">
            <span class={`text-[0.65rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded ${prompt.accessMode === 'public' ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20' : prompt.contentRating === 'nsfw' ? 'text-rose-400 bg-rose-400/10 border border-rose-400/20' : 'text-[var(--gold)] bg-[var(--gold)]/10 border border-[var(--gold)]/20'}`}>
              {prompt.accessMode === 'public' ? 'Public' : prompt.contentRating === 'nsfw' ? '18+ Private' : 'Private'}
            </span>
            <span class="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-dim)]">{prompt.archetype}</span>
          </div>

          <div class="relative z-10 space-y-4 mt-16 lg:mt-24">
            <div>
              <h3 class="font-display text-[2.5rem] leading-[1.05] tracking-tight text-white group-hover:text-[var(--gold)] transition-colors">
                {prompt.title}
              </h3>
              <p class="mt-4 text-[0.95rem] leading-relaxed text-[var(--text-muted)] border-l border-[var(--border)] pl-3 group-hover:border-[var(--gold)]/30 transition-colors">{prompt.teaser}</p>
            </div>
          </div>

          <div class="relative z-10 flex items-center justify-between text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-dim)] border-t border-[var(--border)] pt-5 mt-8 group-hover:text-white/70 transition-colors">
            <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[1rem] leading-none">{prompt.accessMode === 'private' ? 'lock' : 'check_circle'}</span> {prompt.accessMode === 'private' ? 'Overview live' : 'Full prompt live'}</span>
            <span class="bg-white/5 px-2 py-1 rounded text-white font-medium">{prompt.price > 0 ? `$${prompt.price}` : 'Free'}</span>
          </div>
        </a>
      {/each}
    </div>
  </div>
</section>

<section class="site-wrap-wide px-0 py-20 md:py-32">
  <div class="grid gap-16 lg:grid-cols-[1fr_1.2fr] items-center">
    <div class="space-y-6">
      <div class="eyebrow flex items-center gap-2"><span class="h-px w-6 bg-[var(--gold)] inline-block"></span> {document.whyEyebrow}</div>
      <h2 class="display-section max-w-xl text-white">
        {document.whyTitle}
      </h2>
    </div>

    <div class="grid gap-5">
      {#each document.featureCards as feature}
        <article class="premium-glass p-8 hover:bg-white/5 transition-colors border-l-[3px] border-l-transparent hover:border-l-[var(--gold)] group flex gap-6">
          <div class="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--gold)]/10 text-[var(--gold)] group-hover:scale-110 group-hover:bg-[var(--gold)] group-hover:text-white transition-all duration-300">
            <span class="material-symbols-outlined">auto_awesome</span>
          </div>
          <div>
            <h3 class="font-display text-[2rem] leading-none tracking-tight text-white group-hover:text-[var(--gold)] transition-colors">
              {feature.title}
            </h3>
            <p class="mt-3 text-[1rem] leading-relaxed text-[var(--text-muted)]">{feature.description}</p>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<section class="site-wrap-wide px-0 py-24 md:py-36 border-t border-[var(--border)] relative overflow-hidden rounded-3xl premium-glass my-12">
  <div class="absolute inset-0 z-0 bg-gradient-to-br from-[var(--gold)]/10 via-transparent to-[var(--accent)]/10 pointer-events-none"></div>
  <div class="absolute -top-1/2 -left-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--gold)]/20 to-transparent blur-3xl rounded-full opacity-50"></div>

  <div class="relative z-10 grid gap-12 lg:grid-cols-[1fr_1.2fr] px-8 md:px-16 items-center">
    <div class="space-y-8">
      <div>
        <div class="eyebrow flex items-center gap-2"><span class="h-px w-6 bg-[var(--gold)] inline-block"></span> {document.membershipEyebrow}</div>
        <h2 class="display-section mt-4 text-white">
          {document.membershipTitle}
        </h2>
      </div>
      <p class="max-w-xl text-[1.1rem] leading-relaxed text-[var(--text-muted)]">
        {document.membershipBody}
      </p>
      <a href="/vault/" class="gold-button text-[0.8rem] px-8 py-4 shadow-xl">
        {document.membershipCtaLabel} <span class="material-symbols-outlined ml-1">diamond</span>
      </a>
    </div>

    <div class="grid gap-5 sm:grid-cols-2">
      {#each memberDrops as prompt}
        <article class="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col justify-between p-7 hover:border-[var(--gold)]/40 hover:bg-black/60 transition-all group">
          <div>
            <div class="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-widest text-[var(--gold)]">
              <span class="material-symbols-outlined text-[1rem]">{prompt.contentRating === 'nsfw' ? 'visibility_off' : 'loyalty'}</span>
              {prompt.contentRating === 'nsfw' ? 'Private 18+' : 'Private Drop'}
            </div>
            <h3 class="font-display mt-4 text-[1.8rem] leading-[1.1] tracking-tight text-white group-hover:text-[var(--gold)] transition-colors">
              {prompt.title}
            </h3>
            <p class="mt-3 text-[0.9rem] leading-relaxed text-[var(--text-muted)] clamp-2">{prompt.tagline}</p>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>
