import { IconWrapperProps } from '@/components/atoms/IconWrapper/IconWrapper';

export type LinkType = 'internal' | 'external';
export type FooterColumnIcon = IconWrapperProps & { readonly href: string };

export interface FooterLinksType {
  readonly label: string;
  /** the url to witch the user will be redirected */
  readonly href?: string;
  readonly ariaLabel: string;
  readonly linkType: LinkType;
  /** if defined it will override the href behavior */
  // eslint-disable-next-line functional/no-return-void
  readonly onClick?: () => void;
}

export interface PreLoginFooterSingleSectionType {
  readonly title?: string;
  readonly links: readonly FooterLinksType[];
}

export interface PreLoginFooterLinksType {
  readonly services: PreLoginFooterSingleSectionType;
  readonly aboutUs: PreLoginFooterSingleSectionType;
  readonly resources: PreLoginFooterSingleSectionType;
  readonly followUs: {
    readonly title: string;
    readonly socialLinks: readonly FooterColumnIcon[];
    readonly links: readonly FooterLinksType[];
  };
}

export interface CompanyLinkType {
  /** the url to witch the user will be redirected */
  readonly href?: string;
  readonly ariaLabel: string;
  /** if defined it will override the href behavior */
  // eslint-disable-next-line functional/no-return-void
  readonly onClick?: () => void;
}
