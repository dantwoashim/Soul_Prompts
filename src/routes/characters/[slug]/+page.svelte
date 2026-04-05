<script lang="ts">
  import CharacterDetailPage from '$lib/components/CharacterDetailPage.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<CharacterDetailPage {data} />
