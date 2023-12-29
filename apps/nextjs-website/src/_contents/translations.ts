// TODO: move to proper localization system
import { ioSignTutorialListsPath } from '@/_contents/ioSign/tutorialListsPath';
import { sendGuideListsPath } from '@/_contents/send/guideListsPath';
import { pagoPaQuickStartGuidePath } from '@/_contents/pagoPa/quickStartGuidePath';

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
    news: {
      title: 'In evidenza',
      list: [
        {
          title:
            'Usa il validatore di SEND per fare una verifica sull’integrazione',
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
          href: {
            label: 'Vai alla guida',
            link: `${pagoPaQuickStartGuidePath.path}`,
            title: 'Vai alla guida',
          },
          image: {
            url: '/images/homepage-pago-pa.png',
            alt: 'Immagine: Scopri la Quick Start di piattaforma pagoPA: l’integrazione in 6 step',
          },
        },
      ],
    },
    webinarBannerButtonContent: 'Scopri',
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
};
