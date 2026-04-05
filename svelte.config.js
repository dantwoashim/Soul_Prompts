import adapter from './scripts/adapter-vercel-safe.mjs';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess({ style: false }),
  kit: {
    adapter: adapter({
      runtime: 'nodejs20.x'
    })
  }
};

export default config;
