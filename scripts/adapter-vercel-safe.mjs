import fs from 'node:fs';
import path from 'node:path';
import adapter from '@sveltejs/adapter-vercel';

function copySymlinkTarget(target, destination) {
  const resolvedTarget = path.resolve(path.dirname(destination), target);
  const stats = fs.statSync(resolvedTarget);

  fs.rmSync(destination, { force: true, recursive: true });
  fs.mkdirSync(path.dirname(destination), { recursive: true });

  if (stats.isDirectory()) {
    fs.cpSync(resolvedTarget, destination, { recursive: true });
  } else {
    fs.copyFileSync(resolvedTarget, destination);
  }
}

export default function safeAdapter(options = {}) {
  const base = adapter(options);

  return {
    ...base,
    async adapt(builder) {
      const originalSymlinkSync = fs.symlinkSync;

      fs.symlinkSync = (target, destination, type) => {
        try {
          return originalSymlinkSync(target, destination, type);
        } catch (error) {
          const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : '';
          if (code !== 'EPERM') {
            throw error;
          }

          copySymlinkTarget(String(target), String(destination));
        }
      };

      try {
        return await base.adapt(builder);
      } finally {
        fs.symlinkSync = originalSymlinkSync;
      }
    }
  };
}
