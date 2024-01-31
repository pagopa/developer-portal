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
          href: '/firma-con-io/overview',
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
    login: {
      action: 'Accedi',
      loginToYourAccount: 'Accedi al tuo account DevPortal',
      rememberMe: 'Ricordami',
      forgotPassword: 'Hai dimenticato la password?',
      noAccount: 'Non hai un account?',
    },
    confirmLogin: {
      title: 'Verifica la tua identità',
      body: (email: string) =>
        `Abbiamo inviato un codice di verifica a ${email} Il codice scade tra 3 minuti.`,
      code: 'Codice di verifica',
      checkJunkMail:
        'Non hai ricevuto alcuna email? Controlla la posta indesiderata oppure',
      continue: 'Continua',
      resendEmail: 'Reinvia e-mail',
    },
    accountActivated: {
      goToLogin: 'Vai al login',
      welcomeMessage: 'Ti diamo il benvenuto su PagoPA DevPortal.',
      yourAccountIsActive: 'Il tuo account è attivo',
    },
    signUp: {
      action: 'Iscriviti',
      createYourAccount: 'Crea il tuo account',
      confirmComunications:
        "Inviami e-mail relative alle risorse e agli aggiornamenti sui prodotti. Se questa casella è selezionata, PagoPA ti invierà di tanto in tanto delle e-mail utili e pertinenti. Puoi annullare l'iscrizione in qualsiasi momento.",
      acceptPolicy1:
        'Cliccando su iscriviti dichiari di aver preso visione della nostra ',
      acceptPolicy2: 'privacy policy',
      acceptPolicy3: ' e dei nostri ',
      acceptPolicy4: "termini e condizioni d'uso",
      alreadyHaveAnAccount: 'Hai già un account?',
      whyCreateAccount: 'Perché iscriversi a PagoPA DevPortal',
      passwordPolicy:
        'Minimo 8 caratteri, almeno un numero, almeno una lettera maiuscola e almeno un carattere speciale',
      emailSent: (email: string) => `Email inviata a ${email}`,
      advantages: [
        {
          title: 'Accedi a contenuti esclusivi',
          text: 'Assisti ai webinar di PagoPA e interagisci con noi sugli argomenti del momento.',
        },
        {
          title: 'Ricevi aggiornamenti sui nostri prodotti',
          text: "Non perdere neanche un nuovo contenuto, guida o tutorial. Puoi scegliere di ricevere via email le novità sui prodotti PagoPA e sull'integrazione tecnologica. ",
        },
        {
          title: 'Accedi ai tool per velocizzare i tuoi sviluppi (in arrivo)',
          text: 'Sblocca tutto il potenziale del DevPortal con API Key, Mocker, SDK ed altro ancora.',
        },
        {
          title: 'Richiedi assistenza su un canale dedicato (in arrivo)',
          text: 'Avvicinati con facilità alle soluzioni di cui hai bisogno e risolvi le difficoltà con il nostro aiuto.',
        },
      ],
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
    confirmSignUp: {
      confirmSignUp: 'Conferma che sei tu',
      description: (email: string) =>
        `Abbiamo inviato una e-mail a ${email}. Clicca sul bottone contenuto al suo interno per verificarla.`,
      didntReceiveEmail:
        "Non hai ricevuto l'e-mail? Controlla se nella posta indesiderata oppure",
      resendEmail: 'Reinvia e-mail',
      wrongEmail: "L'indirizzo email è errato?",
    },
    resetPassword: {
      title: 'Recupera password',
      body: 'Inserisci il tuo indirizzo e-mail e ti invieremo le istruzioni per impostare una nuova password.',
      goBackToLogin: 'Torna al login',
      send: 'Invia',
      checkEmailTitle: "Controlla l'email",
      checkEmail: (email: string) =>
        `Se esiste un account associato a ${email}, riceverai una e-mail con un link per impostare una nuova password.`,
      resendEmailPrompt:
        "Non hai ricevuto l'email? Controlla nella posta indesiderata oppure",
      resendEmail: 'Reinvia e-mail',
      wrongEmail: "L'indirizzo e-mail è errato?",
      passwordSet: 'Password impostata correttamente',
      newPassword: 'Imposta una nuova password',
      rememberPassword: 'Ricordi la tua password?',
      invalidLinkError: 'Il link non è valido',
    },
  },
};
