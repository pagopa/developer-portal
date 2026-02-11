const ILLEGAL_RE = /[\/\?<>\\:\*\|"]/g;
const CONTROL_RE = /[\x00-\x1f\x80-\x9f]/g;
const RESERVED_RE = /^\.+$/;
const WINDOWS_RESERVED_RE = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;
const WINDOWS_TRAILING_RE = /[\. ]+$/;

export type SanitizeOptions = {
  readonly replacement?: string;
};

const DEFAULT_REPLACEMENT = '-';

export function sanitizeUrlAsFilename(input: string, options?: SanitizeOptions): string {
  if (!input) {
    return DEFAULT_REPLACEMENT;
  }

  const replacement = validReplacementOrDefault(options?.replacement ?? DEFAULT_REPLACEMENT);
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

  if (/[\/\?<>\\:\*\|"]/u.test(candidate) || /[\x00-\x1f\x80-\x9f]/u.test(candidate)) {
    return DEFAULT_REPLACEMENT;
  }

  return candidate;
}

// export const stripUrlDecorations = (rawUrl: string): string => {
//     const trimmed = rawUrl.trim();
//     if (trimmed.length === 0) {
//       return trimmed;
//     }
//     const [withoutParams] = trimmed.split(/[?#]/);
//     return withoutParams !== '/' && withoutParams.endsWith('/')
//       ? withoutParams.slice(0, -1)
//       : withoutParams;
//   };
  
export const UrlWithoutAnchors = (rawUrl: string): string => {
try {
    const parsed = new URL(rawUrl);
    parsed.hash = '';
    if (parsed.pathname.length > 1 && parsed.pathname.endsWith('/')) {
    parsed.pathname = parsed.pathname.slice(0, -1);
    }
    const serialized = parsed.toString();
    if (parsed.pathname === '/' && !parsed.search) {
    return serialized.endsWith('/') ? serialized.slice(0, -1) : serialized;
    }
    return serialized;
} catch (_error) {
    return rawUrl;
}
};
