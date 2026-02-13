import { SanitizeOptions } from "../modules/types";
import crypto from "crypto";

const ILLEGAL_RE = /[\/\?<>\\:\*\|"]/g;
const CONTROL_RE = /[\x00-\x1f\x80-\x9f]/g;
const RESERVED_RE = /^\.+$/;
const WINDOWS_RESERVED_RE = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;
const WINDOWS_TRAILING_RE = /[\. ]+$/;
const DEFAULT_REPLACEMENT = "-";

export function sanitizeUrlAsFilename(
  url: string,
  options?: SanitizeOptions,
): string {
  if (!url) {
    console.warn(
      `Missing input url, sanitizing as default "${DEFAULT_REPLACEMENT}"`,
    );
    return DEFAULT_REPLACEMENT;
  }
  let filenameBase = url;
  try {
    const urlObj = new URL(url);
    const pathAndSearch = `${urlObj.pathname}${urlObj.search}`;
    if (pathAndSearch === "/" || pathAndSearch === "") {
      filenameBase = urlObj.hostname;
    } else {
      filenameBase = pathAndSearch;
    }
  } catch (_error) {
    // If it's not a valid URL, use as-is
  }
  const replacement = validReplacementOrDefault(
    options?.replacement ?? DEFAULT_REPLACEMENT,
  );
  let sanitized = filenameBase
    .replace(/\/$/, "")
    .replace(ILLEGAL_RE, replacement)
    .replace(CONTROL_RE, replacement)
    .replace(RESERVED_RE, replacement)
    .replace(WINDOWS_RESERVED_RE, replacement)
    .replace(WINDOWS_TRAILING_RE, replacement)
    .trim();
  if (sanitized.length === 0) {
    return replacement;
  }
  const trimmedName = sanitized.replace(/^[-_]+/, "") || sanitized;
  if (
    options?.lengthThreshold &&
    trimmedName.length > options.lengthThreshold
  ) {
    const hash = crypto
      .createHash("sha1")
      .update(url)
      .digest("hex")
      .slice(0, 9);
    const prefix = trimmedName.slice(0, options.lengthThreshold - 10);
    return `${prefix}_${hash}`;
  }
  return trimmedName;
}

function validReplacementOrDefault(candidate: string): string {
  if (!candidate) {
    console.warn(
      `Missing replacement character, using default "${DEFAULT_REPLACEMENT}"`,
    );
    return DEFAULT_REPLACEMENT;
  }
  if (
    /[\/\?<>\\:\*\|"]/u.test(candidate) ||
    /[\x00-\x1f\x80-\x9f]/u.test(candidate)
  ) {
    console.warn(
      `Invalid replacement character: "${candidate}", using default "${DEFAULT_REPLACEMENT}"`,
    );
    return DEFAULT_REPLACEMENT;
  }
  return candidate;
}

export const RemoveAnchorsFromUrl = (rawUrl: string): string => {
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
    RemoveAnchorsFromUrl(targetUrl) === sanitizedBaseUrl ||
    relPath === "/" ||
    relPath === ""
  ) {
    return "/";
  }
  return `${relPath}${target.search}${target.hash}` || "/";
}

export function isWithinScope(
  url: string,
  scope: string,
  validDomainVariants: string[] = [],
): boolean {
  if (!scope) {
    return true;
  }
  // TODO: This function could be generalized to better handle edge cases. For now it performs a basic check to see if the URL is within the same domain or valid subdomain variants as the scope.
  try {
    const urlObj = new URL(url);
    const scopeObj = new URL(scope);
    const urlDomain = urlObj.hostname.replace(/^www\./, "");
    const scopeDomain = scopeObj.hostname.replace(/^www\./, "");
    if (urlDomain === scopeDomain) {
      return true;
    }
    const urlParts = urlDomain.split(".");
    const scopeParts = scopeDomain.split(".");
    if (urlParts.length > scopeParts.length) {
      const subdomain = urlParts[0];
      const domainWithoutSubdomain = urlParts.slice(1).join(".");
      if (
        domainWithoutSubdomain === scopeDomain &&
        validDomainVariants.includes(subdomain)
      ) {
        return true;
      }
    }
    return false;
  } catch (_error) {
    return false;
  }
}

export function buildVisitKey(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    url.hash = "";
    url.hostname = url.hostname.replace(/^www\./, "");
    return RemoveAnchorsFromUrl(url.toString());
  } catch (error) {
    console.warn(`Failed to build visit key for URL: ${rawUrl}`, error);
    return rawUrl;
  }
}