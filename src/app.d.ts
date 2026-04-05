/// <reference types="@sveltejs/kit" />
/// <reference types="vite/client" />

declare module '*.svelte' {
  import type { SvelteComponentTyped } from 'svelte';

  export default class SvelteComponent<
    Props extends Record<string, any> = Record<string, any>,
    Events extends Record<string, any> = any,
    Slots extends Record<string, any> = any
  > extends SvelteComponentTyped<Props, Events, Slots> {}
}

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, string> }) => void;
  }

  namespace App {
    interface Locals {
      adminSession: {
        active: boolean;
        expiresAt: string | null;
      };
    }

    interface PageData {
      shell?: import('$lib/cms/types').SiteShellData;
      adminSession?: {
        active: boolean;
        expiresAt: string | null;
      };
    }
  }
}

export {};
