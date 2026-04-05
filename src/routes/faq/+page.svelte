<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import FaqList from '$lib/components/FaqList.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<Seo title={data.seo.title} description={data.seo.description} path="/faq/" />

<main class="site-wrap-wide px-0 pb-16 pt-10 md:pt-16">
  <section class="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
    <div class="space-y-5">
      <div class="eyebrow">{data.document.eyebrow}</div>
      <h1 class="display-section max-w-3xl text-[var(--text)]">{data.document.title}</h1>
      <p class="max-w-2xl text-base leading-8 text-[var(--text-muted)]">{data.document.intro}</p>
    </div>
  </section>

  <section class="py-10 md:py-14">
    <FaqList items={data.document.items} />
  </section>
</main>
