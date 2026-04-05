<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let filterTier: 'all' | 'public' | 'private' | 'nsfw' = 'all';
  let searchQuery = '';

  const filters = [
    { key: 'all', label: 'All Archive' },
    { key: 'public', label: 'Public' },
    { key: 'private', label: 'Private' },
    { key: 'nsfw', label: '18+' }
  ] as const;

  $: filtered = data.prompts.filter((prompt) => {
    const matchesTier =
      filterTier === 'all' ||
      (filterTier === 'public' && prompt.accessMode === 'public') ||
      (filterTier === 'private' && prompt.accessMode === 'private' && prompt.contentRating === 'sfw') ||
      (filterTier === 'nsfw' && prompt.contentRating === 'nsfw');

    const term = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !term ||
      prompt.title.toLowerCase().includes(term) ||
      prompt.archetype.toLowerCase().includes(term) ||
      prompt.tone.join(' ').toLowerCase().includes(term);

    return matchesTier && matchesSearch;
  });

  function countFor(filter: (typeof filters)[number]['key']): number {
    if (filter === 'all') return data.prompts.length;
    if (filter === 'public') return data.prompts.filter((prompt) => prompt.accessMode === 'public').length;
    if (filter === 'private') return data.prompts.filter((prompt) => prompt.accessMode === 'private' && prompt.contentRating === 'sfw').length;
    return data.prompts.filter((prompt) => prompt.contentRating === 'nsfw').length;
  }
</script>

<Seo title={data.seo.title} description={data.seo.description} path="/catalog/" />

<section class="site-wrap-wide px-0 pb-12 pt-24 md:pb-16 md:pt-32 relative">
  <div class="absolute inset-0 bg-gradient-to-b from-[var(--bg-elevated)] to-transparent opacity-60 pointer-events-none z-[-1]"></div>
  <div class="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end relative z-10">
    <div class="space-y-6">
      <div class="eyebrow flex items-center gap-2"><span class="h-px w-6 bg-[var(--gold)] inline-block"></span> Discover the Archive</div>
      <h1 class="display-section max-w-xl text-white">
        Find the exact <span class="bg-gradient-to-r from-[var(--gold)] to-[var(--accent)] bg-clip-text text-transparent italic">emotional mess</span> you want to enter.
      </h1>
      <p class="max-w-xl text-[1.05rem] leading-relaxed text-[var(--text-muted)]">
        Public prompts stay fully accessible. Private prompts reveal the story frame, voice, and overview while the full prompt routes through Patreon.
      </p>
    </div>

    <div class="premium-glass p-8 md:p-10 shadow-2xl border-t-[var(--gold)]/20">
      <label class="block relative group">
        <div class="text-[0.65rem] uppercase tracking-widest text-[var(--text-dim)] font-bold mb-3 flex items-center gap-2">
          <span class="material-symbols-outlined text-[1.1rem]">search</span> Search the archive
        </div>
        <div class="relative">
          <input
            bind:value={searchQuery}
            class="field-shell w-full pl-6 pr-4 py-4 text-[1rem] bg-black/40 border-white/10 rounded-xl focus:border-[var(--gold)] focus:ring-1 focus:ring-[var(--gold)]/50 transition-all placeholder:text-white/20 text-white"
            type="text"
            placeholder="wrong number, thriller, slow burn..."
          />
          <div class="absolute right-4 top-1/2 -translate-y-1/2 text-[0.65rem] uppercase tracking-widest text-[var(--gold)] font-bold bg-[var(--gold)]/10 px-2 py-1 rounded">
            {filtered.length} result{filtered.length === 1 ? '' : 's'}
          </div>
        </div>
      </label>
    </div>
  </div>
</section>

<section class="site-wrap-wide px-0 pb-10 relative z-20">
  <div class="flex gap-3 overflow-x-auto pb-4 no-scrollbar border-b border-white/5">
    {#each filters as filter}
      <button
        class={`px-5 py-2.5 rounded-full text-[0.75rem] font-bold tracking-wider uppercase transition-all duration-300 border flex items-center gap-2 whitespace-nowrap
        ${filterTier === filter.key 
          ? 'bg-[var(--gold)] text-white border-[var(--gold)] shadow-[0_0_15px_rgba(139,92,246,0.4)]' 
          : 'bg-white/5 text-[var(--text-dim)] border-white/10 hover:bg-white/10 hover:text-white'}`}
        on:click={() => (filterTier = filter.key)}
      >
        {filter.label}
        <span class={`px-2 py-0.5 rounded-full text-[0.6rem] ${filterTier === filter.key ? 'bg-black/20 text-white' : 'bg-black/40 text-white/50'}`}>
          {countFor(filter.key)}
        </span>
      </button>
    {/each}
  </div>
</section>

{#if filterTier === 'all' && !searchQuery.trim()}
  <section class="site-wrap-wide px-0 py-12 md:py-16">
    <div class="mb-10 min-w-0">
      <div class="eyebrow flex items-center gap-2"><span class="h-px w-6 bg-[var(--accent)] inline-block"></span> Flagship Selection</div>
      <h2 class="font-display mt-4 text-[3.2rem] leading-none tracking-tight text-white">
        Public doors, private vaults, one living archive.
      </h2>
    </div>

    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {#each data.featured as prompt}
        <a href={`/characters/${prompt.slug}/`} class="card-hover premium-glass min-h-[280px] p-8 flex flex-col justify-between group overflow-hidden border-t-emerald-400/20">
          <div class="font-display text-[8rem] italic leading-none text-white/5 absolute -right-4 -top-4 pointer-events-none group-hover:scale-110 group-hover:text-emerald-400/10 group-hover:-rotate-6 transition-all duration-500">
            {prompt.title[0]}
          </div>
          <div class="relative z-10 flex flex-col h-full justify-between gap-6">
            <div class="text-[0.65rem] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-1 rounded w-fit">
              {prompt.accessMode === 'public' ? 'Public' : 'Private'}
            </div>
            <div class="mt-auto">
              <h3 class="font-display text-[2.2rem] leading-[1.05] tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                {prompt.title}
              </h3>
              <p class="mt-4 text-[0.9rem] leading-relaxed text-[var(--text-muted)] border-l border-white/10 pl-3 group-hover:border-emerald-400/30 transition-colors">{prompt.tagline}</p>
            </div>
            <div class="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-dim)] bg-white/5 px-2 py-1 rounded w-fit border border-white/5 mt-4 group-hover:text-white/70 transition-colors">
              {prompt.archetype}
            </div>
          </div>
        </a>
      {/each}
    </div>
  </section>
{/if}

<section class="site-wrap-wide px-0 py-12 md:py-16">
  {#if filtered.length === 0}
    <div class="premium-glass p-16 text-center shadow-2xl">
      <span class="material-symbols-outlined text-[4rem] text-white/10 mb-6 drop-shadow-md">search_off</span>
      <div class="font-display text-[3rem] leading-none text-white tracking-tight">Nothing found in the archive.</div>
      <p class="mx-auto mt-6 max-w-xl text-[1.1rem] leading-relaxed text-[var(--text-muted)]">
        Try a character name, a tone like <strong class="text-white font-medium">romance</strong> or <strong class="text-white font-medium">thriller</strong>, or clear the filters to reopen the full selection.
      </p>
      <button class="gold-button mt-8" on:click={() => { searchQuery = ''; filterTier = 'all'; }}>
        Reset Filter
      </button>
    </div>
  {:else}
    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {#each filtered as prompt}
        <a href={`/characters/${prompt.slug}/`} class="card-hover premium-glass group min-h-[400px] overflow-hidden p-8 flex flex-col justify-between">
          <div class="absolute right-[-2rem] top-[-2rem] font-display text-[12rem] italic leading-none text-white/5 transition-transform duration-500 group-hover:scale-110 group-hover:text-[var(--gold)]/10 group-hover:-rotate-3 pointer-events-none">
            {prompt.title[0]}
          </div>

          <div class="relative z-10 flex h-full flex-col justify-between gap-8">
            <div class="flex items-start justify-between gap-4">
              <span class={`text-[0.65rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded ${prompt.accessMode === 'public' ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20' : prompt.contentRating === 'nsfw' ? 'text-rose-400 bg-rose-400/10 border border-rose-400/20' : 'text-[var(--gold)] bg-[var(--gold)]/10 border border-[var(--gold)]/20'}`}>
                {prompt.accessMode === 'public'
                  ? 'Public'
                  : prompt.contentRating === 'nsfw'
                    ? '18+ Private'
                    : 'Private'}
              </span>
              <span class="text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-dim)] bg-white/5 px-2 py-1 rounded border border-white/5">{prompt.region}</span>
            </div>

            <div class="space-y-5 mt-auto">
              <div>
                <h3 class="font-display text-[2.6rem] leading-[1.05] tracking-tight text-white group-hover:text-[var(--gold)] transition-colors">
                  {prompt.title}
                </h3>
                <div class="mt-4 text-[0.7rem] font-bold uppercase tracking-widest text-[var(--gold)] flex items-center gap-2">
                  <span class="bg-[var(--gold)]/10 px-2.5 py-1 rounded-md border border-[var(--gold)]/20">{prompt.archetype}</span>
                  <span class="text-[var(--text-dim)] mx-1">/</span>
                  <span class="text-white/60">{prompt.tone.slice(0, 2).join(', ')}</span>
                </div>
                <p class="mt-5 text-[0.95rem] leading-relaxed text-[var(--text-muted)] border-l-[2px] border-white/10 pl-4 group-hover:border-[var(--gold)]/40 transition-colors">{prompt.teaser}</p>
              </div>
            </div>

            <div class="flex items-center justify-between text-[0.65rem] font-bold uppercase tracking-widest text-[var(--text-dim)] pt-6 border-t border-[var(--border)] group-hover:text-white/70 transition-colors">
              <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[1rem] leading-none">{prompt.accessMode === 'private' ? 'lock' : 'check_circle'}</span> {prompt.accessMode === 'private' ? 'Overview live' : 'Full prompt live'}</span>
              <span class="bg-white/5 border border-white/10 px-2 py-1 rounded text-white">{prompt.price > 0 ? `$${prompt.price}` : 'Free'}</span>
            </div>
          </div>
        </a>
      {/each}
    </div>
  {/if}
</section>
