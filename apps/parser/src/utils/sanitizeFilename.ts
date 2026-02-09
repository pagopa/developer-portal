const ILLEGAL_RE = /[\/\?<>\\:\*\|"]/g;
const CONTROL_RE = /[\x00-\x1f\x80-\x9f]/g;
const RESERVED_RE = /^\.+$/;
const WINDOWS_RESERVED_RE = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;
const WINDOWS_TRAILING_RE = /[\. ]+$/;

export type SanitizeOptions = {
  readonly replacement?: string;
};

const DEFAULT_REPLACEMENT = '_';

export function sanitizeFilename(input: string, options?: SanitizeOptions): string {
  if (!input) {
    return DEFAULT_REPLACEMENT;
  }

  const replacement = normalizeReplacement(options?.replacement ?? DEFAULT_REPLACEMENT);
  let sanitized = input
    .replace(ILLEGAL_RE, replacement)
    .replace(CONTROL_RE, replacement)
    .replace(RESERVED_RE, replacement)
    .replace(WINDOWS_RESERVED_RE, replacement)
    .replace(WINDOWS_TRAILING_RE, replacement)
    .trim();

  if (sanitized.length === 0) {
    return replacement;
  }

  return sanitized.slice(0, 255);
}

function normalizeReplacement(candidate: string): string {
  if (!candidate) {
    return DEFAULT_REPLACEMENT;
  }

  if (/[\/\?<>\\:\*\|"]/u.test(candidate) || /[\x00-\x1f\x80-\x9f]/u.test(candidate)) {
    return DEFAULT_REPLACEMENT;
  }

  return candidate;
}
