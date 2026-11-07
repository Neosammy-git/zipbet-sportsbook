import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { neon } from '@neondatabase/serverless';
import { seedDb } from './seed.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.DATA_DIR || path.resolve(here, '..', 'data');
const dbPath = path.join(dataDir, 'db.json');
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
let initialization;
let writeQueue = Promise.resolve();

async function initialize() {
  if (sql) {
    await sql`CREATE TABLE IF NOT EXISTS zipbet_state (id INTEGER PRIMARY KEY, state JSONB NOT NULL)`;
    await sql`INSERT INTO zipbet_state (id, state) VALUES (1, ${JSON.stringify(seedDb())}::jsonb) ON CONFLICT (id) DO NOTHING`;
    return;
  }
  if (process.env.VERCEL) {
    throw new Error('DATABASE_URL is required on Vercel. Connect a Neon Postgres database before deploying.');
  }
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dbPath);
  } catch {
    await fs.writeFile(dbPath, JSON.stringify(seedDb(), null, 2), 'utf8');
  }
}

export async function ensureDb() {
  if (!initialization) {
    initialization = initialize().catch((error) => {
      initialization = undefined;
      throw error;
    });
  }
  return initialization;
}

export async function readDb() {
  await ensureDb();
  const data = sql
    ? (await sql`SELECT state FROM zipbet_state WHERE id = 1`)[0]?.state
    : JSON.parse(await fs.readFile(dbPath, 'utf8'));
  if (!data) throw new Error('ZIPBET database state was not initialized.');
  data.users ||= [];
  data.matches ||= [];
  data.bets ||= [];
  data.walletTransactions ||= [];
  return data;
}

// Writes are serialized within one warm process. The JSON state store is intended
// for local demos; use Neon on Vercel. A relational schema/transactions are needed
// before treating this as production account or financial software.
export function writeDb(data) {
  const nextWrite = writeQueue.then(async () => {
    await ensureDb();
    if (sql) {
      await sql`UPDATE zipbet_state SET state = ${JSON.stringify(data)}::jsonb WHERE id = 1`;
      return;
    }
    const tempPath = `${dbPath}.${process.pid}.tmp`;
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf8');
    await fs.rename(tempPath, dbPath);
  });
  writeQueue = nextWrite.catch(() => {});
  return nextWrite;
}
