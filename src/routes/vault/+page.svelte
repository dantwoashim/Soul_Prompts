<script lang="ts">
  import WaitlistForm from '$lib/components/WaitlistForm.svelte';
  import Seo from '$lib/components/Seo.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<Seo title={data.seo.title} description={data.seo.description} path="/vault/" />

<section class="site-wrap-wide px-0 pb-14 pt-14 md:pb-20 md:pt-24">
  <div class="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
    <div class="space-y-6">
      <div class="eyebrow">{data.document.eyebrow}</div>
      <div class="max-w-4xl space-y-5">
        <h1 class="font-display text-[clamp(3rem,6vw,5.7rem)] leading-[0.94] tracking-[-0.045em] text-[var(--text)]">
          {data.document.title}
        </h1>
        <p class="max-w-2xl text-base leading-8 text-[var(--text-muted)] md:text-lg">
          {data.document.body}
        </p>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row">
        <a href={data.primaryHref} class="gold-button">
          {data.primaryLabel}
        </a>
        <a href="/learn/guide/" class="ghost-button">
          {data.document.secondaryCtaLabel}
        </a>
      </div>
    </div>

    <div class="space-y-5 lg:pl-10">
      {#each data.document.membershipHighlights as item}
        <article class="border-t border-[rgba(255,198,62,0.14)] pt-4">
          <div class="text-xs uppercase tracking-[0.22em] text-[var(--gold)]">{item.label}</div>
          <p class="mt-3 max-w-xl text-sm leading-7 text-[var(--text-muted)]">{item.body}</p>
        </article>
      {/each}
    </div>
  </div>
</section>

{#if !data.primaryHref.startsWith('http') && data.hasWaitlistSignup}
  <section class="site-wrap-wide px-0 py-14 md:py-18">
    <WaitlistForm
      placement="vault"
      heading="Get the next membership drop by email."
      body="Membership is still opening in waves. Join the email list for launch notices, new character drops, and deeper releases as they unlock."
      buttonLabel="Join the list"
    />
  </section>
{/if}

<section class="site-wrap-wide px-0 py-14 md:py-18">
  <div class="mb-8 max-w-3xl">
    <div class="eyebrow">What Members Get</div>
    <h2 class="display-section mt-3 text-[var(--text)]">Everything you need to get a stronger character running fast.</h2>
  </div>

  <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
    {#each data.document.memberIncludes as item}
      <article class="border-t border-[rgba(255,198,62,0.14)] pt-4">
        <h3 class="font-display text-[2rem] leading-none tracking-[-0.03em] text-[var(--text)]">
          {item.title}
        </h3>
        <p class="mt-4 text-sm leading-7 text-[var(--text-muted)]">{item.body}</p>
      </article>
    {/each}
  </div>
</section>

<section class="site-wrap-wide px-0 py-14 md:py-18">
  <div class="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
    <div class="space-y-5">
      <div class="eyebrow">Use Flow</div>
      <h2 class="display-section max-w-xl text-[var(--text)]">
        Place the pack in your workspace, open the scene, and keep the voice intact.
      </h2>
    </div>

    <article class="editorial-panel p-6 md:p-8">
      <div class="grid gap-5">
        {#each data.document.releaseFlow as step, index}
          <div class="grid gap-3 border-b border-[rgba(255,198,62,0.08)] pb-4 md:grid-cols-[auto_1fr] md:items-start">
            <div class="font-display text-4xl leading-none text-[var(--gold)]">{index + 1}</div>
            <p class="text-sm leading-7 text-[var(--text-muted)]">{step}</p>
          </div>
        {/each}
      </div>
    </article>
  </div>
</section>

<section class="site-wrap-wide px-0 py-14 md:py-18">
  <div class="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
    <div class="space-y-5">
      <div class="eyebrow">Included In Most Drops</div>
      <h2 class="display-section max-w-xl text-[var(--text)]">
        More than the prompt block, less fluff than a bloated playbook.
      </h2>
    </div>

    <div class="grid gap-4">
      {#each data.document.dropExtras as point}
        <div class="border-b border-[rgba(255,198,62,0.08)] pb-4 text-sm leading-7 text-[var(--text-muted)]">
          {point}
        </div>
      {/each}
    </div>
  </div>
</section>

<section class="site-wrap-wide px-0 py-16 md:py-20">
  <div class="editorial-panel p-7 md:p-10">
      <div class="max-w-3xl space-y-5">
        <div class="eyebrow">Join The Next Drop</div>
        <h2 class="display-section text-[var(--text)]">{data.document.finalTitle}</h2>
      <p class="max-w-2xl text-base leading-8 text-[var(--text-muted)]">
        {data.document.finalBody}
      </p>
    </div>

    <div class="mt-8 flex flex-col gap-3 sm:flex-row">
      <a href={data.primaryHref} class="gold-button">
        {data.primaryLabel}
      </a>
      <a href="/catalog/" class="ghost-button">
        Explore the Archive
      </a>
    </div>
  </div>
</section>
