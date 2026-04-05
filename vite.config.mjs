import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  resolve: {
    conditions: ['browser']
  },
  test: {
    environment: 'jsdom',
    setupFiles: [fileURLToPath(new URL('./tests/setup.ts', import.meta.url))],
    include: ['tests/**/*.test.ts'],
    css: true
  }
});
