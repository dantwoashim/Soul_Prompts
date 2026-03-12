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

    // Try to extract the chunks array from various JSON structures
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
            // Try wrapping in brackets if it looks like truncated JSON
            throw new Error('Unrecognized format');
        }
    } catch {
        // Sometimes the export is missing outer braces or has trailing content
        // Try to find the chunks array manually
        const chunksMatch = rawJson.match(/"chunks"\s*:\s*\[/);
        if (chunksMatch && chunksMatch.index !== undefined) {
            const startIdx = chunksMatch.index + chunksMatch[0].length - 1;
            // Find matching bracket
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
                throw new Error('Could not parse conversation data. Please ensure you uploaded a valid AI Studio export file.');
            }
        } else {
            throw new Error('Could not find conversation data in the uploaded file.');
        }
    }

    const messages: ParsedMessage[] = [];
    let thinkingBlocksStripped = 0;

    for (const chunk of chunks) {
        // Skip thinking blocks entirely
        if (chunk.isThought) {
            thinkingBlocksStripped++;
            continue;
        }

        // Skip empty chunks
        if (!chunk.text && (!chunk.parts || chunk.parts.length === 0)) {
            continue;
        }

        // Build the complete message text
        let messageText = '';

        if (chunk.parts && chunk.parts.length > 0) {
            // Join non-thought parts, skip thought parts and signatures
            const textParts = chunk.parts.filter(
                (p) => !p.thought && !p.thoughtSignature && p.text && p.text.trim() !== ''
            );
            messageText = textParts.map((p) => p.text || '').join('');
        }

        // Fall back to chunk.text if parts didn't produce content
        if (!messageText.trim() && chunk.text) {
            messageText = chunk.text;
        }

        // Clean up the text
        messageText = cleanMessageText(messageText);

        if (!messageText.trim()) {
            continue;
        }

        // Check if this is a duplicate of the previous thinking block's actual response
        // Sometimes thinking + response are separate chunks for the same turn
        const lastMsg = messages[messages.length - 1];
        if (lastMsg && lastMsg.role === mapRole(chunk.role) && lastMsg.text === messageText) {
            continue; // Skip duplicate
        }

        messages.push({
            role: mapRole(chunk.role),
            text: messageText,
            timestamp: chunk.createTime || '',
        });
    }

    // Merge consecutive messages from the same role (model responses split across chunks)
    const mergedMessages = mergeConsecutive(messages);

    const cleanedText = mergedMessages.map((m) => m.text).join('\n');
    const cleanedSize = new Blob([cleanedText]).size / 1024;

    return {
        messages: mergedMessages,
        stats: {
            totalMessages: mergedMessages.length,
            userMessages: mergedMessages.filter((m) => m.role === 'user').length,
            characterMessages: mergedMessages.filter((m) => m.role === 'character').length,
            thinkingBlocksStripped,
            originalSizeKb: Math.round(originalSize),
            cleanedSizeKb: Math.round(cleanedSize),
        },
    };
}

function mapRole(role: string): 'user' | 'character' {
    return role === 'user' ? 'user' : 'character';
}

function cleanMessageText(text: string): string {
    return text
        .replace(/\\u0027/g, "'")   // Unescape apostrophes
        .replace(/\\n/g, '\n')       // Unescape newlines
        .replace(/\\t/g, '\t')       // Unescape tabs
        .replace(/\n{3,}/g, '\n\n')  // Collapse excessive newlines
        .trim();
}

function mergeConsecutive(messages: ParsedMessage[]): ParsedMessage[] {
    const merged: ParsedMessage[] = [];
    for (const msg of messages) {
        const last = merged[merged.length - 1];
        if (last && last.role === msg.role) {
            // Don't merge if the text is identical (duplicate chunk)
            if (last.text !== msg.text) {
                last.text += '\n\n' + msg.text;
            }
        } else {
            merged.push({ ...msg });
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

    for (const msg of messages) {
        const label = msg.role === 'user' ? '**You**' : `**${charLabel}**`;
        const timestamp = msg.timestamp ? formatTimestamp(msg.timestamp) : '';
        const timeStr = timestamp ? ` *${timestamp}*` : '';

        lines.push(`${label}${timeStr}`);
        lines.push('');
        lines.push(msg.text);
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
    lines.push(`Cleaned by SoulPrompts Conversation Parser`);
    lines.push(`${messages.length} messages`);
    lines.push('');
    lines.push('════════════════════════════════════════');
    lines.push('');

    for (const msg of messages) {
        const label = msg.role === 'user' ? 'You' : charLabel;
        const timestamp = msg.timestamp ? formatTimestamp(msg.timestamp) : '';
        const timeStr = timestamp ? ` [${timestamp}]` : '';

        lines.push(`${label}${timeStr}:`);
        lines.push(msg.text);
        lines.push('');
        lines.push('────────────────────────────────────────');
        lines.push('');
    }

    return lines.join('\n');
}

function formatTimestamp(iso: string): string {
    try {
        const d = new Date(iso);
        return d.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    } catch {
        return '';
    }
}
