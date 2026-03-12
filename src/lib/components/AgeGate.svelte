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
  <div class="age-gate-overlay">
    <div class="age-gate-modal">
      <div class="age-gate-icon">🔞</div>
      <h2>Adult Content Ahead</h2>
      <p class="body-copy">
        The following characters contain explicit sexual content, mature themes, and 
        psychologically intense scenarios. You must be 18+ to view this section.
      </p>
      <div class="age-gate-actions">
        <button class="button button-cta" on:click={confirm}>
          I'm 18+ — Let me in
        </button>
        <button class="button button-secondary" on:click={decline}>
          Take me back
        </button>
      </div>
      <p class="age-gate-disclaimer">
        By continuing, you confirm you are of legal age in your jurisdiction to view adult content.
      </p>
    </div>
  </div>
{/if}

<style>
  .age-gate-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: grid;
    place-items: center;
    background: rgba(10, 10, 15, 0.95);
    backdrop-filter: blur(20px);
    padding: 1rem;
  }

  .age-gate-modal {
    max-width: 440px;
    text-align: center;
    padding: 2.5rem 2rem;
    border-radius: var(--radius-xl);
    background: var(--bg-card);
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
  }

  .age-gate-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .age-gate-modal h2 {
    font-family: 'Inter', sans-serif;
    font-weight: 800;
    font-size: 1.6rem;
    margin: 0 0 0.75rem;
    color: var(--cta);
  }

  .age-gate-actions {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    margin-top: 1.5rem;
  }

  .age-gate-disclaimer {
    margin-top: 1rem;
    font-size: 0.72rem;
    color: var(--text-tertiary);
    line-height: 1.5;
  }
</style>
