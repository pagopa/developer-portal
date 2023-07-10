// TODO: move to proper localization system
import { ioSignTutorialListsPath } from '@/_contents/ioSign/tutorialListsPath';
import { sendGuideListsPath } from '@/_contents/send/guideListsPath';

export const translations = {
  header: {
    title: 'PagoPA',
    boldTitle: 'DevPortal',
    products: 'Prodotti',
  },
  breadcrumbs: {
    title: 'DevPortal',
  },
  shared: {
    coomingSoon: 'In Arrivo',
    readTutorial: 'Leggi il tutorial',
    moreInfo: 'Scopri di più',
    goToModel: 'Vai al modello',
    version: 'Versione',
  },
  pageNotFound: {
    overline: '404',
    title: 'Pagina non trovata',
    description: 'La pagina che stai cercando non esiste',
  },
  homepage: {
    news: {
      title: 'In evidenza',
      list: [
        {
          title:
            'Usa il validatore di SEND per fare una verifica sull’integrazione',
          dateString: '2023-06-29T22:15:53.780Z',
          href: {
            label: 'Vai al validatore',
            link: `${sendGuideListsPath.path}/validatore/v1.0`,
            title: 'Vai al validatore',
          },
          image: {
            url: '/images/homepage-validatore.png',
            alt: 'Immagine: Usa il validatore di SEND per fare una verifica sull’integrazione',
          },
        },
        {
          title: 'Scopri i nuovi tutorial di Firma con IO',
          dateString: '2023-06-29T22:15:53.780Z',
          href: {
            label: 'Vai ai tutorial',
            link: `${ioSignTutorialListsPath.path}`,
            title: 'Vai ai tutorial',
          },
          image: {
            url: '/images/homepage-io-sign.png',
            alt: 'Immagine: Scopri i nuovi tutorial di Firma con IO',
          },
        },
        {
          title:
            'Scopri la Quick Start di piattaforma pagoPA: l’integrazione in 6 step',
          dateString: '2023-06-29T22:15:53.780Z',
          href: {
            label: 'Vai alla guida',
            link: '#news-3',
            title: 'Vai alla guida',
          },
          coomingSoon: true,
          image: {
            url: '/images/homepage-pago-pa.png',
            alt: 'Immagine: Scopri la Quick Start di piattaforma pagoPA: l’integrazione in 6 step',
          },
        },
      ],
    },
    productsShowcaseTitle: 'Scopri il nostro ecosistema',
    heroItems: [
      {
        title: 'Tutto ciò che serve per integrarsi con i prodotti PagoPA',
      },
      {
        title: 'Invia comunicazioni a valore legale con piattaforma notifiche',
        cta: {
          label: 'Vai a SEND',
          href: '/send/overview',
        },
      },
      {
        title: 'Richiedi una firma su documenti e contratti',
        cta: {
          label: 'Vai a Firma con IO',
          href: '/io-sign/overview',
        },
      },
    ],
    comingsoonDocumentation: {
      title: 'Documentazione in arrivo',
      links: [
        {
          text: 'Interoperabilità. Scambia informazioni con altri enti in tutta sicurezza.',
          href: 'https://www.interop.pagopa.it/',
        },
        {
          text: 'Check IBAN. Utilizza un sistema per la gestione degli incassi centralizzato e immediato.',
          href: 'https://www.pagopa.it/it/prodotti-e-servizi/check-iban/',
        },
      ],
    },
  },
  overview: {
    startInfo: {
      title: 'Si comincia da qui',
    },
    tutorial: {
      title: 'Esplora i tutorial',
      ctaLabel: 'Vedi tutti i tutorial',
    },
    postIntegration: {
      title: "Dopo l'integrazione",
    },
    relatedLinks: {
      title: 'LINK UTILI',
    },
  },
  footer: {
    companyLink: {
      ariaLabel: 'Link: vai al sito di PagoPA S.p.A.',
      href: 'https://www.pagopa.it/',
    },
    languages: [
      {
        id: 'it',
        value: 'Italiano',
      },
    ],
    legalInfo:
      '<strong>PagoPA S.p.A.</strong> - Società per azioni con socio unico - Capitale sociale di euro 1,000,000 interamente versato - Sede legale in Roma, Piazza Colonna 370, <br />CAP 00187 - N. di iscrizione a Registro Imprese di Roma, CF e P.IVA 15376371009',
    links: {
      followUs: {
        socialLinks: [
          {
            ariaLabel: 'Link: vai al sito LinkedIn di PagoPA S.p.A.',
            href: 'https://www.linkedin.com/company/pagopa/',
            icon: 'LinkedIn',
          },
          {
            ariaLabel: 'Link: vai al sito Twitter di PagoPA S.p.A.',
            href: 'https://twitter.com/pagopa',
            icon: 'Twitter',
          },
          {
            ariaLabel: 'Link: vai al sito Instagram di PagoPA S.p.A.',
            href: 'https://www.instagram.com/pagopaspa/',
            icon: 'Instagram',
          },
        ],
        links: [
          {
            ariaLabel: 'Vai al link: Accessibilità',
            href: 'https://form.agid.gov.it/view/eca3487c-f3cb-40be-a590-212eafc70058/',
            label: 'Accessibilità',
            linkType: 'external',
          },
        ],
        title: 'Seguici su',
      },
      aboutUs: {
        title: '',
        links: [
          {
            ariaLabel: 'Vai al link: Chi siamo',
            href: 'https://www.pagopa.it/it/societa/chi-siamo',
            label: 'Chi siamo',
            linkType: 'external',
          },
          {
            ariaLabel: 'Vai al link: Media',
            href: 'https://www.pagopa.it/it/media',
            label: 'Media',
            linkType: 'external',
          },
          {
            ariaLabel: 'Vai al link: Lavora con noi',
            href: 'https://www.pagopa.it/it/lavora-con-noi',
            label: 'Lavora con noi',
            linkType: 'external',
          },
        ],
      },
      resources: {
        title: 'Risorse',
        links: [
          {
            ariaLabel: 'Vai al link: Informativa Privacy',
            href: '/privacy-policy',
            label: 'Informativa Privacy',
            linkType: 'internal',
          },
          {
            ariaLabel: 'Vai al link: Termini e Condizioni',
            href: '/terms-of-service',
            label: 'Termini e Condizioni',
            linkType: 'internal',
          },
          {
            ariaLabel: 'Vai al link: Società trasparente',
            href: 'https://pagopa.portaleamministrazionetrasparente.it/',
            label: 'Società trasparente',
            linkType: 'external',
          },
          {
            ariaLabel: 'Vai al link: Responsible Disclosure Policy',
            href: 'https://www.pagopa.it/it/responsible-disclosure-policy/',
            label: 'Responsible Disclosure Policy',
            linkType: 'external',
          },
          {
            ariaLabel: 'Vai al link: Modello 321',
            href: 'https://pagopa.portaleamministrazionetrasparente.it/pagina746_altri-contenuti.html',
            label: 'Modello 321',
            linkType: 'external',
          },
        ],
      },
      services: {
        title: 'PRODOTTI E SERVIZI',
        links: [
          {
            ariaLabel: 'Vai al link: App IO',
            href: 'https://www.pagopa.it/it/prodotti-e-servizi/app-io',
            label: 'App IO',
            linkType: 'external',
          },
          {
            ariaLabel: 'Vai al link: Piattaforma pagoPA',
            href: 'https://www.pagopa.it/it/prodotti-e-servizi/piattaforma-pagopa',
            label: 'Piattaforma pagoPA',
            linkType: 'external',
          },
          {
            ariaLabel: 'Vai al link: Centro stella',
            href: 'https://www.pagopa.it/it/prodotti-e-servizi/centro-stella-pagamenti-elettronici',
            label: 'Centro stella',
            linkType: 'external',
          },
          {
            ariaLabel: 'Vai al link: Check IBAN',
            href: 'https://www.pagopa.it/it/prodotti-e-servizi/check-iban',
            label: 'Check IBAN',
            linkType: 'external',
          },
          {
            ariaLabel: 'Vai al link: Piattaforma Notifiche Digitali',
            href: 'https://www.pagopa.it/it/prodotti-e-servizi/piattaforma-notifiche-digitali',
            label: 'Piattaforma Notifiche Digitali',
            linkType: 'external',
          },
          {
            ariaLabel:
              'Vai al link: Piattaforma Digitale Nazionale Dati - Interoperabilità',
            href: 'https://www.pagopa.it/it/prodotti-e-servizi/piattaforma-digitale-nazionale-dati/',
            label: 'Piattaforma Digitale Nazionale Dati - Interoperabilità',
            linkType: 'external',
          },
          {
            ariaLabel: 'Vai al link: Self Care',
            href: '#self-care',
            label: 'Self Care',
            linkType: 'internal',
          },
        ],
      },
    },
  },
};
