import process from 'node:process';
import { createPasswordHash } from '../src/lib/server/auth/password.ts';

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run hash:admin -- "your-password"');
  process.exit(1);
}

console.log(createPasswordHash(password));
