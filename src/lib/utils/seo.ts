import { siteDescription, siteName, siteTagline } from '$lib/site';

const fallbackOrigin = 'https://soulprompts.example.com';

export function getSiteOrigin(): string {
  return import.meta.env.PUBLIC_SITE_URL || fallbackOrigin;
}

export function getAbsoluteUrl(path: string): string {
  return new URL(path, `${getSiteOrigin()}/`).toString();
}

export function getDefaultSeo() {
  return {
    title: `${siteName} | ${siteTagline}`,
    description: siteDescription
  };
}
