import { fireEvent, render, screen, waitFor } from '@testing-library/svelte';
import { describe, expect, test, vi } from 'vitest';
import CopyPromptButton from '../src/lib/components/CopyPromptButton.svelte';

describe('CopyPromptButton', () => {
  test('copies the prompt and shows a success state', async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined)
      }
    });

    render(CopyPromptButton, {
      prompt: 'test prompt',
      characterName: 'nila-after-rain'
    });

    await fireEvent.click(screen.getByRole('button', { name: /copy lite prompt/i }));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test prompt');
    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveTextContent('Copied');
    });
  });
});
