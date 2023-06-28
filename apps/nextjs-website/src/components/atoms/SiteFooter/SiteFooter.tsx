import { translations } from '@/_contents/translations';
import { Divider } from '@mui/material';
import { Footer } from '@pagopa/pagopa-editorial-components/dist/components/Footer';
import React, { Fragment } from 'react';

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
    <Fragment>
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
            links: followUs.links.map((link) => ({
              ...link,
              linkType: link.linkType === 'external' ? 'external' : 'internal',
            })),
            socialLinks: [
              {
                'aria-label': 'Link: vai al sito LinkedIn di PagoPA S.p.A.',
                href: 'https://www.linkedin.com/company/pagopa/',
                icon: 'LinkedIn',
              },
              {
                'aria-label': 'Link: vai al sito Twitter di PagoPA S.p.A.',
                href: 'https://twitter.com/pagopa',
                icon: 'Twitter',
              },
              {
                'aria-label': 'Link: vai al sito Instagram di PagoPA S.p.A.',
                href: 'https://www.instagram.com/pagopa/',
                icon: 'Instagram',
              },
            ],
          },
          aboutUs: {
            title: aboutUs.title,
            links: aboutUs.links.map((link) => ({
              ...link,
              linkType: link.linkType === 'external' ? 'external' : 'internal',
            })),
          },
          resources: {
            title: resources.title,
            links: resources.links.map((link) => ({
              ...link,
              linkType: link.linkType === 'external' ? 'external' : 'internal',
            })),
          },
          services: {
            title: services.title,
            links: services.links.map((link) => ({
              ...link,
              linkType: link.linkType === 'external' ? 'external' : 'internal',
            })),
          },
        }}
        showFundedByNextGenerationEULogo={true}
      />
    </Fragment>
  );
};

export default SiteFooter;
