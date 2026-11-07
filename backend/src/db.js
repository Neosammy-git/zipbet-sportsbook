import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { seedDb } from './seed.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.DATA_DIR || path.resolve(here, '..', 'data');
const dbPath = path.join(dataDir, 'db.json');
let writeQueue = Promise.resolve();

export async function ensureDb() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dbPath);
  } catch {
    await fs.writeFile(dbPath, JSON.stringify(seedDb(), null, 2), 'utf8');
  }
}

export async function readDb() {
  await ensureDb();
  const data = JSON.parse(await fs.readFile(dbPath, 'utf8'));
  data.users ||= [];
  data.matches ||= [];
  data.bets ||= [];
  data.walletTransactions ||= [];
  return data;
}

// Serialize writes and replace the file atomically. This is suitable only for this
// single-process demo; production-grade multi-instance apps need a transactional DB.
export function writeDb(data) {
  const nextWrite = writeQueue.then(async () => {
    await ensureDb();
    const tempPath = `${dbPath}.${process.pid}.tmp`;
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf8');
    await fs.rename(tempPath, dbPath);
  });
  writeQueue = nextWrite.catch(() => {});
  return nextWrite;
}
