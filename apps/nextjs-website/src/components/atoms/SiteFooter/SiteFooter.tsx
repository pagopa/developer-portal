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
          href: 'https://www.linkedin.com/company/pagopa/',
          icon: 'LinkedIn',
          useSrc: false,
        },
        {
          href: 'https://twitter.com/pagopa',
          icon: 'Twitter',
          useSrc: false,
        },
        {
          href: 'https://www.instagram.com/pagopaspa/',
          icon: 'Instagram',
          useSrc: false,
        },
        {
          href: 'https://medium.com/pagopa-spa',
          icon: 'Medium',
          useSrc: false,
        },
      ],
      links: [
        {
          ariaLabel: t('followUs.links.accessibility.ariaLabel'),
          href: 'https://form.agid.gov.it/view/5de36b80-97b7-11f0-b1d3-cb68959f3505',
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
          href: 'https://www.pagopa.it/it/societa/chi-siamo',
          label: t('aboutUs.links.whoWeAre.label'),
          linkType: 'external',
        },
        {
          ariaLabel: t('aboutUs.links.pnrr.ariaLabel'),
          href: 'https://www.pagopa.it/it/opportunita/pnrr/progetti/',
          label: t('aboutUs.links.pnrr.label'),
          linkType: 'external',
        },
        {
          ariaLabel: t('aboutUs.links.media.ariaLabel'),
          href: 'https://www.pagopa.it/it/media',
          label: t('aboutUs.links.media.label'),
          linkType: 'external',
        },
        {
          ariaLabel: t('aboutUs.links.workWithUs.ariaLabel'),
          href: 'https://www.pagopa.it/it/lavora-con-noi',
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
          href: 'https://pagopa.portaleamministrazionetrasparente.it/',
          label: t('resources.links.societaTrasparente.label'),
          linkType: 'external',
        },
        {
          ariaLabel: t('resources.links.disclosurePolicy.ariaLabel'),
          href: 'https://www.pagopa.it/it/responsible-disclosure-policy/',
          label: t('resources.links.disclosurePolicy.label'),
          linkType: 'external',
        },
        {
          ariaLabel: t('resources.links.model231.ariaLabel'),
          href: 'https://pagopa.portaleamministrazionetrasparente.it/pagina746_altri-contenuti.html',
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
          href: 'https://www.pagopa.it/it/prodotti-e-servizi/app-io',
          label: t('services.links.appIO.label'),
          linkType: 'external',
        },
        {
          ariaLabel: t('services.links.pagoPA.ariaLabel'),
          href: 'https://www.pagopa.it/it/prodotti-e-servizi/piattaforma-pagopa',
          label: t('services.links.pagoPA.label'),
          linkType: 'external',
        },
        {
          ariaLabel: t('services.links.pari.ariaLabel'),
          href: 'https://www.pagopa.it/prodotti-e-servizi/pari/',
          label: t('services.links.pari.label'),
          linkType: 'external',
        },
        {
          ariaLabel: t('services.links.checkIBAN.ariaLabel'),
          href: 'https://www.pagopa.it/it/prodotti-e-servizi/check-iban',
          label: t('services.links.checkIBAN.label'),
          linkType: 'external',
        },
        {
          ariaLabel: t('services.links.send.ariaLabel'),
          href: 'https://www.pagopa.it/it/prodotti-e-servizi/send-notifiche-digitali/',
          label: t('services.links.send.label'),
          linkType: 'external',
        },
        {
          ariaLabel: t('services.links.pdnd.ariaLabel'),
          href: 'https://www.pagopa.it/it/prodotti-e-servizi/piattaforma-digitale-nazionale-dati/',
          label: t('services.links.pdnd.label'),
          linkType: 'external',
        },
      ],
    },
  };

  const companyLink = {
    ariaLabel: t('companyLink.ariaLabel'),
    href: 'https://www.pagopa.it/',
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
