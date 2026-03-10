import path from "node:path";
import { EnvConfig } from "./types";
import {
  RemoveAnchorsFromUrl,
  sanitizeUrlAsDirectoryName,
} from "../helpers/url-handling";
import * as dotenv from "dotenv";

const DEFAULT_REQUEST_TIMEOUT_MS = 10_000;

export function resolveEnv(): EnvConfig {
  const parserHome = path.resolve(__dirname, "../../");
  dotenv.config({ path: path.join(parserHome, ".env") });
  const baseUrl = process.env.URL?.trim();
  const depth = process.env.DEPTH?.trim();
  const vectorIndexName = process.env.CHB_INDEX_ID?.trim();
  const validDomainVariants = process.env.VALID_DOMAIN_VARIANTS?.trim();
  if (!baseUrl) {
    throw new Error("Missing required URL.");
  }
  const requestTimeoutMs = Number.parseInt(
    process.env.PUBLIC_PARSER_REQUEST_TIMEOUT_MS ??
      `${DEFAULT_REQUEST_TIMEOUT_MS}`,
    10,
  );
  const shouldCreateFilesLocally =
    process.env.SHOULD_CREATE_FILES_LOCALLY === "true";
  const S3BucketName = process.env.S3_BUCKET_NAME?.trim();
  if (!S3BucketName && !shouldCreateFilesLocally) {
    throw new Error(
      "Missing required S3 Bucket Name.",
    );
  }
  const sanitizedBaseUrl = RemoveAnchorsFromUrl(baseUrl);
  const parsedDepth = depth ? Number.parseInt(depth, 10) : null;
  const maxDepth = parsedDepth ? Math.max(parsedDepth, 0) : null;
  const outputDirectory = generateOutputDirectoryPath(
    vectorIndexName,
    sanitizedBaseUrl,
  );
  let parsedValidDomainVariants: string[] = [];
  if (validDomainVariants) {
    try {
      parsedValidDomainVariants = JSON.parse(validDomainVariants);
      if (!Array.isArray(parsedValidDomainVariants)) {
        console.warn(
          "Invalid VALID_DOMAIN_VARIANTS format: expected an array. Falling back to empty array.",
        );
        parsedValidDomainVariants = [];
      }
    } catch (_error) {
      console.warn(
        "Failed to parse VALID_DOMAIN_VARIANTS as JSON. Falling back to empty array.",
      );
      parsedValidDomainVariants = [];
    }
  }
  return {
    baseUrl,
    sanitizedBaseUrl,
    outputDirectory,
    maxDepth,
    requestTimeoutMs,
    validDomainVariants: parsedValidDomainVariants,
    shouldCreateFilesLocally,
    S3BucketName,
  };
}

function generateOutputDirectoryPath(
  vectorIndexName: string | undefined,
  sanitizedBaseUrl: string,
): string {
  const safeBaseSegment = sanitizeUrlAsDirectoryName(sanitizedBaseUrl, {
    replacement: "-",
  });
  if (!vectorIndexName) {
    return `output/${safeBaseSegment}`;
  }
  return path.join(vectorIndexName, "parser", safeBaseSegment);
}
