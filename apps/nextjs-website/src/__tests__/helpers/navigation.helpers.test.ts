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
});
