import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { BannerLink } from '@/lib/strapi/codecs/BannerLinkCodec';

export function makeBannerLinkProps(
  strapiBannerLink: BannerLink
): BannerLinkProps {
  return {
    content: strapiBannerLink.content,
    icon: strapiBannerLink.icon.data.attributes,
    theme: strapiBannerLink.theme || 'dark',
    title: strapiBannerLink.title || '',
  };
}
