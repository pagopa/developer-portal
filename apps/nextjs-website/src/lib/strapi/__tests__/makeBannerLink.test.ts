import { makeBannerLinkProps } from '@/lib/strapi/makeProps/makeBannerLink';
import {
  strapiBannerLink,
  expectedBannerLinkProps,
} from '@/lib/strapi/__tests__/fixtures/bannerLink';
import {
  minimalBannerLink,
  bannerLinkWithDarkTheme,
  bannerLinkWithUndefinedContent,
  bannerLinkWithEmptyTitle,
  bannerLinkWithUndefinedTitle,
} from '@/lib/strapi/__tests__/factories/bannerLink';
import _ from 'lodash';

describe('makeBannerLinkProps', () => {
  it('should transform strapi banner link to banner link props', () => {
    const result = makeBannerLinkProps(_.cloneDeep(strapiBannerLink));
    expect(result).toEqual(expectedBannerLinkProps);
  });

  it('should handle minimal data with undefined optional fields', () => {
    const result = makeBannerLinkProps(minimalBannerLink());
    expect(result).toEqual({
      title: '',
      content: undefined,
      theme: 'dark',
      icon: {
        name: 'minimal-icon.svg',
        alternativeText: 'Minimal Icon',
        caption: undefined,
        width: 24,
        height: 24,
        ext: '.svg',
        mime: 'image/svg+xml',
        size: 0.5,
        url: 'https://example.com/minimal-icon.svg',
      },
    });
  });

  it('should correctly set dark theme', () => {
    const result = makeBannerLinkProps(bannerLinkWithDarkTheme());
    expect(result.theme).toBe('dark');
    expect(result.title).toBe('Dark Theme Banner');
  });

  it('should handle undefined content', () => {
    const result = makeBannerLinkProps(bannerLinkWithUndefinedContent());
    expect(result.content).toBeUndefined();
    expect(result.title).toBe('Null Content Banner');
  });

  it('should handle empty title string', () => {
    const result = makeBannerLinkProps(bannerLinkWithEmptyTitle());
    expect(result.title).toBe('');
  });

  it('should handle undefined title', () => {
    const result = makeBannerLinkProps(bannerLinkWithUndefinedTitle());
    expect(result.title).toBe('');
    expect(result.content).toBeUndefined();
  });

  it('should default to dark theme when theme is undefined', () => {
    const result = makeBannerLinkProps(minimalBannerLink());
    expect(result.theme).toBe('dark');
  });

  it('should correctly map icon attributes', () => {
    const result = makeBannerLinkProps(strapiBannerLink);
    expect(result.icon).toEqual({
      name: 'example.jpg',
      alternativeText: 'Example Image',
      caption: undefined,
      width: 800,
      height: 600,
      ext: '.jpg',
      mime: 'image/jpeg',
      size: 123456,
      url: 'https://example.com/example.jpg',
    });
  });

  it('should handle light theme correctly', () => {
    const result = makeBannerLinkProps(strapiBannerLink);
    expect(result.theme).toBe('light');
  });

  it('should preserve all icon properties', () => {
    const customBannerLink = {
      ...strapiBannerLink,
      icon: {
        name: 'custom-icon.png',
        alternativeText: 'Custom Icon',
        caption: 'Icon caption',
        width: 256,
        height: 256,
        ext: '.png',
        mime: 'image/png',
        size: 64,
        url: 'https://example.com/custom-icon.png',
      },
    };

    const result = makeBannerLinkProps(customBannerLink);
    expect(result.icon).toEqual({
      name: 'custom-icon.png',
      alternativeText: 'Custom Icon',
      caption: 'Icon caption',
      width: 256,
      height: 256,
      ext: '.png',
      mime: 'image/png',
      size: 64,
      url: 'https://example.com/custom-icon.png',
    });
  });
});
