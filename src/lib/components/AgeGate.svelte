<script lang="ts">
  import { browser } from '$app/environment';

  export let enabled = true;
  export let onConfirm: () => void = () => {};

  let confirmed = false;

  function confirm() {
    confirmed = true;
    if (browser) {
      sessionStorage.setItem('soulprompts_age_verified', 'true');
    }
    onConfirm();
  }

  function decline() {
    if (browser) {
      window.location.href = '/';
    }
  }

  $: if (!enabled) {
    confirmed = true;
  } else if (browser && !confirmed) {
    confirmed = sessionStorage.getItem('soulprompts_age_verified') === 'true';
  }
</script>

{#if confirmed}
  <slot />
{:else}
  <div class="fixed inset-0 z-[100] grid place-items-center bg-[rgba(8,8,8,0.94)] p-4 backdrop-blur-xl">
    <div class="editorial-panel max-w-xl p-8 text-center md:p-10">
      <div class="eyebrow">18+ Access Check</div>
      <h2 class="font-display mt-4 text-[2.8rem] leading-none tracking-[-0.04em] text-[var(--text)]">
        Adult content ahead.
      </h2>
      <p class="mt-5 text-sm leading-7 text-[var(--text-muted)]">
        This character includes explicit sexual content, mature themes, and emotionally intense scenarios.
        Continue only if you are 18+ and legally allowed to access this material in your jurisdiction.
      </p>

      <div class="mt-8 grid gap-3">
        <button class="gold-button w-full" type="button" on:click={confirm}>
          I am 18+
        </button>
        <button class="ghost-button w-full" type="button" on:click={decline}>
          Take Me Back
        </button>
      </div>

      <p class="mt-5 text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">
        By continuing, you confirm you are of legal age in your location.
      </p>
    </div>
  </div>
{/if}
