import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { seedDb } from './seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'db.json');

export async function ensureDb() {
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }

  try {
    await fs.access(dbPath);
  } catch {
    const seeded = seedDb();
    await fs.writeFile(dbPath, JSON.stringify(seeded, null, 2), 'utf8');
  }
}

export async function readDb() {
  await ensureDb();
  const raw = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(raw);
}

export async function writeDb(data) {
  await ensureDb();
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
}
