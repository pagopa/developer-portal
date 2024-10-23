import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { StrapiBannerLink } from '@/lib/strapi/codecs/BannerLinkCodec';

export function makeBannerLinkProps(
  strapiBannerLink: StrapiBannerLink
): BannerLinkProps {
  return {
    content: strapiBannerLink.content,
    icon: strapiBannerLink.icon.data.attributes,
    theme: strapiBannerLink.theme || 'dark',
    title: strapiBannerLink.title || '',
  };
}
