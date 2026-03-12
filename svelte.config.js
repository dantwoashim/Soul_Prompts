import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess({ style: false }),
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: undefined
    })
  }
};

export default config;
