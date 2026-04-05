import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const HASH_PREFIX = 'soulprompts-scrypt';
const KEY_LENGTH = 64;

export function createPasswordHash(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `${HASH_PREFIX}$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [prefix, salt, hash] = storedHash.split('$');
  if (prefix !== HASH_PREFIX || !salt || !hash) {
    return false;
  }

  const calculated = scryptSync(password, salt, KEY_LENGTH);
  const expected = Buffer.from(hash, 'hex');
  if (calculated.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(calculated, expected);
}
