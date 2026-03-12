<script lang="ts">
  import { siteName, siteTagline } from '$lib/site';

  export {};
</script>

<header class="site-header">
  <div class="container site-header__row">
    <a class="brand-mark" href="/">
      <span class="brand-mark__dot">S</span>
      <span class="brand-mark__text">
        <span class="brand-mark__name">{siteName}</span>
        <span class="brand-mark__sub">{siteTagline}</span>
      </span>
    </a>

    <nav class="nav-links" aria-label="Primary">
      <a href="/#characters">Characters</a>
      <a href="/#how-it-works">How it works</a>
      <a href="/#pricing">Pricing</a>
      <a href="/faq/">FAQ</a>
    </nav>

    <div class="header-actions">
      <a class="button button-secondary" href="/#waitlist">Join waitlist</a>
      <a class="button button-cta" href="/#pricing">Get full pack</a>
    </div>
  </div>
</header>
