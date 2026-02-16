import path from "node:path";
import { EnvConfig } from "./types";
import {
  RemoveAnchorsFromUrl,
  sanitizeUrlAsDirectoryName,
} from "../helpers/url-handling";
import * as dotenv from "dotenv";

const DEFAULT_DEPTH = null;

export function resolveEnv(): EnvConfig {
  let baseUrl = process.env.URL?.trim();
  let depth = process.env.DEPTH?.trim();
  let vectorIndexName = process.env.CHB_INDEX_ID?.trim();
  let validDomainVariants = process.env.VALID_DOMAIN_VARIANTS?.trim();
  if (!baseUrl || !depth || !vectorIndexName) {
    const parserHome = path.resolve(__dirname, "../../");
    dotenv.config({ path: path.join(parserHome, ".env") });
    baseUrl = baseUrl || process.env.URL?.trim();
    depth = depth || process.env.DEPTH?.trim();
    vectorIndexName = vectorIndexName || process.env.CHB_INDEX_ID?.trim();
    validDomainVariants =
      validDomainVariants || process.env.VALID_DOMAIN_VARIANTS?.trim();
  }
  if (!baseUrl) {
    throw new Error(
      "Missing required URL. Set URL in environment or .env file.",
    );
  }
  const sanitizedBaseUrl = RemoveAnchorsFromUrl(baseUrl);
  const parsedDepth = Number.parseInt(depth ?? `${DEFAULT_DEPTH}`, 10);
  const maxDepth = Number.isNaN(parsedDepth)
    ? DEFAULT_DEPTH
    : Math.max(parsedDepth, 0);
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
    validDomainVariants: parsedValidDomainVariants,
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
  return path.join(vectorIndexName, "parsing", safeBaseSegment);
}
