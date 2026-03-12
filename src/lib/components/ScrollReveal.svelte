<script lang="ts">
  import { onMount } from 'svelte';

  export let threshold = 0.15;
  export let delay = 0;

  let element: HTMLDivElement;
  let visible = false;

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => { visible = true; }, delay);
          } else {
            visible = true;
          }
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  });
</script>

<div bind:this={element} class="scroll-reveal" class:visible>
  <slot />
</div>
