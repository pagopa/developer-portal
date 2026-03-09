'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Divider } from '@mui/material';
import { Footer } from '@/editorialComponents/Footer';
import { isProduction } from '@/config';
import type {
  FooterLinksType,
  PreLoginFooterLinksType,
} from '@/editorialComponents/Footer/types';
import { useParams } from 'next/navigation';

const SiteFooter = () => {
  const locale = useParams<{ locale: string }>().locale;
  const t = useTranslations('footer');

  const links: PreLoginFooterLinksType = {
    followUs: {
      title: t('followUs.title'),
      socialLinks: [
        {
          href: t('followUs.socialLinks.linkedin.href'),
          icon: 'LinkedIn',
          useSrc: false,
        },
        {
          href: t('followUs.socialLinks.twitter.href'),
          icon: 'Twitter',
          useSrc: false,
        },
        {
          href: t('followUs.socialLinks.instagram.href'),
          icon: 'Instagram',
          useSrc: false,
        },
        {
          href: t('followUs.socialLinks.medium.href'),
          icon: 'Medium',
          useSrc: false,
        },
      ],
      links: [
        {
          ariaLabel: t('followUs.links.accessibility.ariaLabel'),
          href: t('followUs.links.accessibility.href'),
          label: t('followUs.links.accessibility.label'),
          linkType: 'external',
        },
      ],
    },
    aboutUs: {
      title: t('aboutUs.title'),
      links: [
        {
          ariaLabel: t('aboutUs.links.whoWeAre.ariaLabel'),
          href: t('aboutUs.links.whoWeAre.href'),
          label: t('aboutUs.links.whoWeAre.label'),
          linkType: 'external',
        },
        {
          ariaLabel: t('aboutUs.links.pnrr.ariaLabel'),
          href: t('aboutUs.links.pnrr.href'),
          label: t('aboutUs.links.pnrr.label'),
          linkType: 'external',
        },
        {
          ariaLabel: t('aboutUs.links.media.ariaLabel'),
          href: t('aboutUs.links.media.href'),
          label: t('aboutUs.links.media.label'),
          linkType: 'external',
        },
        {
          ariaLabel: t('aboutUs.links.workWithUs.ariaLabel'),
          href: t('aboutUs.links.workWithUs.href'),
          label: t('aboutUs.links.workWithUs.label'),
          linkType: 'external',
        },
      ],
    },
    resources: {
      title: t('resources.title'),
      links: [
        {
          ariaLabel: t('resources.links.privacyPolicy.ariaLabel'),
          href: `/${locale}/privacy-policy`,
          label: t('resources.links.privacyPolicy.label'),
          linkType: 'internal',
        },
        {
          ariaLabel: t('resources.links.termsOfService.ariaLabel'),
          href: `/${locale}/terms-of-service`,
          label: t('resources.links.termsOfService.label'),
          linkType: 'internal',
        },
        {
          ariaLabel: t('resources.links.societaTrasparente.ariaLabel'),
          href: t('resources.links.societaTrasparente.href'),
          label: t('resources.links.societaTrasparente.label'),
          linkType: 'external',
        },
        {
          ariaLabel: t('resources.links.disclosurePolicy.ariaLabel'),
          href: t('resources.links.disclosurePolicy.href'),
          label: t('resources.links.disclosurePolicy.label'),
          linkType: 'external',
        },
        {
          ariaLabel: t('resources.links.model231.ariaLabel'),
          href: t('resources.links.model231.href'),
          label: t('resources.links.model231.label'),
          linkType: 'external',
        },
      ],
    },
    services: {
      title: t('services.title'),
      links: [
        {
          ariaLabel: t('services.links.appIO.ariaLabel'),
          href: t('services.links.appIO.href'),
          label: t('services.links.appIO.label'),
          linkType: 'external',
        },
        {
          ariaLabel: t('services.links.pagoPA.ariaLabel'),
          href: t('services.links.pagoPA.href'),
          label: t('services.links.pagoPA.label'),
          linkType: 'external',
        },
        {
          ariaLabel: t('services.links.pari.ariaLabel'),
          href: t('services.links.pari.href'),
          label: t('services.links.pari.label'),
          linkType: 'external',
        },
        {
          ariaLabel: t('services.links.checkIBAN.ariaLabel'),
          href: t('services.links.checkIBAN.href'),
          label: t('services.links.checkIBAN.label'),
          linkType: 'external',
        },
        {
          ariaLabel: t('services.links.send.ariaLabel'),
          href: t('services.links.send.href'),
          label: t('services.links.send.label'),
          linkType: 'external',
        },
        {
          ariaLabel: t('services.links.pdnd.ariaLabel'),
          href: t('services.links.pdnd.href'),
          label: t('services.links.pdnd.label'),
          linkType: 'external',
        },
      ],
    },
  };

  const companyLink = {
    ariaLabel: t('companyLink.ariaLabel'),
    href: t('companyLink.href'),
  };

  const legalInfo = t.rich('legalInfo', {
    strong: (chunks) => <strong>{chunks}</strong>,
    br: () => <br></br>,
  }) as string;

  const cookiePreferenceLink: FooterLinksType = {
    label: t('cookiePreferences.label'),
    ariaLabel: t('cookiePreferences.ariaLabel'),
    linkType: 'internal',
    href: '#',
    onClick: () => {
      // @ts-expect-error: The system assumes OneTrust is loaded
      window?.OneTrust?.ToggleInfoDisplay();
    },
  };

  const { resources, ...rest } = links;
  const resourcesLinks = [
    ...resources.links,
    ...(isProduction ? [cookiePreferenceLink] : []),
  ];

  const footerLinks = {
    ...rest,
    resources: {
      ...resources,
      links: resourcesLinks,
    },
  };

  return (
    <>
      <Divider />
      <Footer
        companyLink={companyLink}
        legalInfo={legalInfo}
        links={footerLinks}
        showFundedByNextGenerationEULogo={true}
      />
    </>
  );
};

export default SiteFooter;
