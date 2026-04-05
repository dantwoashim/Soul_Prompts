import { expect, test } from '@playwright/test';
import { PLAYWRIGHT_ADMIN_PASSWORD } from '../../playwright.config';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/dashboard/login/');
  await page.getByLabel('Password').fill(PLAYWRIGHT_ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Enter Dashboard' }).click();
  await expect(page).toHaveURL(/\/dashboard\/$/);
}

test('dashboard requires owner login and supports logout', async ({ page }) => {
  await page.goto('/dashboard/');
  await expect(page).toHaveURL(/\/dashboard\/login\/$/);

  await page.getByLabel('Password').fill('wrong-password');
  await page.getByRole('button', { name: 'Enter Dashboard' }).click();
  await expect(page.getByText('That password did not match the owner dashboard.')).toBeVisible();

  await page.getByLabel('Password').fill(PLAYWRIGHT_ADMIN_PASSWORD);
  await page.getByRole('button', { name: 'Enter Dashboard' }).click();

  await expect(page).toHaveURL(/\/dashboard\/$/);
  await expect(page.getByRole('heading', { name: /One dashboard to control/i })).toBeVisible();

  await page.getByRole('button', { name: 'Log Out' }).click();
  await expect(page).toHaveURL(/\/dashboard\/login\/$/);
});

test('seeded public and private prompts render different access flows', async ({ page }) => {
  await page.goto('/characters/megha-boyfriend/');
  await expect(page.getByRole('button', { name: 'Copy Full Prompt' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open Workspace' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Unlock On Patreon' })).toHaveCount(0);

  await page.goto('/characters/arjun-thapa/');
  await expect(page.getByRole('link', { name: 'Unlock On Patreon' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copy Full Prompt' })).toHaveCount(0);
  await expect(page.getByText('Full prompt stays server-side.')).toBeVisible();
});

test('owner can publish a private prompt without leaking the full prompt into public html', async ({ page }) => {
  const slug = 'arjun-thapa';
  const secretPromptLine = 'PLAYWRIGHT PRIVATE SECRET SYSTEM BLOCK';
  const overview = `Playwright private overview ${Date.now()} proves the owner CMS can publish a gated update to the live public page.`;
  const teaser = `Playwright teaser ${Date.now()} stays public while the actual system prompt remains hidden behind Patreon.`;

  await login(page);
  await page.goto('/dashboard/prompts/');
  await page.getByRole('link', { name: /Arjun Thapa/i }).click();
  await expect(page).toHaveURL(/\/dashboard\/prompts\/[^/]+\/$/);

  await page.locator('[name="accessMode"]').selectOption('private');
  await page.locator('[name="overview"]').fill(overview);
  await page.locator('[name="teaser"]').fill(teaser);
  await page.locator('[name="audience"]').fill(
    'Writers and creators who want to verify the owner CMS publish flow end to end.'
  );
  await page.locator('[name="patreonUrlOverride"]').fill('https://patreon.com/soulprompts-private-test');
  await page.locator('[name="modelNotesInput"]').fill(
    'Paste into system instructions.\nKeep the pacing intimate and controlled.'
  );
  await page.locator('[name="sampleConversationInput"]').fill(
    'character | She had already decided to text before midnight.\nuser | I still answered.'
  );
  await page.locator('[name="fullPrompt"]').fill(
    `${secretPromptLine}\nKeep this out of the public page payload at all times.`
  );
  await page.locator('[name="seoTitle"]').fill('Arjun Thapa | SoulPrompts');
  await page.locator('[name="seoDescription"]').fill(
    'A private prompt published through the owner CMS to verify gated public access.'
  );

  await page.getByRole('button', { name: 'Publish Prompt' }).click();
  await expect(page.getByText('Prompt published.')).toBeVisible();

  await page.goto(`/characters/${slug}/`);
  await expect(page.getByRole('link', { name: 'Unlock On Patreon' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copy Full Prompt' })).toHaveCount(0);
  await expect(page.getByText(overview)).toBeVisible();
  await expect(page.getByText(teaser).first()).toBeVisible();

  const html = await page.content();
  expect(html).not.toContain(secretPromptLine);
});
