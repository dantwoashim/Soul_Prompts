<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import type { ActionData, PageData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  const initial = form?.values ?? data.promptForm;

  let title = String(initial.title ?? '');
  let slug = String(initial.slug ?? '');
  let tagline = String(initial.tagline ?? '');
  let overview = String(initial.overview ?? '');
  let teaser = String(initial.teaser ?? '');
  let audience = String(initial.audience ?? '');
  let toneInput = String(initial.toneInput ?? '');
  let accessMode = String(initial.accessMode ?? 'private');
  let contentRating = String(initial.contentRating ?? 'sfw');
  let patreonUrlOverride = String(initial.patreonUrlOverride ?? '');
  let fullPrompt = String(initial.fullPrompt ?? '');
  let modelNotesInput = String(initial.modelNotesInput ?? '');
  let sampleConversationInput = String(initial.sampleConversationInput ?? '');
  let region = String(initial.region ?? '');
  let archetype = String(initial.archetype ?? '');
  let price = String(initial.price ?? '0');
  let coverImageUrl = String(initial.coverImageUrl ?? '');
  let featuredGroupsInput = String(initial.featuredGroupsInput ?? '');
  let sortOrder = String(initial.sortOrder ?? '0');
  let seoTitle = String(initial.seoTitle ?? '');
  let seoDescription = String(initial.seoDescription ?? '');

  $: tones = toneInput.split(',').map((item) => item.trim()).filter(Boolean);
  $: modelNotes = modelNotesInput.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  $: lineCount = fullPrompt.split(/\r?\n/).filter((line) => line.trim()).length;
  $: tokenEstimate = fullPrompt.trim() ? Math.max(1, Math.round(fullPrompt.trim().length / 4)) : 0;
</script>

<Seo title={`Prompt Studio | ${title || 'Untitled Prompt'}`} description="Edit a SoulPrompts draft." path={`/dashboard/prompts/${data.prompt.id}/`} noindex={true} />

<section class="p-6 md:p-8 xl:p-10">
  <div class="grid gap-8">
    <div class="grid gap-6 xl:grid-cols-[1fr_auto] xl:items-end">
      <div class="space-y-5">
        <div class="eyebrow">Prompt Editor</div>
        <h1 class="display-section max-w-4xl text-white">{title || 'Untitled Prompt'}</h1>
        <p class="max-w-3xl text-base leading-8 text-[var(--text-muted)]">Use the left column to shape the draft. The right column previews what the public site will feel like before you publish.</p>
      </div>
      <div class="grid gap-3 sm:grid-cols-3">
        <div class="editorial-panel p-5">
          <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Lines</div>
          <div class="font-display mt-3 text-4xl leading-none text-white">{lineCount}</div>
        </div>
        <div class="editorial-panel p-5">
          <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Tokens</div>
          <div class="font-display mt-3 text-4xl leading-none text-white">{tokenEstimate}</div>
        </div>
        <div class="editorial-panel p-5">
          <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Access</div>
          <div class="font-display mt-3 text-3xl leading-none text-white">{accessMode}</div>
        </div>
      </div>
    </div>

    {#if form?.error}
      <div class="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{form.error}</div>
    {/if}
    {#if form?.success}
      <div class="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">{form.success}</div>
    {/if}

    <div class="dashboard-split">
      <form method="POST" class="editorial-panel p-6 md:p-8">
        <div class="grid gap-5 md:grid-cols-2">
          <label class="block">
            <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Title</div>
            <input class="field-shell mt-3" name="title" bind:value={title} />
          </label>
          <label class="block">
            <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Slug</div>
            <input class="field-shell mt-3" name="slug" bind:value={slug} />
          </label>
        </div>

        <div class="mt-5 grid gap-5 md:grid-cols-2">
          <label class="block">
            <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Access Mode</div>
            <select class="field-shell mt-3 bg-transparent" name="accessMode" bind:value={accessMode}>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </label>
          <label class="block">
            <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Content Rating</div>
            <select class="field-shell mt-3 bg-transparent" name="contentRating" bind:value={contentRating}>
              <option value="sfw">SFW</option>
              <option value="nsfw">NSFW</option>
            </select>
          </label>
        </div>

        <label class="mt-5 block">
          <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Tagline</div>
          <input class="field-shell mt-3" name="tagline" bind:value={tagline} />
        </label>

        <label class="mt-5 block">
          <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Overview</div>
          <textarea class="textarea-shell mt-3" name="overview" bind:value={overview}></textarea>
        </label>

        <label class="mt-5 block">
          <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Teaser</div>
          <textarea class="textarea-shell mt-3" name="teaser" bind:value={teaser}></textarea>
        </label>

        <div class="mt-5 grid gap-5 md:grid-cols-2">
          <label class="block">
            <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Audience</div>
            <input class="field-shell mt-3" name="audience" bind:value={audience} />
          </label>
          <label class="block">
            <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Tone Tags</div>
            <input class="field-shell mt-3" name="toneInput" bind:value={toneInput} placeholder="slow burn, late night" />
          </label>
        </div>

        <div class="mt-5 grid gap-5 md:grid-cols-2">
          <label class="block">
            <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Region</div>
            <input class="field-shell mt-3" name="region" bind:value={region} />
          </label>
          <label class="block">
            <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Archetype</div>
            <input class="field-shell mt-3" name="archetype" bind:value={archetype} />
          </label>
        </div>

        <div class="mt-5 grid gap-5 md:grid-cols-2">
          <label class="block">
            <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Price</div>
            <input class="field-shell mt-3" name="price" bind:value={price} type="number" min="0" step="0.01" />
          </label>
          <label class="block">
            <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Sort Order</div>
            <input class="field-shell mt-3" name="sortOrder" bind:value={sortOrder} type="number" min="0" step="1" />
          </label>
        </div>

        <label class="mt-5 block">
          <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Patreon / Access Link Override</div>
          <input class="field-shell mt-3" name="patreonUrlOverride" bind:value={patreonUrlOverride} />
        </label>

        <label class="mt-5 block">
          <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Cover Image URL</div>
          <input class="field-shell mt-3" name="coverImageUrl" bind:value={coverImageUrl} />
        </label>

        <label class="mt-5 block">
          <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Featured Groups</div>
          <textarea class="textarea-shell mt-3" name="featuredGroupsInput" bind:value={featuredGroupsInput} placeholder="home_spotlight&#10;home_featured"></textarea>
        </label>

        <label class="mt-5 block">
          <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Model Notes</div>
          <textarea class="textarea-shell mt-3" name="modelNotesInput" bind:value={modelNotesInput} placeholder="One note per line."></textarea>
        </label>

        <label class="mt-5 block">
          <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Sample Conversation</div>
          <textarea class="textarea-shell mt-3" name="sampleConversationInput" bind:value={sampleConversationInput} placeholder="character | line&#10;user | reply"></textarea>
        </label>

        <label class="mt-5 block">
          <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Full Prompt</div>
          <textarea class="textarea-shell mt-3 min-h-[320px]" name="fullPrompt" bind:value={fullPrompt}></textarea>
        </label>

        <div class="mt-5 grid gap-5 md:grid-cols-2">
          <label class="block">
            <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">SEO Title</div>
            <input class="field-shell mt-3" name="seoTitle" bind:value={seoTitle} />
          </label>
          <label class="block">
            <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">SEO Description</div>
            <textarea class="textarea-shell mt-3" name="seoDescription" bind:value={seoDescription}></textarea>
          </label>
        </div>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <button class="ghost-button" type="submit" formaction="?/save">Save Draft</button>
          <button class="gold-button" type="submit" formaction="?/publish">Publish Prompt</button>
          <button class="ghost-button" type="submit" formaction="?/clone">Clone Prompt</button>
        </div>
      </form>

      <div class="grid gap-6 xl:sticky xl:top-8 xl:self-start">
        <article class="editorial-panel p-6 md:p-8">
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="eyebrow">Live Preview</div>
              <h2 class="font-display mt-3 text-[2.4rem] leading-none tracking-[-0.04em] text-[var(--text)]">{title || 'Untitled Prompt'}</h2>
            </div>
            <span class="meta-chip">{accessMode}</span>
          </div>
          <p class="mt-5 text-sm leading-7 text-[var(--text-muted)]">{overview}</p>
          <div class="mt-6 flex flex-wrap gap-2">
            {#each tones as tone}
              <span class="meta-chip">{tone}</span>
            {/each}
          </div>
          <div class="mt-6 grid gap-4 md:grid-cols-2">
            <div class="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
              <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Catalog teaser</div>
              <p class="mt-3 text-sm leading-7 text-[var(--text-muted)]">{teaser}</p>
            </div>
            <div class="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
              <div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Access rule</div>
              <p class="mt-3 text-sm leading-7 text-[var(--text-muted)]">{accessMode === 'private' ? 'Public page will show the overview only and use Patreon for the main CTA.' : 'Public page will expose the full prompt and copy flow.'}</p>
            </div>
          </div>
        </article>

        <article class="editorial-panel p-6 md:p-8">
          <div class="eyebrow">Prompt Block</div>
          <pre class="mt-5 overflow-x-auto whitespace-pre-wrap text-sm leading-7 text-[var(--text-muted)]">{accessMode === 'private' ? teaser : fullPrompt || 'Full prompt preview will render here.'}</pre>
        </article>

        <article class="editorial-panel p-6 md:p-8">
          <div class="eyebrow">Release Center</div>
          <div class="mt-6 grid gap-4">
            {#each data.versions as version}
              <div class="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <div class="font-display text-[1.6rem] leading-none tracking-[-0.03em] text-white">{version.versionKind}</div>
                    <div class="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">{new Date(version.createdAt).toLocaleString()}</div>
                    <p class="mt-3 text-sm leading-7 text-[var(--text-muted)]">{version.note}</p>
                  </div>
                  <form method="POST">
                    <input type="hidden" name="versionId" value={version.id} />
                    <button class="ghost-button" type="submit" formaction="?/rollback">Rollback</button>
                  </form>
                </div>
              </div>
            {/each}
          </div>
        </article>
      </div>
    </div>
  </div>
</section>
