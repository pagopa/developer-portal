import { BannerLinkData } from '@/components/atoms/BannerLink/BannerLink';
import { StrapiBannerLink } from '../types/bannerLink';

export function makeBannerLink(
  strapiBannerLink: StrapiBannerLink
): BannerLinkData {
  return {
    content: strapiBannerLink.content || undefined,
    icon: strapiBannerLink.icon.data.attributes,
    theme: strapiBannerLink.theme || 'dark',
    title: strapiBannerLink.title || '',
  };
}
