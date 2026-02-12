import path from "node:path";
import { EnvConfig } from "./types";
import {
  UrlWithoutAnchors,
  sanitizeUrlAsFilename,
} from "../helpers/url-handling";
import * as dotenv from "dotenv";

const DEFAULT_DEPTH = 2;

export function resolveEnv(): EnvConfig {
  let baseUrl = process.env.URL?.trim();
  let depth = process.env.DEPTH?.trim();
  let vectorIndexName = process.env.CHB_INDEX_ID?.trim();
  if (!baseUrl || !depth || !vectorIndexName) {
    const parserHome = path.resolve(__dirname, "../../");
    dotenv.config({ path: path.join(parserHome, ".env") });
    baseUrl = baseUrl || process.env.URL?.trim();
    depth = depth || process.env.DEPTH?.trim();
    vectorIndexName = vectorIndexName || process.env.CHB_INDEX_ID?.trim();
  }
  if (!baseUrl) {
    throw new Error(
      "Missing required URL. Set URL in environment or .env file.",
    );
  }
  const sanitizedBaseUrl = UrlWithoutAnchors(baseUrl);
  const parsedDepth = Number.parseInt(depth ?? `${DEFAULT_DEPTH}`, 10);
  const maxDepth = Number.isNaN(parsedDepth)
    ? DEFAULT_DEPTH
    : Math.max(parsedDepth, 0);
  const outputDirectory = generateOutputDirectoryPath(
    vectorIndexName,
    sanitizedBaseUrl,
  );
  return { baseUrl, sanitizedBaseUrl, outputDirectory, maxDepth };
}

function generateOutputDirectoryPath(
  vectorIndexName: string | undefined,
  sanitizedBaseUrl: string,
): string {
  const safeBaseSegment = sanitizeUrlAsFilename(sanitizedBaseUrl, {
    replacement: "_",
  });
  if (!vectorIndexName) {
    return `output/${safeBaseSegment}`;
  }
  return path.join(vectorIndexName, "parsing", safeBaseSegment);
}
