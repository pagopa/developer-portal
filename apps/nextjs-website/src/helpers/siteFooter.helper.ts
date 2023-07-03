import { EIconProps } from '@pagopa/pagopa-editorial-components/dist/components/EIcon';
import {
  FooterLinksType,
  LinkType,
} from '@pagopa/pagopa-editorial-components/dist/components/Footer/types';

export function linkToFooterLinkTypeArray(
  links: readonly {
    readonly ariaLabel: string;
    readonly href: string;
    readonly label: string;
    readonly linkType: string;
  }[]
): readonly FooterLinksType[] {
  return links.map((link) => {
    const linkType: LinkType =
      link.linkType === 'external' ? 'external' : 'internal';
    return {
      ...link,
      linkType,
    };
  });
}

type SocialIcon = 'LinkedIn' | 'Twitter' | 'Instagram' | undefined;

export function linkToIconProps(
  links: readonly {
    readonly ariaLabel: string;
    readonly href: string;
    readonly icon: string;
  }[]
): readonly EIconProps[] {
  return links.map((link) => {
    return {
      'aria-label': link.ariaLabel,
      href: link.href,
      icon: link.icon as SocialIcon,
    };
  });
}
