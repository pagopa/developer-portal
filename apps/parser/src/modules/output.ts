import { mkdirSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export function ensureDirectory(dir: string) {
  mkdirSync(dir, { recursive: true });
}

export async function saveMetadata(dir: string, filename: string, metadata: object) {
  await writeFile(join(dir, filename), JSON.stringify(metadata, null, 2));
}
