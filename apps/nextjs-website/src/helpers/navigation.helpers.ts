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

    // Verify the origin hasn't changed (prevents sneaky scheme/host injections)
    if (parsedUrl.origin !== DUMMY_BASE) {
      return false;
    }

    // Allow exact root path
    if (normalizedPath === '/') return true;

    // Allow paths that start with a supported locale exactly (e.g., /en/...)
    return SUPPORTED_LOCALES.some(
      (l) =>
        normalizedPath === `/${l.langCode}` ||
        normalizedPath.startsWith(`/${l.langCode}/`)
    );
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
