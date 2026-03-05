import { canRedirectToUrl, isExternalLink } from '@/helpers/navigation.helpers';

describe('canRedirectToUrl', () => {
  it('returns true for the root path', () => {
    expect(canRedirectToUrl('/')).toBe(true);
  });

  it('returns true for paths starting with a supported locale', () => {
    expect(canRedirectToUrl('/it/solutions')).toBe(true);
  });

  it('returns false for paths that look like a locale but are not supported', () => {
    expect(canRedirectToUrl('/fr/solutions')).toBe(false);
  });

  it('returns true for locale roots without trailing slash', () => {
    expect(canRedirectToUrl('/it')).toBe(true);
  });

  it('returns false for locale-less paths (e.g. rewritten by middleware)', () => {
    expect(canRedirectToUrl('/solutions')).toBe(false);
  });

  it('returns false for protocol-relative URLs', () => {
    expect(canRedirectToUrl('//evil.com')).toBe(false);
    expect(canRedirectToUrl('//evil.com/it/path')).toBe(false);
  });

  it('returns false for absolute URLs', () => {
    expect(canRedirectToUrl('https://google.com')).toBe(false);
    expect(canRedirectToUrl('http://google.com/it/path')).toBe(false);
  });

  it('rejects paths with weird schemes or manipulation attempts', () => {
    expect(canRedirectToUrl('javascript:alert(1)')).toBe(false);
    expect(canRedirectToUrl('data:text/html,test')).toBe(false);
  });

  it('normalizes backslashes to forward slashes', () => {
    // '\it\page' -> '/it/page' which is valid
    expect(canRedirectToUrl('\\it\\page')).toBe(true);
  });

  it('handles malformed encoding gracefully', () => {
    // URLs that might cause parsing errors or are just invalid
    expect(canRedirectToUrl('/%')).toBe(false);
  });

  it('returns false for empty or non-string inputs', () => {
    expect(canRedirectToUrl('')).toBe(false);
    // @ts-expect-error Testing invalid input
    expect(canRedirectToUrl(undefined)).toBe(false);
    // @ts-expect-error Testing invalid input
    expect(canRedirectToUrl(123)).toBe(false);
  });
});

describe('isExternalLink', () => {
  const currentHost = 'example.com';

  it('returns true for http external link', () => {
    expect(isExternalLink(currentHost, 'http://external.com')).toBe(true);
  });

  it('returns true for https external link', () => {
    expect(isExternalLink(currentHost, 'https://external.com')).toBe(true);
  });

  it('returns false for http link to current host', () => {
    expect(isExternalLink(currentHost, 'http://example.com/page')).toBe(false);
  });

  it('returns false for https link to current host', () => {
    expect(isExternalLink(currentHost, 'https://example.com/other')).toBe(
      false
    );
  });

  it('returns false for relative link', () => {
    expect(isExternalLink(currentHost, '/internal')).toBe(false);
  });

  it('returns false for mailto link', () => {
    expect(isExternalLink(currentHost, 'mailto:test@example.com')).toBe(false);
  });

  it('returns false for anchor link', () => {
    expect(isExternalLink(currentHost, '#section')).toBe(false);
  });

  it('returns true for subdomain of current host', () => {
    expect(isExternalLink(currentHost, 'https://docs.example.com')).toBe(true);
  });

  it('returns false for current host with port', () => {
    expect(isExternalLink(currentHost, 'https://example.com:3000/page')).toBe(
      false
    );
  });

  it('returns true for protocol-relative external URL', () => {
    expect(isExternalLink(currentHost, '//external.com')).toBe(true);
  });

  it('returns false for protocol-relative current host URL', () => {
    expect(isExternalLink(currentHost, '//example.com/page')).toBe(false);
  });

  it('returns false for URL containing host in query', () => {
    expect(
      isExternalLink(currentHost, 'https://external.com/?redirect=example.com')
    ).toBe(true);
    expect(
      isExternalLink(currentHost, 'https://example.com/?redirect=external.com')
    ).toBe(false);
  });

  it('returns false for URL containing host in fragment', () => {
    expect(
      isExternalLink(currentHost, 'https://external.com/#example.com')
    ).toBe(true);
    expect(
      isExternalLink(currentHost, 'https://example.com/#external.com')
    ).toBe(false);
  });
});
