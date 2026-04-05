import type { SiteDocumentKey } from '$lib/cms/types';
import { PostgresCmsRepository } from './postgres-store';

const repository = new PostgresCmsRepository();

export function getCmsRepository() {
  return repository;
}

export function getDashboardDocumentTitle(key: SiteDocumentKey | 'settings') {
  if (key === 'settings') return 'Global Settings';
  return `${key[0].toUpperCase()}${key.slice(1)} Studio`;
}
