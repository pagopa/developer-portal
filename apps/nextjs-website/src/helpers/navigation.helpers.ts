export function isExternalLink(currentHost: string, href: string): boolean {
  return /^https?:\/\//.test(href) && !href.includes(currentHost);
}
