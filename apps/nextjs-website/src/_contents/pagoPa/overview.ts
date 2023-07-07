import { OverviewData } from '@/lib/types/overviewData';
import { pagoPa } from '@/_contents/pagoPa/pagoPa';
import { pagoPaOverviewPath } from '@/_contents/pagoPa/overviewPath';
import { pagoPaTutorials } from '@/_contents/pagoPa/tutorialLists';
import { pagoPaGuideListsPath } from '@/_contents/pagoPa/guideListsPath';

export const pagoPaOverview: OverviewData = {
  ...pagoPaOverviewPath,
  product: pagoPa,
  hero: {
    altText: 'Hero: La piattaforma per gestire e rendicontare i pagamenti',
    backgroundImage: '/images/hero.jpg',
    title: 'La piattaforma per gestire e rendicontare i pagamenti',
    subtitle:
      'pagoPA permette agli Enti Creditori di gestire gli incassi in modo centralizzato, offrendo servizi automatici di rendicontazione e riconciliazione con un significativo risparmio nei costi di gestione.',
  },
  feature: {
    title: 'Perché usare pagoPA',
    subtitle:
      'Che tu sia un ente pubblico, privato, centrale o locale, tramite pagoPA potrai:',
    items: [
      {
        iconName: 'AccountBalance',
        subtitle:
          'Un unico accordo quadro che abilita EC e PSP a operare e definisce gli standard di comunicazione, senza la necessità di stipulare accordi multipli',
        title: 'Un unico accordo per Enti Creditori e PSP',
      },
      {
        iconName: 'Payment',
        subtitle:
          'Una gestione centralizzata degli incassi per gli Enti Creditori, tramite servizi automatici di rendicontazione e riconciliazione',
        title: 'Un modo semplice per gestire i pagamenti',
      },
      {
        iconName: 'PeopleAlt',
        subtitle:
          "Accesso diretto al settore dei pagamenti per i servizi pubblici e possibilità di promuovere la tua offerta multicanale da un'unica piattaforma",
        title: 'Milioni di cittadini e imprese raggiunti',
      },
      {
        iconName: 'TrendingUp',
        subtitle:
          'Esiti immediati e riduzione di tempi e costi sviluppo IT per gli Enti Creditori. Risparmio e accesso ad un più regolato mercato dei pagamenti per i PSP',
        title: 'Più efficienza su tempi  e costi',
      },
    ],
  },
  startCards: [
    {
      title: 'Quick Start',
      coomingSoon: true,
      text: 'Cinque semplici passi per aderire a Nuova connettività',
      iconName: 'FlagOutlined',
    },
    {
      title: 'Documentazione API REST',
      text: 'Esplora le API Rest per la gestione delle posizioni debitorie',
      href: pagoPa.subpaths.api?.path ?? '#',
      iconName: 'FolderOutlined',
    },
    {
      title: 'Documentazione  SOAP',
      text: 'Consulta tutti gli schemi XSD e WSDL che seguono le diverse release SANP',
      href: 'https://github.com/pagopa/pagopa-api',
      iconName: 'FolderOutlined',
    },
  ],
  tutorials: {
    subtitle:
      'Quali sono i passaggi per rendere disponibili i propri servizi di pagamento sulla piattaforma pagoPA? Come si stampa un avviso di pagamento? Risolvi ogni dubbio con questi brevi tutorial.',
    list: pagoPaTutorials,
  },
  relatedLinks: [
    {
      path: 'https://survey.pagopa.it/238313',
      name: 'Contribuisci al miglioramento della Tassonomia',
    },
    {
      path: `${pagoPaGuideListsPath.path}/linee-guida-brand-pagopa/v1.0`,
      name: 'Consulta le linee guida brand pagoPA',
    },
    {
      path: 'https://www.gazzettaufficiale.it/eli/id/2018/07/03/18A04494/sg',
      name: 'Consulta le linee Guida Gazzetta Ufficiale',
    },
    {
      path: `${pagoPaGuideListsPath.path}/portale-delle-adesioni/v4`,
      name: 'Leggi il documento sul Portale delle Adesioni predisposto per gli Enti Creditori',
    },
  ],
  postIntegration: {
    subtitle:
      'Se hai da poco terminato il processo di integrazione con pagoPA o lo stai già utilizzando, queste risorse potrebbero fare al caso tuo.',
    guides: [
      {
        title: "Piano di test per l'avvio di esercizio",
        description: {
          title: 'Argomenti trattati',
          listItems: [
            'Scenari di test per veriﬁcare la corretta implementazione dei workﬂow di pagamento',
            'Specifiche relative al processo di Pagamento presso PSP previste dall’attuale versione delle SANP',
          ],
        },
        link: {
          href: 'https://github.com/pagopa/lg-pagopa-docs/blob/master/documentazione_tecnica_collegata/adesione/A_PdT_EC_NM3.cleaned.docx',
          label: 'Scopri di più',
        },
        imagePath: '/images/validatore.png',
        mobileImagePath: '/images/validatore-mobile.png',
      },
      {
        title: 'Guida tecnica sugli avvisi di pagamento pagoPA',
        description: {
          title: 'Argomenti trattati',
          listItems: [
            'Tutte le specifiche per la produzione dell’avviso analogico di pagamento pagoPA',
          ],
        },
        link: {
          href: `${pagoPaGuideListsPath.path}/avviso-pagamento/3.1.0`,
          label: 'Scopri di più',
        },
        imagePath: '/images/guida-tecnica-sugli-avvisi-di-pagamento.png',
        mobileImagePath:
          '/images/guida-tecnica-sugli-avvisi-di-pagamento-mobile.png',
      },
    ],
  },
  bannerLinks: [
    {
      theme: 'dark',
      title: 'Hai bisogno di aiuto?',
      decoration: 'HeadsetMic',
      body: 'Apri un ticket utilizzando l’apposita funzione all’interno della tua area riservata di Self Care.',
    },
    {
      theme: 'light',
      title: 'Dicci cosa ne pensi',
      decoration: 'Feedback',
      body: 'Per chiarimenti sulle specifiche d’implementazione di pagoPA, come ad esempio SACI e SANP, puoi aprire una segnalazione su GitHub',
    },
  ],
};
