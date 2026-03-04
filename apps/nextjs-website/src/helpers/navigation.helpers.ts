export function isExternalLink(currentHost: string, href: string): boolean {
  if (!/^https?:\/\//.test(href)) {
    return false;
  }

  try {
    const url = new URL(href);
    const normalizedCurrentHost = currentHost.toLowerCase();
    const urlHostname = url.hostname.toLowerCase();
    const urlHost = url.host.toLowerCase();

    const isSameHost =
      urlHostname === normalizedCurrentHost || urlHost === normalizedCurrentHost;

    return !isSameHost;
  } catch {
    // If the URL cannot be parsed, treat it as non-external by default.
    return false;
  }
}
