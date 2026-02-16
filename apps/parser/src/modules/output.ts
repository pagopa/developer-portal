import { mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { ParsedMetadata } from "./types";
import { sanitizeUrlAsFilename } from "../helpers/url-handling";
import { BASE_HOST_TOKEN } from "../main";

const FILENAME_LENGTH_THRESHOLD = 250;

export function ensureDirectory(dir: string) {
  mkdirSync(dir, { recursive: true });
}

export async function persistSnapshot(
  snapshot: ParsedMetadata,
  baseScope: string,
  outputDirectory: string,
): Promise<void> {
  let finalName = sanitizeUrlAsFilename(snapshot.url, baseScope, {
    lengthThreshold: FILENAME_LENGTH_THRESHOLD,
  });
  if (finalName.replace(/^www\./, "") === BASE_HOST_TOKEN) {
    finalName = "index";
  }
  await saveMetadata(outputDirectory, `${finalName}.json`, snapshot);
}

async function saveMetadata(dir: string, filename: string, metadata: object) {
  await writeFile(join(dir, filename), JSON.stringify(metadata, null, 2));
}
