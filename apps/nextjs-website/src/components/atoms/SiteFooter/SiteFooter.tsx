import { translations } from '@/_contents/translations';
import { LangCode } from '@pagopa/mui-italia';
import { Footer } from '@pagopa/pagopa-editorial-components/dist/components/Footer/Footer';
import React from 'react';

type SiteFooterProps = {
  readonly currentLangCode?: string;
  onLanguageChange?: (code: LangCode) => null;
};

const SiteFooter = ({
  currentLangCode = 'it',
  onLanguageChange = () => null,
}: SiteFooterProps) => {
  const { footer } = translations;
  const { followUs, aboutUs, resources } = footer.links;

  return (
    <Footer
      onLanguageChanged={onLanguageChange}
      currentLangCode={currentLangCode as LangCode}
      languages={footer.languages}
      companyLink={footer.companyLink}
      legalInfo={<div dangerouslySetInnerHTML={{ __html: footer.legalInfo }} />}
      links={{
        followUs: {
          title: followUs.title,
          links: followUs.links.map((link) => ({
            ...link,
            linkType: link.linkType === 'external' ? 'external' : 'internal',
          })),
          socialLinks: followUs.socialLinks,
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
      }}
      showFundedByNextGenerationEULogo={true}
    />
  );
};

export default SiteFooter;
