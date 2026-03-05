import { SUPPORTED_LOCALES } from '@/locales';

export function canRedirectToUrl(path: string): boolean {
  // eslint-disable-next-line functional/no-try-statements
  try {
    if (!path || typeof path !== 'string') return false;

    // Prevent browser normalization bypasses (convert \ to /)
    const normalizedPath = path.replace(/\\/g, '/');

    // Reject non-relative paths and protocol-relative paths (//evil.com)
    if (!normalizedPath.startsWith('/') || normalizedPath.startsWith('//')) {
      return false;
    }

    const DUMMY_BASE = 'http://safe-dummy.local';
    const parsedUrl = new URL(normalizedPath, DUMMY_BASE);

    const canonicalPath = parsedUrl.pathname;
    const hasSearchOrHash =
      (parsedUrl.search && parsedUrl.search.length > 0) ||
      (parsedUrl.hash && parsedUrl.hash.length > 0);

    // Verify the origin hasn't changed (prevents sneaky scheme/host injections)
    if (parsedUrl.origin !== DUMMY_BASE) {
      return false;
    }

    // Allow exact root path, but only without query or hash to preserve behavior
    if (canonicalPath === '/' && !hasSearchOrHash) return true;

    // Allow paths that start with a supported locale exactly (e.g., /en/...)
    return SUPPORTED_LOCALES.some((l) => {
      const localeBase = `/${l.langCode}`;
      // Bare locale path (e.g., /en) is allowed only without query/hash
      if (canonicalPath === localeBase && !hasSearchOrHash) {
        return true;
      }

      // Locale-prefixed subpaths (e.g., /en/..., /en/page?x=1) are allowed
      return canonicalPath.startsWith(`${localeBase}/`);
    });
  } catch {
    return false;
  }
}

export function isExternalLink(currentHost: string, href: string): boolean {
  if (!/^https?:\/\//.test(href) && !/^\/\//.test(href)) {
    return false;
  }

  // eslint-disable-next-line functional/no-try-statements
  try {
    // For protocol-relative URLs, prepend 'http:' to parse
    const url = new URL(/^\/\//.test(href) ? 'http:' + href : href);
    const normalizedCurrentHost = currentHost.toLowerCase();
    const urlHostname = url.hostname.toLowerCase();
    const urlHost = url.host.toLowerCase();

    const isSameHost =
      urlHostname === normalizedCurrentHost ||
      urlHost === normalizedCurrentHost;

    return !isSameHost;
  } catch {
    // If the URL cannot be parsed, treat it as non-external by default.
    return false;
  }
}
