<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  const statCards = [
    { label: 'Prompts', value: data.overview.totals.prompts },
    { label: 'Public', value: data.overview.totals.publicPrompts },
    { label: 'Private', value: data.overview.totals.privatePrompts },
    { label: 'Draft-only', value: data.overview.totals.unpublishedDrafts }
  ];
</script>

<Seo title="Dashboard | SoulPrompts" description="Owner dashboard for SoulPrompts." path="/dashboard/" noindex={true} />

<section class="p-6 md:p-8 xl:p-10">
  <div class="grid gap-8">
    <div class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
      <div class="space-y-5">
        <div class="eyebrow">Overview</div>
        <h1 class="display-section max-w-4xl text-white">One dashboard to control the public archive, private prompt vault, and every release decision.</h1>
        <p class="max-w-3xl text-base leading-8 text-[var(--text-muted)]">Draft safely, preview instantly, publish only when ready, and keep private prompts completely out of the public payload until you want Patreon to take over.</p>
      </div>

      <form method="POST" class="editorial-panel p-6">
        <div class="eyebrow">Quick Action</div>
        <h2 class="font-display mt-3 text-[2.2rem] leading-none tracking-[-0.04em] text-[var(--text)]">Start a new prompt draft.</h2>
        <p class="mt-4 text-sm leading-7 text-[var(--text-muted)]">Creates a private draft immediately and drops you into the prompt studio.</p>
        <button class="gold-button mt-6 w-full justify-center" type="submit" formaction="?/createPrompt">New Prompt Draft</button>
      </form>
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {#each statCards as stat}
        <article class="editorial-panel p-6">
          <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">{stat.label}</div>
          <div class="font-display mt-4 text-5xl leading-none text-[var(--text)]">{stat.value}</div>
        </article>
      {/each}
    </div>

    <div class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <article class="editorial-panel p-6 md:p-8">
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="eyebrow">Prompt Radar</div>
            <h2 class="font-display mt-3 text-[2.4rem] leading-none tracking-[-0.04em] text-[var(--text)]">Live prompt inventory</h2>
          </div>
          <a href="/dashboard/prompts/" class="ghost-button">Open Prompt Studio</a>
        </div>

        <div class="mt-6 grid gap-4">
          {#each data.overview.prompts.slice(0, 10) as prompt}
            <a href={`/dashboard/prompts/${prompt.id}/`} class="grid gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition-colors hover:border-[var(--gold)]/30 hover:bg-white/[0.05] md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div class="font-display text-[1.6rem] leading-none tracking-[-0.03em] text-white">{prompt.title}</div>
                <p class="mt-3 text-sm leading-7 text-[var(--text-muted)]">{prompt.tagline}</p>
              </div>
              <div class="flex flex-wrap gap-2 md:justify-end">
                <span class="meta-chip">{prompt.accessMode}</span>
                <span class="meta-chip">{prompt.contentRating}</span>
                <span class="meta-chip">{prompt.archetype}</span>
              </div>
            </a>
          {/each}
        </div>
      </article>

      <div class="grid gap-6">
        <article class="editorial-panel p-6 md:p-8">
          <div class="eyebrow">Release Risks</div>
          <div class="mt-6 grid gap-4">
            <div class="rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4">
              <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Broken Patreon links</div>
              <div class="font-display mt-3 text-4xl leading-none text-white">{data.overview.totals.brokenPatreonLinks}</div>
            </div>
            <div class="rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4">
              <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Missing SEO</div>
              <div class="font-display mt-3 text-4xl leading-none text-white">{data.overview.totals.missingSeo}</div>
            </div>
            <div class="rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4">
              <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Missing prompt previews</div>
              <div class="font-display mt-3 text-4xl leading-none text-white">{data.overview.totals.missingPromptPreviews}</div>
            </div>
          </div>
        </article>

        <article class="editorial-panel p-6 md:p-8">
          <div class="eyebrow">Site Studio</div>
          <div class="mt-6 grid gap-3">
            {#each data.overview.documents as doc}
              <a href={doc.key === 'settings' ? '/dashboard/site/settings/' : `/dashboard/site/${doc.key}/`} class="rounded-2xl border border-white/8 bg-white/[0.03] px-5 py-4 transition-colors hover:border-[var(--gold)]/30 hover:bg-white/[0.05]">
                <div class="flex items-center justify-between gap-4">
                  <div class="font-display text-[1.5rem] leading-none tracking-[-0.03em] text-white">{doc.title}</div>
                  {#if doc.hasDraftChanges}
                    <span class="meta-chip">Draft changed</span>
                  {/if}
                </div>
                <div class="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Updated {new Date(doc.updatedAt).toLocaleString()}</div>
              </a>
            {/each}
          </div>
        </article>
      </div>
    </div>
  </div>
</section>
