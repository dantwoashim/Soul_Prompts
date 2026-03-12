import { describe, expect, test, vi } from 'vitest';
import { trackEvent } from '../src/lib/utils/analytics';

describe('analytics', () => {
  test('sends plausible events with props', () => {
    window.plausible = vi.fn();

    trackEvent('Copy Prompt', { character: 'nila-after-rain' });

    expect(window.plausible).toHaveBeenCalledWith('Copy Prompt', {
      props: { character: 'nila-after-rain' }
    });
  });

  test('does nothing when plausible is unavailable', () => {
    window.plausible = undefined;

    expect(() => trackEvent('FAQ Open', { question: 'Do these prompts work in AI Studio?' })).not.toThrow();
  });
});
