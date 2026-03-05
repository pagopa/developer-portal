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
