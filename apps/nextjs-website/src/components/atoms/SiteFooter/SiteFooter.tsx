'use client';
import { translations } from '@/_contents/translations';
import {
  linkToFooterLinkTypeArray,
  linkToIconProps,
} from '@/helpers/siteFooter.helper';
import { Divider } from '@mui/material';
import { Footer } from '@/editorialComponents/Footer';
import React from 'react';
import { isProduction } from '@/config';
import { FooterLinksType } from '@/editorialComponents/Footer/types';

type SiteFooterProps = {
  readonly activeLanguage?: { id: string; value: string };
  onLanguageChange?: () => null;
};

const SiteFooter = ({
  activeLanguage = {
    id: 'it',
    value: 'Italiano',
  },
  onLanguageChange = () => null,
}: SiteFooterProps) => {
  const { footer } = translations;
  const { followUs, aboutUs, resources, services } = footer.links;
  const cookiePreferenceLink: FooterLinksType = {
    label: footer.links.cookiePreferences.label,
    ariaLabel: footer.links.cookiePreferences.ariaLabel,
    linkType: 'internal',
    href: '#',
    onClick: () => {
      // @ts-expect-error: The system assumes OneTrust is loaded
      window?.OneTrust?.ToggleInfoDisplay();
    },
  };
  const resourcesLinks = [
    ...linkToFooterLinkTypeArray(resources.links),
    ...(isProduction ? [cookiePreferenceLink] : []),
  ];

  return (
    <>
      <Divider />
      <Footer
        onLanguageChanged={onLanguageChange}
        activeLanguage={activeLanguage}
        languages={footer.languages}
        companyLink={footer.companyLink}
        legalInfo={
          <div dangerouslySetInnerHTML={{ __html: footer.legalInfo }} />
        }
        links={{
          followUs: {
            title: followUs.title,
            links: [...linkToFooterLinkTypeArray(followUs.links)],
            socialLinks: [...linkToIconProps(followUs.socialLinks)],
          },
          aboutUs: {
            title: aboutUs.title,
            links: [...linkToFooterLinkTypeArray(aboutUs.links)],
          },
          resources: {
            title: resources.title,
            links: resourcesLinks,
          },
          services: {
            title: services.title,
            links: [...linkToFooterLinkTypeArray(services.links)],
          },
        }}
        showFundedByNextGenerationEULogo={true}
      />
    </>
  );
};

export default SiteFooter;
