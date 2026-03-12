import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import WaitlistForm from '../src/lib/components/WaitlistForm.svelte';
import type { WaitlistClient } from '../src/lib/services/waitlist';

function createClient(status: 'success' | 'duplicate' | 'error'): WaitlistClient {
  return {
    submit: vi.fn().mockResolvedValue({
      status,
      message: `Status: ${status}`
    })
  };
}

describe('WaitlistForm', () => {
  afterEach(() => {
    cleanup();
  });

  test.each(['success', 'duplicate', 'error'] as const)(
    'renders the %s state without breaking',
    async (status) => {
      render(WaitlistForm, {
        placement: status,
        waitlistClient: createClient(status)
      });

      await fireEvent.input(screen.getByRole('textbox', { name: /email/i }), {
        target: { value: 'hello@example.com' }
      });
      await fireEvent.submit(screen.getByRole('button', { name: /get updates/i }).closest('form')!);

      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveTextContent(`Status: ${status}`);
      });
    }
  );
});
