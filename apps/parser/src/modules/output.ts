import { mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { ParsedMetadata } from "./types";
import { sanitizeUrlAsFilename } from "../helpers/url-handling";
import {
  BASE_HOST_TOKEN,
  S3_BUCKET_NAME,
} from "../main";
import { makeS3Client, putS3File } from "../helpers/s3bucket-helper";
import { S3Client } from "@aws-sdk/client-s3";

const FILENAME_LENGTH_THRESHOLD = 250;
let s3Client: S3Client | undefined;

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
  if (finalName.replace("www.", "") === BASE_HOST_TOKEN) {
    finalName = "index";
  }
  console.log(`Saving ${finalName}.json to S3 bucket...`);
  console.log(`Snapshot URL: ${snapshot.url}`);
  console.log(`Snapshot bodyText length: ${snapshot.bodyText?.length ?? 0}`);
  console.log(`Output path: ${outputDirectory}/${finalName}.json`);
  try {
    await putS3File(
      snapshot,
      outputDirectory + `/${finalName}.json`,
      S3_BUCKET_NAME!,
      getS3Client(),
    );
  } catch (error) {
    console.error(`Failed to save ${finalName}.json to S3 bucket:`, error);
  }
}

async function saveMetadata(dir: string, filename: string, metadata: object) {
  await writeFile(join(dir, filename), JSON.stringify(metadata, null, 2));
}

function getS3Client(): S3Client {
  if (!s3Client) {
    s3Client = makeS3Client();
  }
  return s3Client;
}
