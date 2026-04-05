interface LoginAttemptWindow {
  count: number;
  resetAt: number;
}

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, LoginAttemptWindow>();

function getKey(ip: string): string {
  return ip || 'unknown';
}

export function recordFailedLoginAttempt(ip: string) {
  const key = getKey(ip);
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, {
      count: 1,
      resetAt: now + WINDOW_MS
    });
    return;
  }

  current.count += 1;
  attempts.set(key, current);
}

export function clearLoginAttempts(ip: string) {
  attempts.delete(getKey(ip));
}

export function isLoginRateLimited(ip: string) {
  const current = attempts.get(getKey(ip));
  if (!current) return false;
  if (current.resetAt <= Date.now()) {
    attempts.delete(getKey(ip));
    return false;
  }

  return current.count >= MAX_ATTEMPTS;
}
