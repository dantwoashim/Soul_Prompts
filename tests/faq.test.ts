import { render } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import FaqList from '../src/lib/components/FaqList.svelte';

describe('FaqList', () => {
  test('tracks a custom event when a question opens', async () => {
    window.plausible = vi.fn();

    const { container } = render(FaqList, {
      items: [
        {
          question: 'Do these prompts work in AI Studio?',
          answer: 'Yes.'
        }
      ]
    });
    const details = container.querySelector('details');

    expect(details).not.toBeNull();

    if (!details) {
      return;
    }

    details.open = true;
    details.dispatchEvent(new Event('toggle'));

    expect(window.plausible).toHaveBeenCalledWith('FAQ Open', {
      props: { question: 'Do these prompts work in AI Studio?' }
    });
  });
});
