import { siteDescription, siteName, siteTagline } from '$lib/site';

export function getSiteOrigin(explicitOrigin?: string | null): string | null {
  const origin = explicitOrigin?.trim() || import.meta.env.PUBLIC_SITE_URL?.trim();
  return origin ? origin.replace(/\/+$/, '') : null;
}

export function getAbsoluteUrl(path: string, explicitOrigin?: string | null): string | null {
  const origin = getSiteOrigin(explicitOrigin);

  if (!origin) {
    return null;
  }

  return new URL(path, `${origin}/`).toString();
}

export function getDefaultSeo() {
  return {
    title: `${siteName} | ${siteTagline}`,
    description: siteDescription
  };
}
