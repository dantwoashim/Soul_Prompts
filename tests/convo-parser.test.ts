import { describe, expect, test } from 'vitest';
import { formatAsText, parseConversation } from '../src/lib/utils/convoParser';

describe('convoParser', () => {
  test('strips thought blocks and keeps only readable conversation text', () => {
    const raw = JSON.stringify({
      chunkedPrompt: {
        chunks: [
          {
            role: 'user',
            text: 'Hey there',
            createTime: '2026-03-24T01:00:00.000Z'
          },
          {
            role: 'model',
            isThought: true,
            text: 'Internal reasoning that should not ship'
          },
          {
            role: 'model',
            parts: [
              { text: 'Hello back.' },
              { thought: true, text: 'Hidden note' }
            ],
            createTime: '2026-03-24T01:01:00.000Z'
          }
        ]
      }
    });

    const parsed = parseConversation(raw);

    expect(parsed.messages).toEqual([
      {
        role: 'user',
        text: 'Hey there',
        timestamp: '2026-03-24T01:00:00.000Z'
      },
      {
        role: 'character',
        text: 'Hello back.',
        timestamp: '2026-03-24T01:01:00.000Z'
      }
    ]);
    expect(parsed.stats.thinkingBlocksStripped).toBe(1);
  });

  test('formats plain text output with ASCII separators', () => {
    const text = formatAsText(
      [
        {
          role: 'user',
          text: 'You kept the file clean.',
          timestamp: '2026-03-24T01:00:00.000Z'
        },
        {
          role: 'character',
          text: 'That is the whole point.',
          timestamp: '2026-03-24T01:01:00.000Z'
        }
      ],
      'Nila'
    );

    expect(text).toContain('========================================');
    expect(text).toContain('----------------------------------------');
    expect(text).not.toContain('â');
  });
});
