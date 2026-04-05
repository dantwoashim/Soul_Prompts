<script lang="ts">
  import {
    buttondownWaitlistClient,
    type WaitlistClient,
    type WaitlistResult
  } from '$lib/services/waitlist';
  import { trackEvent } from '$lib/utils/analytics';

  export let placement = 'default';
  export let heading = 'Get launch emails';
  export let body =
    'Get the next character drops, deeper releases, and hosted-tool invites before the public launch.';
  export let buttonLabel = 'Get updates';
  export let waitlistClient: WaitlistClient = buttondownWaitlistClient;

  let email = '';
  let isSubmitting = false;
  let result: WaitlistResult | null = null;

  async function handleSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    isSubmitting = true;
    result = await waitlistClient.submit(email);
    trackEvent('Waitlist Submit', { status: result.status, placement });

    if (result.status === 'success') {
      email = '';
    }

    isSubmitting = false;
  }

  $: statusClasses =
    result?.status === 'success'
      ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200'
      : result?.status === 'duplicate'
        ? 'border-amber-400/20 bg-amber-400/10 text-amber-100'
        : 'border-rose-400/20 bg-rose-400/10 text-rose-100';
</script>

<section class="premium-glass p-6 md:p-8 border-t border-[var(--gold)]/20">
  <div class="space-y-3">
    <div class="eyebrow">Email Updates</div>
    <h3 class="font-display text-[2.2rem] leading-none tracking-[-0.03em] text-[var(--text)]">
      {heading}
    </h3>
    <p class="max-w-2xl text-sm leading-7 text-[var(--text-muted)]">{body}</p>
  </div>

  <form class="mt-6 grid gap-3 md:grid-cols-[1fr_auto] md:items-start" novalidate on:submit={handleSubmit}>
    <label class="sr-only" for={`waitlist-${placement}`}>Email</label>
    <input
      id={`waitlist-${placement}`}
      name="email"
      type="email"
      bind:value={email}
      placeholder="your@email.com"
      autocomplete="email"
      required
      class="min-h-12 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-[var(--text-dim)] focus:border-[var(--gold)]/40 focus:bg-black/40"
    />
    <button class="gold-button justify-center disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>
      {#if isSubmitting}
        Sending...
      {:else}
        {buttonLabel}
      {/if}
    </button>
  </form>

  <p class="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">
    No spam. Just new character drops, deeper versions, and early access notes.
  </p>

  {#if result}
    <p class={`mt-4 rounded-xl border px-4 py-3 text-sm ${statusClasses}`} role="status">
      {result.message}
    </p>
  {/if}
</section>
