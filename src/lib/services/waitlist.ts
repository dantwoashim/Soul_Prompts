import { browser } from '$app/environment';

export type WaitlistStatus = 'success' | 'duplicate' | 'error';

export interface WaitlistResult {
  status: WaitlistStatus;
  message: string;
}

export interface WaitlistClient {
  submit(email: string): Promise<WaitlistResult>;
}

const storageKey = 'soulprompts.waitlist.submissions';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readLocalEmails(): string[] {
  if (!browser) {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored ? (JSON.parse(stored) as string[]) : [];
  } catch {
    return [];
  }
}

function writeLocalEmail(email: string): void {
  if (!browser) {
    return;
  }

  const current = new Set(readLocalEmails());
  current.add(email);
  window.localStorage.setItem(storageKey, JSON.stringify([...current]));
}

export function createButtondownWaitlistClient(
  endpoint: string = import.meta.env.PUBLIC_BUTTONDOWN_EMBED_ENDPOINT || ''
): WaitlistClient {
  return {
    async submit(email: string): Promise<WaitlistResult> {
      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail) {
        return {
          status: 'error',
          message: 'Enter an email address first.'
        };
      }

      if (!emailPattern.test(normalizedEmail)) {
        return {
          status: 'error',
          message: 'Enter a valid email address.'
        };
      }

      if (!endpoint) {
        return {
          status: 'error',
          message: 'Waitlist is not configured yet.'
        };
      }

      if (readLocalEmails().includes(normalizedEmail)) {
        return {
          status: 'duplicate',
          message: 'That address is already on this browser waitlist.'
        };
      }

      try {
        await fetch(endpoint, {
          method: 'POST',
          mode: 'no-cors',
          body: new URLSearchParams({ email: normalizedEmail })
        });

        writeLocalEmail(normalizedEmail);

        return {
          status: 'success',
          message: 'You are in. Check your inbox for the confirmation email.'
        };
      } catch {
        return {
          status: 'error',
          message: 'The waitlist request failed. Try again in a moment.'
        };
      }
    }
  };
}

export const buttondownWaitlistClient = createButtondownWaitlistClient();
