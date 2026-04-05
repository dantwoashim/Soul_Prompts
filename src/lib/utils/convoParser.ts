/**
 * AI Studio Conversation Parser
 * Converts messy AI Studio JSON exports into clean, readable conversation documents.
 */

export interface ParsedMessage {
  role: 'user' | 'character';
  text: string;
  timestamp: string;
}

export interface ParseResult {
  messages: ParsedMessage[];
  stats: {
    totalMessages: number;
    userMessages: number;
    characterMessages: number;
    thinkingBlocksStripped: number;
    originalSizeKb: number;
    cleanedSizeKb: number;
  };
}

interface RawChunk {
  text: string;
  role: 'user' | 'model';
  tokenCount?: number;
  createTime?: string;
  isThought?: boolean;
  finishReason?: string;
  parts?: RawPart[];
}

interface RawPart {
  text?: string;
  thought?: boolean;
  thoughtSignature?: string;
}

/**
 * Parse raw AI Studio JSON export into clean conversation messages.
 */
export function parseConversation(rawJson: string): ParseResult {
  const originalSize = new Blob([rawJson]).size / 1024;

  let chunks: RawChunk[] = [];

  try {
    const parsed = JSON.parse(rawJson);

    if (parsed.chunkedPrompt?.chunks) {
      chunks = parsed.chunkedPrompt.chunks;
    } else if (Array.isArray(parsed)) {
      chunks = parsed;
    } else if (parsed.chunks) {
      chunks = parsed.chunks;
    } else {
      throw new Error('Unrecognized format');
    }
  } catch {
    const chunksMatch = rawJson.match(/"chunks"\s*:\s*\[/);
    if (chunksMatch && chunksMatch.index !== undefined) {
      const startIdx = chunksMatch.index + chunksMatch[0].length - 1;
      let depth = 0;
      let endIdx = startIdx;

      for (let i = startIdx; i < rawJson.length; i++) {
        if (rawJson[i] === '[') depth++;
        if (rawJson[i] === ']') depth--;
        if (depth === 0) {
          endIdx = i + 1;
          break;
        }
      }

      try {
        chunks = JSON.parse(rawJson.substring(startIdx, endIdx));
      } catch {
        throw new Error(
          'Could not parse conversation data. Please ensure you uploaded a valid AI Studio export file.'
        );
      }
    } else {
      throw new Error('Could not find conversation data in the uploaded file.');
    }
  }

  const messages: ParsedMessage[] = [];
  let thinkingBlocksStripped = 0;

  for (const chunk of chunks) {
    if (chunk.isThought) {
      thinkingBlocksStripped++;
      continue;
    }

    if (!chunk.text && (!chunk.parts || chunk.parts.length === 0)) {
      continue;
    }

    let messageText = '';

    if (chunk.parts && chunk.parts.length > 0) {
      const textParts = chunk.parts.filter(
        (part) => !part.thought && !part.thoughtSignature && part.text && part.text.trim() !== ''
      );
      messageText = textParts.map((part) => part.text || '').join('');
    }

    if (!messageText.trim() && chunk.text) {
      messageText = chunk.text;
    }

    messageText = cleanMessageText(messageText);

    if (!messageText.trim()) {
      continue;
    }

    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage &&
      lastMessage.role === mapRole(chunk.role) &&
      lastMessage.text === messageText
    ) {
      continue;
    }

    messages.push({
      role: mapRole(chunk.role),
      text: messageText,
      timestamp: chunk.createTime || ''
    });
  }

  const mergedMessages = mergeConsecutive(messages);
  const cleanedText = mergedMessages.map((message) => message.text).join('\n');
  const cleanedSize = new Blob([cleanedText]).size / 1024;

  return {
    messages: mergedMessages,
    stats: {
      totalMessages: mergedMessages.length,
      userMessages: mergedMessages.filter((message) => message.role === 'user').length,
      characterMessages: mergedMessages.filter((message) => message.role === 'character').length,
      thinkingBlocksStripped,
      originalSizeKb: Math.round(originalSize),
      cleanedSizeKb: Math.round(cleanedSize)
    }
  };
}

function mapRole(role: string): 'user' | 'character' {
  return role === 'user' ? 'user' : 'character';
}

function cleanMessageText(text: string): string {
  return text
    .replace(/\\u0027/g, "'")
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function mergeConsecutive(messages: ParsedMessage[]): ParsedMessage[] {
  const merged: ParsedMessage[] = [];

  for (const message of messages) {
    const lastMessage = merged[merged.length - 1];
    if (lastMessage && lastMessage.role === message.role) {
      if (lastMessage.text !== message.text) {
        lastMessage.text += `\n\n${message.text}`;
      }
    } else {
      merged.push({ ...message });
    }
  }

  return merged;
}

/**
 * Format parsed messages as a clean Markdown document.
 */
export function formatAsMarkdown(messages: ParsedMessage[], characterName?: string): string {
  const charLabel = characterName || 'Character';
  const lines: string[] = [];

  lines.push(`# Conversation with ${charLabel}`);
  lines.push(`*Cleaned by [SoulPrompts](https://soulprompts.com) Conversation Parser*`);
  lines.push(`*${messages.length} messages*`);
  lines.push('');
  lines.push('---');
  lines.push('');

  for (const message of messages) {
    const label = message.role === 'user' ? '**You**' : `**${charLabel}**`;
    const timestamp = message.timestamp ? formatTimestamp(message.timestamp) : '';
    const timeString = timestamp ? ` *${timestamp}*` : '';

    lines.push(`${label}${timeString}`);
    lines.push('');
    lines.push(message.text);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Format parsed messages as plain text.
 */
export function formatAsText(messages: ParsedMessage[], characterName?: string): string {
  const charLabel = characterName || 'Character';
  const lines: string[] = [];

  lines.push(`Conversation with ${charLabel}`);
  lines.push('Cleaned by SoulPrompts Conversation Parser');
  lines.push(`${messages.length} messages`);
  lines.push('');
  lines.push('========================================');
  lines.push('');

  for (const message of messages) {
    const label = message.role === 'user' ? 'You' : charLabel;
    const timestamp = message.timestamp ? formatTimestamp(message.timestamp) : '';
    const timeString = timestamp ? ` [${timestamp}]` : '';

    lines.push(`${label}${timeString}:`);
    lines.push(message.text);
    lines.push('');
    lines.push('----------------------------------------');
    lines.push('');
  }

  return lines.join('\n');
}

function formatTimestamp(iso: string): string {
  try {
    const date = new Date(iso);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return '';
  }
}
