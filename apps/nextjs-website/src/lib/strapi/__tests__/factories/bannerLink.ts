import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { mediaJpeg } from '@/lib/strapi/__tests__/factories/media';
import { strapiBannerLink } from '../fixtures/bannerLink';

const defaultBannerLink = {
  id: 1,
  content: undefined,
  icon: mediaJpeg(),
  theme: 'light',
  title: 'Default Banner Link',
} satisfies StrapiBannerLink;

export function bannerLink() {
  return defaultBannerLink;
}

export function generateBannerLinks(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    ...defaultBannerLink,
    id: index + 1,
    title: `Banner Link ${index + 1}`,
  }));
}

export function minimalBannerLink(): StrapiBannerLink {
  return {
    id: 1,
    title: undefined,
    content: undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme: undefined as any,
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
  };
}

export function bannerLinkWithDarkTheme(): StrapiBannerLink {
  return {
    ...strapiBannerLink,
    title: 'Dark Theme Banner',
    theme: 'dark',
  };
}

export function bannerLinkWithUndefinedContent(): StrapiBannerLink {
  return {
    ...strapiBannerLink,
    title: 'Null Content Banner',
    content: undefined,
  };
}

export function bannerLinkWithEmptyTitle(): StrapiBannerLink {
  return {
    ...strapiBannerLink,
    title: '',
    content: undefined,
  };
}

export function bannerLinkWithUndefinedTitle(): StrapiBannerLink {
  return {
    ...strapiBannerLink,
    title: undefined,
    content: undefined,
  };
}
