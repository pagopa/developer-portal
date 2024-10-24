// TODO: move to proper localization system
import { ioSignTutorialListsPath } from '@/_contents/ioSign/tutorialListsPath';
import { sendGuideListsPath } from '@/_contents/send/guideListsPath';
import { pagoPaQuickStartGuidePath } from '@/_contents/pagoPa/quickStartGuidePath';
import { send } from '@/_contents/send/send';
import { appIo } from '@/_contents/appIo/appIo';
import { ioSign } from '@/_contents/ioSign/ioSign';
import { pagoPa } from '@/_contents/pagoPa/pagoPa';
import { Product } from '@/lib/types/product';

const productToEcosystemProduct = (product: Product) => ({
  title: product.name,
  text: product.description ?? '',
  href: `${product.slug}/overview`,
  icon: product.logo.url,
  useSrc: true,
});

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
    comingSoon: 'In Arrivo',
    readTutorial: 'Leggi il tutorial',
    moreInfo: 'Scopri di più',
    goToModel: 'Vai al modello',
    version: 'Versione',
    copiedTooltip: 'Copiato',
    siteTitle: 'PagoPA DevPortal',
    emailAddress: 'Indirizzo email',
    password: 'Password',
    goBack: 'Torna indietro',
    requiredFields: '* Campi obbligatori',
    firstName: 'Nome',
    lastName: 'Cognome',
    confirmPassword: 'Conferma password',
    company: 'Tipologia Ente o Azienda',
    role: 'Ruolo',
    requiredFieldError: 'Questo campo non può essere vuoto',
    emailFieldError: 'Inserisci un indirizzo email valido',
  },
  pageNotFound: {
    overline: '404',
    title: 'Pagina non trovata',
    description: 'La pagina che stai cercando non esiste',
  },
  productGuidePage: {
    onThisPage: 'In questa pagina',
  },
  homepage: {
    newsShowcase: {
      title: 'In evidenza',
      items: [
        {
          comingSoon: false,
          title:
            'Usa il validatore di SEND per fare una verifica sull’integrazione',
          link: {
            url: `${sendGuideListsPath.path}/validatore`,
            text: 'Vai al validatore',
          },
          image: {
            name: 'homepage-validatore.png',
            caption: undefined,
            size: 10,
            alternativeText:
              'Immagine: Usa il validatore di SEND per fare una verifica sull’integrazione',
            width: 1156,
            height: 580,
            ext: '.svg',
            mime: 'image/svg+xml',
            url: '/images/homepage-validatore.png',
          },
        },
        {
          comingSoon: false,
          title: 'Scopri i nuovi tutorial di Firma con IO',
          link: {
            url: `${ioSignTutorialListsPath.path}`,
            text: 'Vai ai tutorial',
          },
          image: {
            name: 'homepage-io-sign.png',
            caption: undefined,
            size: 10,
            alternativeText:
              'Immagine: Scopri i nuovi tutorial di Firma con IO',
            width: 1156,
            height: 580,
            ext: '.svg',
            mime: 'image/svg+xml',
            url: '/images/homepage-io-sign.png',
          },
        },
        {
          comingSoon: false,
          title:
            'Scopri la Quick Start di piattaforma pagoPA: l’integrazione in pochi semplici step',
          link: {
            url: `${pagoPaQuickStartGuidePath.path}`,
            text: 'Vai alla guida',
          },
          image: {
            name: 'homepage-pago-pa.png',
            caption: undefined,
            size: 10,
            alternativeText:
              'Immagine: Scopri la Quick Start di piattaforma pagoPA: l’integrazione in pochi semplici step',
            width: 1156,
            height: 580,
            ext: '.svg',
            mime: 'image/svg+xml',
            url: '/images/homepage-pago-pa.png',
          },
        },
      ],
    },
    webinarBannerButtonContent: 'Scopri',
    ecosystem: {
      title: 'Scopri il nostro ecosistema',
      productsTabName: 'Per prodotti',
      products: [
        productToEcosystemProduct(appIo),
        productToEcosystemProduct(ioSign),
        productToEcosystemProduct(pagoPa),
        productToEcosystemProduct(send),
      ],
      solutionsTabName: 'Per soluzioni',
      solutions: [],
    },
    heroItems: [
      {
        title: 'Tutto ciò che serve per integrarsi con i prodotti PagoPA',
      },
      {
        title: 'Invia comunicazioni a valore legale con piattaforma notifiche',
        callToAction: {
          link: {
            text: 'Vai a SEND',
            href: '/send/overview',
          },
        },
      },
      {
        title: 'Richiedi una firma su documenti e contratti',
        callToAction: {
          link: {
            text: 'Vai a Firma con IO',
            href: '/firma-con-io/overview',
          },
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
  quickStartGuide: {
    content: {
      apiPhases: {
        request: {
          cta: {
            label: 'Invia la richiesta',
          },
          title: 'Chiamata API',
        },
        response: {
          cta: {
            icon: 'Replay',
            label: 'Ripristina la chiamata',
          },
          title: 'Risposta del server',
        },
      },
      next: 'Prossimo contenuto',
      previous: 'Contenuto precedente',
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
            ariaLabel: 'Vai al link: PNRR',
            href: 'https://www.pagopa.it/it/opportunita/pnrr/progetti/',
            label: 'PNRR',
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
            ariaLabel: 'Vai al link: Modello 231',
            href: 'https://pagopa.portaleamministrazionetrasparente.it/pagina746_altri-contenuti.html',
            label: 'Modello 231',
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
            ariaLabel: 'Vai al link: SEND - Servizio Notifiche Digitali',
            href: 'https://www.pagopa.it/it/prodotti-e-servizi/send-notifiche-digitali/',
            label: 'SEND - Servizio Notifiche Digitali',
            linkType: 'external',
          },
          {
            ariaLabel:
              'Vai al link: Piattaforma Digitale Nazionale Dati - Interoperabilità',
            href: 'https://www.pagopa.it/it/prodotti-e-servizi/piattaforma-digitale-nazionale-dati/',
            label: 'Piattaforma Digitale Nazionale Dati - Interoperabilità',
            linkType: 'external',
          },
        ],
      },
      cookiePreferences: {
        ariaLabel: 'Preferenza Cookie',
        label: 'Preferenza Cookie',
      },
    },
  },
  auth: {
    signUp: {
      companyRoles: [
        { title: 'Ente pubblico', value: 'public-authority' },
        { title: 'Partner tecnologico', value: 'tech-partner' },
        { title: 'PSP', value: 'psp' },
        {
          title: 'Gestore di pubblico servizio',
          value: 'operator-of-public-service',
        },
        { title: 'Azienda privata', value: 'private-company' },
        { title: 'Altro', value: 'other' },
      ],
    },
  },
};
