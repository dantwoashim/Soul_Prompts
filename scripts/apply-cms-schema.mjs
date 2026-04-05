import { readFile } from 'node:fs/promises';
import path from 'node:path';
import postgres from 'postgres';

const connectionString = process.env.CMS_DATABASE_URL;

if (!connectionString) {
  console.error('CMS_DATABASE_URL is required to apply the CMS schema.');
  process.exit(1);
}

const sql = postgres(connectionString, {
  ssl: process.env.CMS_DATABASE_SSL === 'disable' ? false : 'require',
  prepare: false
});

try {
  const schemaPath = path.resolve('database', 'cms-schema.sql');
  const schemaSql = await readFile(schemaPath, 'utf8');
  await sql.unsafe(schemaSql);
  console.log('CMS schema applied successfully.');
} finally {
  await sql.end();
}
