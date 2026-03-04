import { isExternalLink } from '@/helpers/navigation.helpers';

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
