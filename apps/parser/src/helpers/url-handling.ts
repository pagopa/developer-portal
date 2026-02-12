import { SanitizeOptions } from "../modules/types";

const ILLEGAL_RE = /[\/\?<>\\:\*\|"]/g;
const CONTROL_RE = /[\x00-\x1f\x80-\x9f]/g;
const RESERVED_RE = /^\.+$/;
const WINDOWS_RESERVED_RE = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;
const WINDOWS_TRAILING_RE = /[\. ]+$/;
const DEFAULT_REPLACEMENT = "-";

export function sanitizeUrlAsFilename(
  input: string,
  options?: SanitizeOptions,
): string {
  if (!input) {
    return DEFAULT_REPLACEMENT;
  }
  const replacement = validReplacementOrDefault(
    options?.replacement ?? DEFAULT_REPLACEMENT,
  );
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

function validReplacementOrDefault(candidate: string): string {
  if (!candidate) {
    return DEFAULT_REPLACEMENT;
  }
  if (
    /[\/\?<>\\:\*\|"]/u.test(candidate) ||
    /[\x00-\x1f\x80-\x9f]/u.test(candidate)
  ) {
    return DEFAULT_REPLACEMENT;
  }
  return candidate;
}

export const UrlWithoutAnchors = (rawUrl: string): string => {
  try {
    const parsed = new URL(rawUrl);
    parsed.hash = "";
    if (parsed.pathname.length > 1 && parsed.pathname.endsWith("/")) {
      parsed.pathname = parsed.pathname.slice(0, -1);
    }
    const serialized = parsed.toString();
    if (parsed.pathname === "/" && !parsed.search) {
      return serialized.endsWith("/") ? serialized.slice(0, -1) : serialized;
    }
    return serialized;
  } catch (error) {
    console.warn(`Failed to parse URL: ${rawUrl}`, error);
    return rawUrl;
  }
};

export function deriveSubPath(
  targetUrl: string,
  baseUrl: string,
  sanitizedBaseUrl: string,
): string {
  const base = new URL(baseUrl);
  const target = new URL(targetUrl);
  let relPath = target.pathname;
  if (base.pathname !== "/" && relPath.startsWith(base.pathname)) {
    relPath = relPath.slice(base.pathname.length);
    if (!relPath.startsWith("/")) relPath = "/" + relPath;
  }
  if (
    UrlWithoutAnchors(targetUrl) === sanitizedBaseUrl ||
    relPath === "/" ||
    relPath === ""
  ) {
    return "/";
  }
  return `${relPath}${target.search}${target.hash}` || "/";
}
