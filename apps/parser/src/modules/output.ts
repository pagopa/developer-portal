import { mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { ParsedMetadata } from "./types";
import { sanitizeUrlAsFilename } from "../helpers/url-handling";
import {
  BASE_HOST_TOKEN,
  SHOULD_CREATE_FILES_LOCALLY,
  S3_BUCKET_NAME,
} from "../main";
import { makeS3Client, putS3File } from "gitbook-docs/helpers/s3Bucket.helper";
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
  if (finalName.replace(/www\./, "") === BASE_HOST_TOKEN) {
    finalName = "index";
  }
  if (SHOULD_CREATE_FILES_LOCALLY) {
    await saveMetadata(outputDirectory, `${finalName}.json`, snapshot);
  }
  console.log(`Saving ${finalName}.json to S3 bucket...`);
  console.log(`Snapshot URL: ${snapshot.url}`);
  console.log(`Snapshot bodyText: ${snapshot.bodyText}`);
  console.log(`Output path: ${outputDirectory}/${finalName}.json`);
  console.log(`S3 Bucket: ${S3_BUCKET_NAME}`);
  const s3Client = getS3Client();
  console.log("S3 Client Check:", {
    isS3Client: s3Client instanceof S3Client,
    regionProviderType: typeof s3Client.config.region,
  });
  try {
    const region = await s3Client.config.region();
    const credentials = await s3Client.config.credentials();
    console.log("S3 Client Resolved Config:", {
      region,
      accessKeyIdPrefix: credentials.accessKeyId?.slice(0, 4) ?? "",
    });
  } catch (error) {
    console.log("S3 Client Config Resolve Failed:", error);
  }
  await putS3File(
    snapshot,
    outputDirectory + `/${finalName}.json`,
    S3_BUCKET_NAME!,
    getS3Client(),
  );
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
