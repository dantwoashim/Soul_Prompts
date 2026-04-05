<script lang="ts">
  import { onMount } from 'svelte';
  import AgeGate from '$lib/components/AgeGate.svelte';
  import CopyPromptButton from '$lib/components/CopyPromptButton.svelte';
  import Seo from '$lib/components/Seo.svelte';
  import SoulIntensityMeter from '$lib/components/SoulIntensityMeter.svelte';
  import type { PromptPageData } from '$lib/cms/types';
  import { trackEvent } from '$lib/utils/analytics';

  export let data: PromptPageData;

  $: prompt = data.prompt;
  $: related = data.related;
  $: isPrivate = data.isPrivate;
  $: isNsfw = prompt.contentRating === 'nsfw';
  $: intensityScore = isPrivate ? 94 : 72;
  $: memoryScore = isPrivate ? 89 : 63;
  $: realismScore = isPrivate ? 96 : 77;

  onMount(() => {
    trackEvent('Character Page View', { character: prompt.slug });
  });
</script>

<Seo title={data.seo.title} description={data.seo.description} path={`/characters/${prompt.slug}/`} />

<AgeGate enabled={isNsfw}>
  <section class="site-wrap-wide px-0 pb-12 pt-24 md:pb-24 md:pt-32 relative">
    <div class="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
      <div class="premium-glass card-hover relative min-h-[560px] overflow-hidden p-8 md:p-12 group flex flex-col justify-between shadow-2xl border-t border-[var(--gold)]/20">
        <div class="absolute inset-0 z-0 bg-gradient-to-br from-[var(--bg-elevated)]/90 via-[var(--bg)]/80 to-[var(--bg)]/95"></div>

        <div class="absolute right-[-2rem] top-12 font-display text-[20rem] italic leading-none text-white/5 md:text-[24rem] transition-transform duration-700 group-hover:-translate-x-4 pointer-events-none">
          {prompt.title[0]}
        </div>

        <div class="relative z-10 flex h-full flex-col justify-between gap-10">
          <div class="flex flex-wrap gap-2">
            <span class="meta-chip border-[var(--gold)]/30 text-[var(--gold)] bg-[var(--gold)]/10">
              {isPrivate ? (isNsfw ? '18+ Private Prompt' : 'Private Prompt') : 'Public Prompt'}
            </span>
            <span class="meta-chip border-white/10 text-white bg-white/5">{prompt.archetype}</span>
            <span class="meta-chip border-[var(--accent)]/30 text-[var(--accent)] bg-[var(--accent)]/10">{prompt.region}</span>
          </div>

          <div class="space-y-6 mt-auto">
            <div>
              <div class="eyebrow flex items-center gap-2"><span class="h-px w-6 bg-[var(--gold)] inline-block"></span> Prompt File</div>
              <h1 class="font-display mt-4 text-[4rem] leading-[0.9] tracking-tight text-white group-hover:text-[var(--gold)] transition-colors duration-300 md:text-[5.5rem]">
                {prompt.title}
              </h1>
              <p class="mt-5 max-w-xl text-[1.1rem] leading-relaxed text-[var(--text-muted)] border-l-2 border-[var(--border)] pl-4 italic">{prompt.tagline}</p>
            </div>

            <div class="grid gap-4 md:grid-cols-3 bg-white/5 p-5 rounded-xl border border-white/5">
              <div>
                <div class="text-[0.65rem] uppercase tracking-widest text-[var(--text-dim)] font-bold mb-2">Tone</div>
                <div class="text-sm font-medium text-white/90">{prompt.tone.slice(0, 3).join(' / ')}</div>
              </div>
              <div>
                <div class="text-[0.65rem] uppercase tracking-widest text-[var(--text-dim)] font-bold mb-2">Access</div>
                <div class="text-sm font-medium text-white/90">
                  {isPrivate ? 'Overview public, full prompt on Patreon' : 'Full prompt available now'}
                </div>
              </div>
              <div>
                <div class="text-[0.65rem] uppercase tracking-widest text-[var(--text-dim)] font-bold mb-2">Price</div>
                <div class="text-sm font-medium text-[var(--gold)]">{prompt.price > 0 ? `$${prompt.price}` : 'Free'}</div>
              </div>
            </div>
          </div>

          <div class="grid gap-5 md:grid-cols-3 pt-4 border-t border-white/10">
            <SoulIntensityMeter label="Intensity" value={intensityScore} color="amber" />
            <SoulIntensityMeter label="Memory" value={memoryScore} color="violet" />
            <SoulIntensityMeter label="Fidelity" value={realismScore} color="dim" />
          </div>
        </div>
      </div>

      <div class="grid gap-8">
        <article class="premium-glass p-8 md:p-10 border-t border-[var(--accent)]/10">
          <div class="eyebrow flex items-center gap-2"><span class="h-px w-6 bg-[var(--accent)] inline-block"></span> Summary</div>
          <h2 class="font-display mt-4 text-[2.8rem] leading-[1.05] tracking-tight text-white">
            The public-facing brief.
          </h2>
          <p class="mt-4 max-w-3xl text-[1rem] leading-relaxed text-[var(--text-muted)]">{prompt.overview}</p>

          <div class="mt-8 grid gap-8 md:grid-cols-2 pt-6 border-t border-white/10">
            <div>
              <div class="text-[0.65rem] uppercase tracking-widest text-[var(--text-dim)] font-bold mb-3 flex items-center gap-1.5"><span class="material-symbols-outlined text-[1rem]">group</span> Best For</div>
              <p class="text-sm leading-relaxed text-white/80">{prompt.audience}</p>
            </div>
            <div>
              <div class="text-[0.65rem] uppercase tracking-widest text-[var(--text-dim)] font-bold mb-3 flex items-center gap-1.5"><span class="material-symbols-outlined text-[1rem]">movie</span> Teaser</div>
              <p class="text-sm leading-relaxed text-white/80">{prompt.teaser}</p>
            </div>
          </div>
        </article>

        <div class="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <article class="premium-glass p-8">
            <div class="eyebrow flex items-center gap-2"><span class="h-px w-6 bg-[var(--gold)] inline-block"></span> {isPrivate ? 'Overview Preview' : 'Prompt Preview'}</div>
            <h2 class="font-display mt-4 text-[2.2rem] leading-none tracking-tight text-white">
              {isPrivate ? 'Public overview' : 'Full prompt block'}
            </h2>
            <div class="mt-6 bg-[#000000]/60 border border-white/5 rounded-xl p-5 relative group overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--bg)] pointer-events-none"></div>
              <pre class="overflow-x-auto whitespace-pre-wrap text-[0.85rem] leading-relaxed text-emerald-400 font-mono italic opacity-80 group-hover:opacity-100 transition-opacity">{isPrivate ? prompt.teaser : prompt.fullPrompt}</pre>
            </div>
          </article>

          <article class="premium-glass flex min-w-[280px] flex-col justify-between p-8 bg-gradient-to-br from-white/5 to-transparent">
            <div>
              <div class="eyebrow">Next Move</div>
              <h2 class="font-display mt-4 text-[2rem] leading-[1.1] tracking-tight text-white">
                {isPrivate ? 'Read the overview, then unlock the full prompt.' : 'Copy, open your workspace, start the scene.'}
              </h2>
              <p class="mt-4 text-[0.9rem] leading-relaxed text-[var(--text-muted)]">
                {#if isPrivate}
                  Private prompts only expose the overview and teaser on the public site. The full prompt stays off the page and opens through your Patreon access link.
                {:else}
                  The pack belongs in <strong class="text-white font-medium bg-white/10 px-1 py-0.5 rounded">the instruction layer</strong>. Your first message should establish context.
                {/if}
              </p>
            </div>

            <div class="mt-8 grid gap-4 relative z-10 w-full">
              {#if isPrivate}
                <a href={data.patreonUrl} target="_blank" rel="noopener noreferrer" class="gold-button w-full justify-between group/ext">
                  <span>Unlock On Patreon</span>
                  <span class="material-symbols-outlined text-[1rem] group-hover/ext:-rotate-45 transition-transform">arrow_outward</span>
                </a>
              {:else}
                <CopyPromptButton prompt={prompt.fullPrompt} characterName={prompt.slug} label="Copy Full Prompt" />
                <a href={data.aiStudioUrl} target="_blank" rel="noopener noreferrer" class="ghost-button w-full justify-between group/ext">
                  <span>Open Workspace</span>
                  <span class="material-symbols-outlined text-[1rem] group-hover/ext:-rotate-45 transition-transform">arrow_outward</span>
                </a>
              {/if}
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>

  <section class="site-wrap-wide px-0 py-16 md:py-24 border-t border-[var(--border)]">
    <div class="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <article class="premium-glass p-8 md:p-12 hover:border-[var(--gold)]/30 transition-colors">
        <div class="eyebrow flex items-center gap-2"><span class="h-px w-6 bg-[var(--gold)] inline-block"></span> How to Use</div>
        <h2 class="font-display mt-4 text-[2.8rem] leading-none tracking-tight text-white">
          {isPrivate ? 'What unlocks after Patreon.' : 'Setup handoff'}
        </h2>

        <div class="mt-8 grid gap-5">
          {#each prompt.modelNotes as note, index}
            <div class="group flex gap-4 border-b border-white/5 pb-5">
              <div class="font-display text-4xl leading-none text-white/20 group-hover:text-[var(--gold)] transition-colors mt-1">0{index + 1}</div>
              <p class="text-[0.95rem] leading-relaxed text-white/80">{note}</p>
            </div>
          {/each}
        </div>
      </article>

      <article class="premium-glass p-8 md:p-12 border-t-[var(--accent)]/20 hover:border-[var(--accent)]/30 transition-colors">
        <div class="eyebrow flex items-center gap-2"><span class="h-px w-6 bg-[var(--accent)] inline-block"></span> Access Logic</div>
        <h2 class="font-display mt-4 text-[2.8rem] leading-none tracking-tight text-white">
          {isPrivate ? 'Full prompt stays server-side.' : 'Nothing hidden here.'}
        </h2>

        <div class="mt-8 grid gap-4">
          <ul class="space-y-4">
            <li class="flex items-start gap-3 text-[0.95rem] leading-relaxed text-white/80 pb-4 border-b border-white/5">
              <span class="material-symbols-outlined text-[1.2rem] text-[var(--accent)] shrink-0 mt-0.5">check_circle</span>
              <span>{isPrivate ? 'The public route only ships the overview, teaser, and metadata.' : 'The full prompt is part of the public page and can be copied directly.'}</span>
            </li>
            <li class="flex items-start gap-3 text-[0.95rem] leading-relaxed text-white/80 pb-4 border-b border-white/5">
              <span class="material-symbols-outlined text-[1.2rem] text-[var(--accent)] shrink-0 mt-0.5">check_circle</span>
              <span>{isPrivate ? 'The main CTA uses the prompt-specific Patreon link first, then the global Patreon URL.' : 'The CTA sends people straight into the recommended workspace with no paywall step.'}</span>
            </li>
            <li class="flex items-start gap-3 text-[0.95rem] leading-relaxed text-white/80 pb-4 border-b border-white/5">
              <span class="material-symbols-outlined text-[1.2rem] text-[var(--accent)] shrink-0 mt-0.5">check_circle</span>
              <span>{isPrivate ? 'Switch this prompt to public in the dashboard if you want the entire block to go live.' : 'Switch this prompt to private in the dashboard if you want overview-only public access.'}</span>
            </li>
          </ul>
        </div>
      </article>
    </div>
  </section>

  {#if prompt.sampleConversation?.length}
    <section class="site-wrap-wide px-0 py-16 md:py-24 relative">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_left,_var(--bg-elevated)_0%,_transparent_50%)] pointer-events-none opacity-50"></div>
      <div class="relative z-10 mb-10">
        <div class="eyebrow flex items-center gap-2"><span class="h-px w-6 bg-white/30 inline-block"></span> Field Test</div>
        <h2 class="display-section mt-4 text-white">A taste of the voice before you commit.</h2>
      </div>

      <div class="relative z-10 grid gap-4 max-w-4xl border-l-[3px] border-[var(--gold)]/30 pl-5 md:pl-8">
        {#each prompt.sampleConversation.slice(0, 8) as line}
          <article class={`premium-glass p-6 md:p-8 ${line.speaker === 'character' ? 'mr-12 border-l-[var(--gold)]/50 border-l-[4px]' : 'ml-12 border-l-[var(--accent)]/50 border-l-[4px] bg-white/5'}`}>
            <div class={`text-[0.65rem] font-bold uppercase tracking-widest flex items-center gap-2 mb-3 ${line.speaker === 'character' ? 'text-[var(--gold)]' : 'text-[var(--accent)]'}`}>
              <span class="material-symbols-outlined text-[1rem] leading-none">{line.speaker === 'character' ? 'smart_toy' : 'person'}</span>
              {line.speaker === 'character' ? prompt.title : 'You'}
            </div>
            <p class="text-[0.95rem] leading-relaxed text-white/90">{line.text}</p>
          </article>
        {/each}
      </div>
    </section>
  {/if}

  {#if related.length}
    <section class="site-wrap-wide px-0 py-20 md:py-32 border-t border-[var(--border)] relative">
      <div class="relative z-10 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div class="eyebrow flex items-center gap-2"><span class="h-px w-6 bg-white/30 inline-block"></span> Related</div>
          <h2 class="display-section mt-4 text-white">Nearby doors in the archive.</h2>
        </div>
        <a href="/catalog/" class="ghost-button px-6 py-2.5 text-[0.7rem] group">
          Browse Archive <span class="material-symbols-outlined ml-1.5 text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </a>
      </div>

      <div class="relative z-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {#each related as item}
          <a href={`/characters/${item.slug}/`} class="card-hover premium-glass min-h-[300px] p-8 flex flex-col justify-between group overflow-hidden">
            <div class="font-display text-[8rem] italic leading-none text-white/5 absolute -right-4 -top-4 pointer-events-none group-hover:scale-110 group-hover:text-[var(--gold)]/10 transition-all duration-500">
              {item.title[0]}
            </div>
            <div class="relative z-10 space-y-4">
              <h3 class="font-display text-[2.2rem] leading-[1.1] tracking-tight text-white group-hover:text-[var(--gold)] transition-colors">
                {item.title}
              </h3>
              <p class="text-[0.9rem] leading-relaxed text-[var(--text-muted)] border-l border-white/10 pl-3">{item.tagline}</p>
            </div>
            <div class="relative z-10 text-[0.65rem] font-bold uppercase tracking-widest text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1.5 rounded-md inline-block mt-8 w-fit border border-[var(--accent)]/20">
              {item.archetype}
            </div>
          </a>
        {/each}
      </div>
    </section>
  {/if}
</AgeGate>
