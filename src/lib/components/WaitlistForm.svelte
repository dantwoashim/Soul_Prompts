<script lang="ts">
  import {
    buttondownWaitlistClient,
    type WaitlistClient,
    type WaitlistResult
  } from '$lib/services/waitlist';
  import { trackEvent } from '$lib/utils/analytics';

  export let placement = 'default';
  export let heading = 'Join the waitlist';
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
</script>

<section class="waitlist-panel">
  <h3>{heading}</h3>
  <p class="body-copy">{body}</p>

  <form class="waitlist-form spacer-top" novalidate on:submit={handleSubmit}>
    <div class="waitlist-row">
      <label class="sr-only" for={`waitlist-${placement}`}>Email</label>
      <input
        id={`waitlist-${placement}`}
        name="email"
        type="email"
        bind:value={email}
        placeholder="your@email.com"
        autocomplete="email"
        required
      />
      <button class="button button-accent" type="submit" disabled={isSubmitting}>
        {#if isSubmitting}
          Sending...
        {:else}
          {buttonLabel}
        {/if}
      </button>
    </div>

    <p class="form-meta">
      No spam. Just new character drops, deeper versions, and early access notes.
    </p>

    {#if result}
      <p
        class={`status-pill ${result.status === 'success' ? 'status-success' : result.status === 'duplicate' ? 'status-duplicate' : 'status-error'}`}
        role="status"
      >
        {result.message}
      </p>
    {/if}
  </form>
</section>
