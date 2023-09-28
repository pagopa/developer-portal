import {
  linkToFooterLinkTypeArray,
  linkToIconProps,
} from '../../helpers/siteFooter.helper';
import { LinkType } from '@/editorialComponents/Footer/types';

const links = [
  {
    ariaLabel: 'external',
    href: 'external',
    label: 'external',
    linkType: 'external',
  },
  {
    ariaLabel: 'internal',
    href: 'internal',
    label: 'internal',
    linkType: 'internal',
  },
];

it('should convert link to FooterLinkType array', () => {
  const footerLinkTypes = linkToFooterLinkTypeArray(links);
  expect(footerLinkTypes.length).toEqual(2);
  const externalType: LinkType = 'external';
  expect(footerLinkTypes[0].linkType).toBe(externalType);
  const internalType: LinkType = 'internal';
  expect(footerLinkTypes[1].linkType).toBe(internalType);
});

const socialLinks = [
  {
    ariaLabel: 'LinkedIn',
    href: 'LinkedIn',
    icon: 'LinkedIn',
  },
];

it('should convert link to IconProps array', () => {
  const iconProps = linkToIconProps(socialLinks);
  expect(iconProps.length).toEqual(1);
  expect(iconProps[0]['aria-label']).toBeDefined();
  expect(iconProps[0].icon).toBeDefined();
  expect(socialLinks[0].icon).toBe(iconProps[0].icon?.toString());
});
