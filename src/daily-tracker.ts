import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import { getHudPluginDir } from './claude-config-dir.js';
import type { SessionTokenUsage } from './types.js';

interface SessionRecord {
  in: number;
  out: number;
  cacheCreate: number;
  cacheRead: number;
}

export interface DailyTotal {
  inputTokens: number;
  outputTokens: number;
  cacheCreationTokens: number;
  cacheReadTokens: number;
  sessionCount: number;
}

function getDailyTokensDir(homeDir: string): string {
  return path.join(getHudPluginDir(homeDir), 'daily-tokens');
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function sessionHash(transcriptPath: string): string {
  return crypto.createHash('sha256').update(path.resolve(transcriptPath)).digest('hex').slice(0, 16);
}

function writeAtomic(filePath: string, data: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const tmp = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  try {
    fs.writeFileSync(tmp, data, 'utf8');
  } catch {
    return;
  }
  try {
    fs.renameSync(tmp, filePath);
  } catch {
    // Windows: renameSync may fail if target is locked by a concurrent reader.
    // Fall back to direct write (not atomic, but the data is correct).
    try {
      fs.writeFileSync(filePath, data, 'utf8');
    } catch { /* give up */ }
    try { fs.unlinkSync(tmp); } catch { /* ignore */ }
  }
}

function readJson(filePath: string): SessionRecord | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw) as SessionRecord;
  } catch {
    return null;
  }
}

function cleanupOldDays(tokensDir: string, keepDays: number = 7): void {
  let entries: string[];
  try {
    entries = fs.readdirSync(tokensDir);
  } catch {
    return;
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - keepDays);
  const cutoffKey = `${cutoff.getFullYear()}-${String(cutoff.getMonth() + 1).padStart(2, '0')}-${String(cutoff.getDate()).padStart(2, '0')}`;

  for (const entry of entries) {
    if (entry < cutoffKey) {
      try {
        fs.rmSync(path.join(tokensDir, entry), { recursive: true, force: true });
      } catch { /* ignore */ }
    }
  }
}

export function updateDailyTokens(
  transcriptPath: string,
  sessionTokens: SessionTokenUsage | undefined,
  homeDir: string = os.homedir(),
): DailyTotal | null {
  if (!transcriptPath || !sessionTokens) {
    return null;
  }

  const tokensDir = getDailyTokensDir(homeDir);
  const today = todayKey();
  const dayDir = path.join(tokensDir, today);

  cleanupOldDays(tokensDir);

  const sessionFile = path.join(dayDir, `${sessionHash(transcriptPath)}.json`);
  const record: SessionRecord = {
    in: sessionTokens.inputTokens,
    out: sessionTokens.outputTokens,
    cacheCreate: sessionTokens.cacheCreationTokens,
    cacheRead: sessionTokens.cacheReadTokens,
  };
  writeAtomic(sessionFile, JSON.stringify(record));

  const total: DailyTotal = {
    inputTokens: 0,
    outputTokens: 0,
    cacheCreationTokens: 0,
    cacheReadTokens: 0,
    sessionCount: 0,
  };

  let files: string[];
  try {
    files = fs.readdirSync(dayDir);
  } catch {
    // readdirSync failed but we just wrote our session — return its data as fallback
    return {
      inputTokens: record.in,
      outputTokens: record.out,
      cacheCreationTokens: record.cacheCreate,
      cacheReadTokens: record.cacheRead,
      sessionCount: 1,
    };
  }

  for (const file of files) {
    if (!file.endsWith('.json')) continue;
    const r = readJson(path.join(dayDir, file));
    if (!r) continue;
    total.inputTokens += r.in;
    total.outputTokens += r.out;
    total.cacheCreationTokens += r.cacheCreate;
    total.cacheReadTokens += r.cacheRead;
    total.sessionCount += 1;
  }

  return total.sessionCount > 0 ? total : null;
}
