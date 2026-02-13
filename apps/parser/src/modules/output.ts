import { mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { ParsedMetadata } from "./types";
import { sanitizeUrlAsFilename } from "../helpers/url-handling";

const FILENAME_LENGTH_THRESHOLD = 250;

export function ensureDirectory(dir: string) {
  mkdirSync(dir, { recursive: true });
}

export async function persistSnapshot(
  snapshot: ParsedMetadata,
  outputDirectory: string,
): Promise<void> {
  const finalName = sanitizeUrlAsFilename(snapshot.url, {
    lengthThreshold: FILENAME_LENGTH_THRESHOLD,
  });
  await saveMetadata(outputDirectory, `${finalName}.json`, snapshot);
}

async function saveMetadata(dir: string, filename: string, metadata: object) {
  await writeFile(join(dir, filename), JSON.stringify(metadata, null, 2));
}
