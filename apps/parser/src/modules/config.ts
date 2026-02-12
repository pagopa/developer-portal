import path from 'node:path';
import { stripUrlDecorations } from '../utils/url';
import { sanitizeFilename } from '../utils/sanitizeFilename';

export type EnvConfig = {
  readonly baseUrl: string;
  readonly sanitizedBaseUrl: string;
  readonly outputDirectory: string;
  readonly maxDepth: number;
};

const DEFAULT_BASE_URL = 'https://news.polymer-project.org/';
const DEFAULT_DEPTH = 2;

export function resolveEnv(): EnvConfig {
  const baseUrl = process.env.URL?.trim().length ? process.env.URL : DEFAULT_BASE_URL;
  const sanitizedBaseUrl = stripUrlDecorations(baseUrl);
  const parsedDepth = Number.parseInt(process.env.DEPTH ?? `${DEFAULT_DEPTH}`, 10);
  const maxDepth = Number.isNaN(parsedDepth) ? DEFAULT_DEPTH : Math.max(parsedDepth, 0);
  const vectorIndexName = process.env.PARSER_VECTOR_INDEX_NAME?.trim();
  const derivedOutput = buildDefaultOutputDirectory(vectorIndexName, sanitizedBaseUrl);
  const outputDirectory = process.env.OUTDIR?.trim().length
    ? process.env.OUTDIR
    : derivedOutput;
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
