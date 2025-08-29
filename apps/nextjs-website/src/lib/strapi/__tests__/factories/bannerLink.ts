import { StrapiBannerLink } from '@/lib/strapi/types/bannerLink';
import { mediaJpeg } from '@/lib/strapi/__tests__/factories/media';

const defaultBannerLink = {
  id: 1,
  content: undefined,
  icon: { data: mediaJpeg() },
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
