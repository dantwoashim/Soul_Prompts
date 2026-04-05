<script lang="ts">
  import type { FooterDocument } from '$lib/cms/types';

  export let footer: FooterDocument;
</script>

<footer class="mt-24 border-t border-[rgba(255,198,62,0.08)] bg-[rgba(10,10,10,0.68)]">
  <div class="site-wrap-wide grid gap-10 px-0 py-14 md:grid-cols-[1.4fr_1fr]">
    <div class="space-y-4">
      <div class="eyebrow">{footer.eyebrow}</div>
      <h2 class="font-display text-[2.4rem] leading-none tracking-[-0.04em] text-[var(--text)]">
        {footer.title}
      </h2>
      <p class="max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
        {footer.body}
      </p>
      <a href={footer.ctaHref} class="gold-button mt-2">
        {footer.ctaLabel}
      </a>
    </div>

    <div class="grid gap-3 text-sm text-[var(--text-dim)]" aria-label="Footer">
      {#each footer.links as link}
        <a class="link-underline w-fit" href={link.href}>{link.label}</a>
      {/each}
    </div>
  </div>
</footer>
