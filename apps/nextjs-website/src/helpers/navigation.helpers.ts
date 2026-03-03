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
    if (path === '/') return true;

    // Allow paths that start with a supported locale exactly (e.g., /en/...)
    return SUPPORTED_LOCALES.some((l) => path.startsWith(`/${l.langCode}/`));
  } catch {
    return false;
  }
}
