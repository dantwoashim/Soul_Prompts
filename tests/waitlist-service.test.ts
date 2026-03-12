import { beforeEach, describe, expect, test, vi } from 'vitest';
import { createButtondownWaitlistClient } from '../src/lib/services/waitlist';

describe('waitlist service', () => {
  beforeEach(() => {
    window.localStorage.removeItem('soulprompts.waitlist.submissions');
    vi.restoreAllMocks();
  });

  test('submits successfully and stores a local duplicate guard', async () => {
    global.fetch = vi.fn().mockResolvedValue(new Response(null));
    const client = createButtondownWaitlistClient('https://buttondown.com/api/emails/embed-subscribe/test');

    const result = await client.submit('Person@Email.com');

    expect(result.status).toBe('success');
    expect(global.fetch).toHaveBeenCalledOnce();
  });

  test('returns duplicate when the same browser submits again', async () => {
    global.fetch = vi.fn().mockResolvedValue(new Response(null));
    const client = createButtondownWaitlistClient('https://buttondown.com/api/emails/embed-subscribe/test');

    await client.submit('repeat@example.com');
    const second = await client.submit('repeat@example.com');

    expect(second.status).toBe('duplicate');
    expect(global.fetch).toHaveBeenCalledOnce();
  });

  test('returns error when the network request fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network'));
    const client = createButtondownWaitlistClient('https://buttondown.com/api/emails/embed-subscribe/test');

    const result = await client.submit('fail@example.com');

    expect(result.status).toBe('error');
  });
});
