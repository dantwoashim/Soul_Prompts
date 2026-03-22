<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
</script>

<Seo title="Privacy | SoulPrompts" description="SoulPrompts privacy policy and data handling information." path="/privacy/" />

<main>
  <section class="detail-hero">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span>/</span>
        <span>Privacy</span>
      </nav>
      <h1 class="page-title">Privacy</h1>
    </div>
  </section>

  <section class="section">
    <div class="container-narrow">
      <div class="privacy-card">
        <h3>What we collect</h3>
        <p class="body-copy">
          SoulPrompts only collects your email address if you choose to join the waitlist.
          We use Plausible Analytics for privacy-friendly, cookie-free pageview tracking.
          No personal data is sold or shared.
        </p>
      </div>

      <div class="privacy-card spacer-top">
        <h3>Prompt data</h3>
        <p class="body-copy">
          Prompts you copy from this site are pasted into your own AI Studio session.
          SoulPrompts does not see, store, or process any content from your AI conversations.
        </p>
      </div>

      <div class="privacy-card spacer-top">
        <h3>Purchases</h3>
        <p class="body-copy">
          Premium prompt purchases are processed by authorized checkout providers, including
          Paddle where available. SoulPrompts does not handle payment information directly.
          Payment data is handled according to the checkout provider's own privacy policy.
        </p>
      </div>

      <div class="privacy-card spacer-top">
        <h3>Contact</h3>
        <p class="body-copy">
          Questions about privacy? Reach out through the waitlist form or reply to any SoulPrompts email.
        </p>
      </div>
    </div>
  </section>
</main>
