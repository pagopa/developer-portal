import path from 'node:path';
import { stripUrlDecorations } from '../utils/url';
import { sanitizeFilename } from '../utils/sanitizeFilename';

export type EnvConfig = {
  readonly baseUrl: string;
  readonly sanitizedBaseUrl: string;
  readonly outputDirectory: string;
  readonly maxDepth: number;
};

const DEFAULT_DEPTH = 2;

export function resolveEnv(): EnvConfig {
  const baseUrl = process.env.URL?.trim();
  if (!baseUrl) {
    throw new Error('Missing required URL.');
  }
  const sanitizedBaseUrl = stripUrlDecorations(baseUrl);
  const parsedDepth = Number.parseInt(process.env.DEPTH ?? `${DEFAULT_DEPTH}`, 10);
  const maxDepth = Number.isNaN(parsedDepth) ? DEFAULT_DEPTH : Math.max(parsedDepth, 0);
  const vectorIndexName = process.env.CHB_INDEX_ID?.trim();
  const outputDirectory = buildDefaultOutputDirectory(vectorIndexName, sanitizedBaseUrl);
  return { baseUrl, sanitizedBaseUrl, outputDirectory, maxDepth };
}

function buildDefaultOutputDirectory(
  vectorIndexName: string | undefined,
  sanitizedBaseUrl: string
): string {
  const safeBaseSegment = sanitizeFilename(sanitizedBaseUrl, { replacement: '_' });
  if (!vectorIndexName) {
    return `output/${safeBaseSegment}`;
  }
  return path.join(vectorIndexName, 'parsing', safeBaseSegment);
}
