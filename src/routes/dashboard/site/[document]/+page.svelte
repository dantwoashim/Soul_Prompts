<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import type { ActionData, PageData } from './$types';

  export let data: PageData;
  export let form: ActionData;

  const initial: Record<string, string> = ((form?.values as Record<string, string>) ?? data.formValues) as Record<string, string>;
</script>

<Seo title={`${data.title} | SoulPrompts`} description="Site document editor for SoulPrompts." path={`/dashboard/site/${data.kind}/`} noindex={true} />

<section class="p-6 md:p-8 xl:p-10">
  <div class="grid gap-8">
    <div class="space-y-5">
      <div class="eyebrow">Site Studio</div>
      <h1 class="display-section max-w-4xl text-white">{data.title}</h1>
      <p class="max-w-3xl text-base leading-8 text-[var(--text-muted)]">Edit the draft, preview the shape of the page, then publish when the live site should change.</p>
    </div>

    {#if form?.error}
      <div class="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{form.error}</div>
    {/if}
    {#if form?.success}
      <div class="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">{form.success}</div>
    {/if}

    <div class="dashboard-split">
      <form method="POST" class="editorial-panel p-6 md:p-8">
        {#if data.kind === 'settings'}
          <div class="grid gap-5 md:grid-cols-2">
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Site Name</div><input class="field-shell mt-3" name="siteName" value={initial.siteName} /></label>
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Tagline</div><input class="field-shell mt-3" name="siteTagline" value={initial.siteTagline} /></label>
          </div>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Site Description</div><textarea class="textarea-shell mt-3" name="siteDescription">{initial.siteDescription}</textarea></label>
          <div class="mt-5 grid gap-5 md:grid-cols-2">
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Site URL</div><input class="field-shell mt-3" name="siteUrl" value={initial.siteUrl} /></label>
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Patreon URL</div><input class="field-shell mt-3" name="patreonUrl" value={initial.patreonUrl} /></label>
          </div>
          <div class="mt-5 grid gap-5 md:grid-cols-2">
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Launch URL</div><input class="field-shell mt-3" name="aiStudioUrl" value={initial.aiStudioUrl} /></label>
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Social Image URL</div><input class="field-shell mt-3" name="socialImageUrl" value={initial.socialImageUrl} /></label>
          </div>
          <div class="mt-5 grid gap-5 md:grid-cols-2">
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Waitlist Endpoint</div><input class="field-shell mt-3" name="waitlistEmbedEndpoint" value={initial.waitlistEmbedEndpoint} /></label>
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Plausible Domain</div><input class="field-shell mt-3" name="plausibleDomain" value={initial.plausibleDomain} /></label>
          </div>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Plausible Script URL</div><input class="field-shell mt-3" name="plausibleSrc" value={initial.plausibleSrc} /></label>
        {:else if data.kind === 'home'}
          <div class="grid gap-5 md:grid-cols-2">
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">SEO Title</div><input class="field-shell mt-3" name="seoTitle" value={initial.seoTitle} /></label>
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Hero Badge</div><input class="field-shell mt-3" name="heroBadge" value={initial.heroBadge} /></label>
          </div>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">SEO Description</div><textarea class="textarea-shell mt-3" name="seoDescription">{initial.seoDescription}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Hero Title</div><textarea class="textarea-shell mt-3" name="heroTitle">{initial.heroTitle}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Hero Body</div><textarea class="textarea-shell mt-3" name="heroBody">{initial.heroBody}</textarea></label>
          <div class="mt-5 grid gap-5 md:grid-cols-2">
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Primary CTA Label</div><input class="field-shell mt-3" name="primaryCtaLabel" value={initial.primaryCtaLabel} /></label>
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Primary CTA Href</div><input class="field-shell mt-3" name="primaryCtaHref" value={initial.primaryCtaHref} /></label>
          </div>
          <div class="mt-5 grid gap-5 md:grid-cols-2">
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Secondary CTA Label</div><input class="field-shell mt-3" name="secondaryCtaLabel" value={initial.secondaryCtaLabel} /></label>
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Secondary CTA Href</div><input class="field-shell mt-3" name="secondaryCtaHref" value={initial.secondaryCtaHref} /></label>
          </div>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Tutorial Eyebrow</div><input class="field-shell mt-3" name="tutorialEyebrow" value={initial.tutorialEyebrow} /></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Tutorial Title</div><textarea class="textarea-shell mt-3" name="tutorialTitle">{initial.tutorialTitle}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Tutorial Body</div><textarea class="textarea-shell mt-3" name="tutorialBody">{initial.tutorialBody}</textarea></label>
          <div class="mt-5 grid gap-5 md:grid-cols-2">
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Start Free Eyebrow</div><input class="field-shell mt-3" name="startFreeEyebrow" value={initial.startFreeEyebrow} /></label>
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Start Free CTA Label</div><input class="field-shell mt-3" name="startFreeCtaLabel" value={initial.startFreeCtaLabel} /></label>
          </div>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Start Free Title</div><textarea class="textarea-shell mt-3" name="startFreeTitle">{initial.startFreeTitle}</textarea></label>
          <div class="mt-5 grid gap-5 md:grid-cols-2">
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Why Eyebrow</div><input class="field-shell mt-3" name="whyEyebrow" value={initial.whyEyebrow} /></label>
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Membership Eyebrow</div><input class="field-shell mt-3" name="membershipEyebrow" value={initial.membershipEyebrow} /></label>
          </div>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Why Title</div><textarea class="textarea-shell mt-3" name="whyTitle">{initial.whyTitle}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Membership Title</div><textarea class="textarea-shell mt-3" name="membershipTitle">{initial.membershipTitle}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Membership Body</div><textarea class="textarea-shell mt-3" name="membershipBody">{initial.membershipBody}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Membership CTA Label</div><input class="field-shell mt-3" name="membershipCtaLabel" value={initial.membershipCtaLabel} /></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Feature Cards</div><textarea class="textarea-shell mt-3" name="featureCardsInput">{initial.featureCardsInput}</textarea></label>
        {:else if data.kind === 'vault'}
          <div class="grid gap-5 md:grid-cols-2">
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">SEO Title</div><input class="field-shell mt-3" name="seoTitle" value={initial.seoTitle} /></label>
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Eyebrow</div><input class="field-shell mt-3" name="eyebrow" value={initial.eyebrow} /></label>
          </div>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">SEO Description</div><textarea class="textarea-shell mt-3" name="seoDescription">{initial.seoDescription}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Title</div><textarea class="textarea-shell mt-3" name="title">{initial.title}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Body</div><textarea class="textarea-shell mt-3" name="body">{initial.body}</textarea></label>
          <div class="mt-5 grid gap-5 md:grid-cols-2">
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Primary CTA Label</div><input class="field-shell mt-3" name="primaryCtaLabel" value={initial.primaryCtaLabel} /></label>
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Secondary CTA Label</div><input class="field-shell mt-3" name="secondaryCtaLabel" value={initial.secondaryCtaLabel} /></label>
          </div>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Membership Highlights</div><textarea class="textarea-shell mt-3" name="membershipHighlightsInput">{initial.membershipHighlightsInput}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Member Includes</div><textarea class="textarea-shell mt-3" name="memberIncludesInput">{initial.memberIncludesInput}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Release Flow</div><textarea class="textarea-shell mt-3" name="releaseFlowInput">{initial.releaseFlowInput}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Drop Extras</div><textarea class="textarea-shell mt-3" name="dropExtrasInput">{initial.dropExtrasInput}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Final Title</div><textarea class="textarea-shell mt-3" name="finalTitle">{initial.finalTitle}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Final Body</div><textarea class="textarea-shell mt-3" name="finalBody">{initial.finalBody}</textarea></label>
        {:else if data.kind === 'guide'}
          <div class="grid gap-5 md:grid-cols-2">
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">SEO Title</div><input class="field-shell mt-3" name="seoTitle" value={initial.seoTitle} /></label>
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Eyebrow</div><input class="field-shell mt-3" name="eyebrow" value={initial.eyebrow} /></label>
          </div>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">SEO Description</div><textarea class="textarea-shell mt-3" name="seoDescription">{initial.seoDescription}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Title</div><textarea class="textarea-shell mt-3" name="title">{initial.title}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Body</div><textarea class="textarea-shell mt-3" name="body">{initial.body}</textarea></label>
          <div class="mt-5 grid gap-5 md:grid-cols-2">
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Primary CTA Label</div><input class="field-shell mt-3" name="primaryCtaLabel" value={initial.primaryCtaLabel} /></label>
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Primary CTA Href</div><input class="field-shell mt-3" name="primaryCtaHref" value={initial.primaryCtaHref} /></label>
          </div>
          <div class="mt-5 grid gap-5 md:grid-cols-2">
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Secondary CTA Label</div><input class="field-shell mt-3" name="secondaryCtaLabel" value={initial.secondaryCtaLabel} /></label>
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Secondary CTA Href</div><input class="field-shell mt-3" name="secondaryCtaHref" value={initial.secondaryCtaHref} /></label>
          </div>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Quick Rule Title</div><textarea class="textarea-shell mt-3" name="quickRuleTitle">{initial.quickRuleTitle}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Quick Rule Body</div><textarea class="textarea-shell mt-3" name="quickRuleBody">{initial.quickRuleBody}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Guide Steps</div><textarea class="textarea-shell mt-3" name="stepsInput">{initial.stepsInput}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Copy Title</div><textarea class="textarea-shell mt-3" name="copyTitle">{initial.copyTitle}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Copy Body</div><textarea class="textarea-shell mt-3" name="copyBody">{initial.copyBody}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Open Title</div><textarea class="textarea-shell mt-3" name="openTitle">{initial.openTitle}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Starter Messages</div><textarea class="textarea-shell mt-3" name="starterMessagesInput">{initial.starterMessagesInput}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Quick Tips Title</div><input class="field-shell mt-3" name="quickTipsTitle" value={initial.quickTipsTitle} /></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Quick Tips</div><textarea class="textarea-shell mt-3" name="quickTipsInput">{initial.quickTipsInput}</textarea></label>
        {:else if data.kind === 'faq'}
          <div class="grid gap-5 md:grid-cols-2">
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">SEO Title</div><input class="field-shell mt-3" name="seoTitle" value={initial.seoTitle} /></label>
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Eyebrow</div><input class="field-shell mt-3" name="eyebrow" value={initial.eyebrow} /></label>
          </div>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">SEO Description</div><textarea class="textarea-shell mt-3" name="seoDescription">{initial.seoDescription}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Title</div><textarea class="textarea-shell mt-3" name="title">{initial.title}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Intro</div><textarea class="textarea-shell mt-3" name="intro">{initial.intro}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">FAQ Items</div><textarea class="textarea-shell mt-3" name="itemsInput">{initial.itemsInput}</textarea></label>
        {:else if data.kind === 'navigation'}
          <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Brand Name</div><input class="field-shell mt-3" name="brandName" value={initial.brandName} /></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Brand Tagline</div><input class="field-shell mt-3" name="brandTagline" value={initial.brandTagline} /></label>
          <div class="mt-5 grid gap-5 md:grid-cols-2">
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">CTA Label</div><input class="field-shell mt-3" name="ctaLabel" value={initial.ctaLabel} /></label>
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">CTA Href</div><input class="field-shell mt-3" name="ctaHref" value={initial.ctaHref} /></label>
          </div>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Primary Links</div><textarea class="textarea-shell mt-3" name="linksInput">{initial.linksInput}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Mobile Links</div><textarea class="textarea-shell mt-3" name="mobileLinksInput">{initial.mobileLinksInput}</textarea></label>
        {:else if data.kind === 'footer'}
          <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Eyebrow</div><input class="field-shell mt-3" name="eyebrow" value={initial.eyebrow} /></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Title</div><textarea class="textarea-shell mt-3" name="title">{initial.title}</textarea></label>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Body</div><textarea class="textarea-shell mt-3" name="body">{initial.body}</textarea></label>
          <div class="mt-5 grid gap-5 md:grid-cols-2">
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">CTA Label</div><input class="field-shell mt-3" name="ctaLabel" value={initial.ctaLabel} /></label>
            <label class="block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">CTA Href</div><input class="field-shell mt-3" name="ctaHref" value={initial.ctaHref} /></label>
          </div>
          <label class="mt-5 block"><div class="text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">Footer Links</div><textarea class="textarea-shell mt-3" name="linksInput">{initial.linksInput}</textarea></label>
        {/if}

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <button class="ghost-button" type="submit" formaction="?/save">Save Draft</button>
          <button class="gold-button" type="submit" formaction="?/publish">Publish</button>
        </div>
      </form>

      <div class="grid gap-6 xl:sticky xl:top-8 xl:self-start">
        <article class="editorial-panel p-6 md:p-8">
          <div class="eyebrow">Preview Snapshot</div>
          <pre class="mt-5 overflow-x-auto whitespace-pre-wrap text-sm leading-7 text-[var(--text-muted)]">{JSON.stringify(initial, null, 2)}</pre>
        </article>

        <article class="editorial-panel p-6 md:p-8">
          <div class="eyebrow">Release History</div>
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
