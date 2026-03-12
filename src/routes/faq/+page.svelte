<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import FaqList from '$lib/components/FaqList.svelte';
</script>

<Seo title="FAQ | SoulPrompts" description="Frequently asked questions about SoulPrompts character prompts, CPF encoding, and pricing." path="/faq/" />

<main>
  <section class="detail-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span>/</span>
        <span>FAQ</span>
      </nav>
      <h1 class="page-title">Questions</h1>
      <p class="page-subtitle">
        Everything you need to know about using SoulPrompts characters in AI Studio and other LLMs.
      </p>
    </div>
  </section>

  <section class="section">
    <div class="container-narrow">
      <FaqList />
    </div>
  </section>
</main>
