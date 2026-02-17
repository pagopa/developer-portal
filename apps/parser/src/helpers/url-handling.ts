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
  baseScope: string,
  options?: SanitizeOptions,
): string {
  if (url === baseScope) {
    return applySanitization(
      url,
      new URL(url).hostname.replace(/^www\./, ""),
      options,
    );
  } else {
    const pathAndSearch = url.replace(baseScope, "").replace(/^\/+/, "");
    if (pathAndSearch === "" || pathAndSearch === "/") {
      return applySanitization(
        url,
        url.split("/").filter(Boolean).pop() || url,
        options,
      );
    } else {
      return applySanitization(url, pathAndSearch, options);
    }
  }
}

export function sanitizeUrlAsDirectoryName(
  url: string,
  options?: SanitizeOptions,
): string {
  return applySanitization(
    url,
    url.replace(/^(https?:\/\/)?(www\.)?/, ""),
    options,
  );
}

function applySanitization(
  original_url: string,
  input: string,
  options?: SanitizeOptions,
): string {
  const replacement = validReplacementOrDefault(
    options?.replacement ?? DEFAULT_REPLACEMENT,
  );
  const sanitized = input
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
    const digest = crypto.createHash("sha1").update(original_url).digest();
    const hash = digest.subarray(0, 6).toString("base64url");
    const prefix = trimmedName.slice(
      0,
      options.lengthThreshold - (hash.length + 1),
    );
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

export function isWithinScope(
  url: string,
  baseScope: string,
  validDomainVariants: string[] = [],
): boolean {
  if (!baseScope) {
    return true;
  }
  // TODO: This function could be generalized to better handle edge cases. For now it performs a basic check to see if the URL is within the same domain or valid subdomain variants as the scope.
  try {
    const urlObj = new URL(url);
    const scopeObj = new URL(baseScope);
    const pathname = urlObj.pathname.toLowerCase();
    const fileExtensionRegex = /\.[a-z0-9]+$/;
    if (fileExtensionRegex.test(pathname) && !pathname.endsWith(".html")) {
      return false;
    }
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
    console.warn(`Failed to check if URL is within scope: ${url}`, _error);
    return false;
  }
}

export function buildVisitKey(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    url.hash = "";
    url.hostname = url.hostname.replace(/^www\./, "");
    return RemoveAnchorsFromUrl(url.hostname.toString()+url.pathname.toString());
  } catch (error) {
    console.warn(`Failed to build visit key for URL: ${rawUrl}`, error);
    return rawUrl;
  }
}
