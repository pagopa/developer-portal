import { mkdirSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';

export function ensureDirectory(dir: string) {
  mkdirSync(dir, { recursive: true });
}

export async function saveMetadata(dir: string, filename: string, metadata: object) {
  await writeFile(`${dir}/${filename}`, JSON.stringify(metadata, null, 2));
}
