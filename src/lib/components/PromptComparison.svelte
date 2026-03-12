<script lang="ts">
  import BuyButton from './BuyButton.svelte';

  export let litePrompt: string;
  export let cpfPreview: string;
  export let price: number;
  export let gumroadUrl: string;
  export let characterName: string;

  $: litePreview = litePrompt.split('\n').slice(0, 12).join('\n') + '\n...';
  $: hasCpf = cpfPreview.length > 0;
</script>

<div class="comparison-grid">
  <div class="comparison-panel">
    <div class="prompt-header">
      <div>
        <h4 class="prompt-label">Lite Version</h4>
        <p class="body-copy" style="font-size: 0.82rem;">Free — copy and use now</p>
      </div>
      <span class="tag">FREE</span>
    </div>
    <div class="prompt-shell">
      <pre>{litePreview}</pre>
    </div>
  </div>

  {#if hasCpf}
    <div class="comparison-panel comparison-panel-locked">
      <div class="prompt-header">
        <div>
          <h4 class="prompt-label">Full CPF Version</h4>
          <p class="body-copy" style="font-size: 0.82rem;">Encoded character engine</p>
        </div>
        <span class="tag tag-accent">${price}</span>
      </div>
      <div class="prompt-shell">
        <pre>{cpfPreview}</pre>
      </div>
      <div class="comparison-overlay">
        <div class="comparison-overlay-inner">
          <h4>🔒 Full Character Engine</h4>
          <p>Voice guides, behavioral routines, state modifiers, and 5 interaction modes — in compressed persona format.</p>
          <BuyButton productUrl={gumroadUrl} {price} {characterName} />
        </div>
      </div>
    </div>
  {/if}
</div>
