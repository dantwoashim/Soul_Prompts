<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<Seo title="Prompt Studio | SoulPrompts" description="Owner prompt inventory for SoulPrompts." path="/dashboard/prompts/" noindex={true} />

<section class="p-6 md:p-8 xl:p-10">
  <div class="grid gap-8">
    <div class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
      <div class="space-y-5">
        <div class="eyebrow">Prompt Studio</div>
        <h1 class="display-section max-w-4xl text-white">Every prompt, every access decision, one release lane.</h1>
        <p class="max-w-3xl text-base leading-8 text-[var(--text-muted)]">Open a prompt to edit overview copy, switch public/private access, change the Patreon target, preview the public page, and publish when the release feels ready.</p>
      </div>

      <form method="POST" class="editorial-panel p-6">
        <div class="eyebrow">Quick Action</div>
        <h2 class="font-display mt-3 text-[2.2rem] leading-none tracking-[-0.04em] text-[var(--text)]">Start a new private draft.</h2>
        <button class="gold-button mt-6 w-full justify-center" type="submit" formaction="?/createPrompt">New Prompt Draft</button>
      </form>
    </div>

    <div class="grid gap-4">
      {#each data.prompts as prompt}
        <a href={`/dashboard/prompts/${prompt.id}/`} class="grid gap-4 rounded-[1.6rem] border border-white/8 bg-white/[0.03] px-5 py-5 transition-colors hover:border-[var(--gold)]/30 hover:bg-white/[0.05] lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div class="font-display text-[1.9rem] leading-none tracking-[-0.04em] text-white">{prompt.title}</div>
            <p class="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-muted)]">{prompt.overview}</p>
          </div>
          <div class="flex flex-wrap gap-2 lg:justify-end">
            <span class="meta-chip">{prompt.accessMode}</span>
            <span class="meta-chip">{prompt.contentRating}</span>
            <span class="meta-chip">{prompt.archetype}</span>
            {#if !prompt.hasPublishedVersion}
              <span class="meta-chip">Draft only</span>
            {/if}
          </div>
        </a>
      {/each}
    </div>
  </div>
</section>
