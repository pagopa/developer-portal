import { translations } from '@/_contents/translations';
import {
  linkToFooterLinkTypeArray,
  linkToIconProps,
} from '@/helpers/siteFooter.helper';
import { Divider } from '@mui/material';
import { Footer } from '@pagopa/pagopa-editorial-components/dist/components/Footer';
import React from 'react';

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
            links: [...linkToFooterLinkTypeArray(resources.links)],
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
