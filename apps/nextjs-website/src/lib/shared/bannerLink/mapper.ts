import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { StrapiBannerLink } from './types';

export function mapBannerLinkProps(
  strapiBannerLink: StrapiBannerLink
): BannerLinkProps {
  return {
    content: strapiBannerLink.content || undefined,
    icon: strapiBannerLink.icon,
    theme: strapiBannerLink.theme || 'dark',
    title: strapiBannerLink.title || '',
  };
}
