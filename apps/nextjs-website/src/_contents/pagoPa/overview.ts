import { OverviewData } from '@/lib/types/overviewData';
import { pagoPa } from '@/_contents/pagoPa/pagoPa';
import { pagoPaOverviewPath } from '@/_contents/pagoPa/overviewPath';
import { pagoPaTutorials } from '@/_contents/pagoPa/tutorialLists';
import { pagoPaGuideListsPath } from '@/_contents/pagoPa/guideListsPath';
import { pagoPaBannerLinks } from '@/_contents/pagoPa/bannerLinks';

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
  startInfo: {
    cta: {
      label: 'Leggi la guida tecnica',
      text: 'Scopri tutti i dettagli dell’integrazione',
      href: `${pagoPaGuideListsPath.path}/avviso-pagamento`,
    },
    cards: [
      {
        title: 'Quick Start',
        text: 'Cinque semplici passi per aderire a Nuova connettività',
        href: pagoPa.subpaths.quickStart?.path ?? '#',
        iconName: 'FlagOutlined',
        iconColor: 'primary.dark',
        useSrc: false,
      },
      {
        title: 'Documentazione API',
        text: 'Esplora le API REST e SOAP di pagoPA',
        href: pagoPa.subpaths.api?.path,
        iconName: 'Code',
        iconColor: 'primary.dark',
        useSrc: false,
      },
    ],
  },
  tutorials: {
    subtitle:
      'Quali sono i passaggi per rendere disponibili i propri servizi di pagamento sulla piattaforma pagoPA? Come si stampa un avviso di pagamento? Risolvi ogni dubbio con questi brevi tutorial.',
    list: pagoPaTutorials,
  },
  relatedLinks: {
    title: 'Link utili',
    links: [
      {
        text: 'Contribuisci al miglioramento della Tassonomia',
        href: 'https://survey.pagopa.it/238313',
      },
      {
        text: 'Consulta le linee guida brand pagoPA',
        href: `${pagoPaGuideListsPath.path}/linee-guida-brand-pagopa`,
      },
      {
        text: 'Consulta le linee Guida Gazzetta Ufficiale',
        href: 'https://www.gazzettaufficiale.it/eli/id/2018/07/03/18A04494/sg',
      },
      {
        text: 'Leggi il documento sul Portale delle Adesioni predisposto per gli Enti Creditori',
        href: `${pagoPaGuideListsPath.path}/portale-delle-adesioni`,
      },
    ],
  },
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
          href: 'https://github.com/pagopa/lg-pagopa-docs/raw/master/documentazione_tecnica_collegata/adesione/A_PdT_EC_NM3.cleaned.docx',
          label: 'Scarica il documento',
        },
        imagePath: '/images/pago-pa-test-esercizio.png',
        mobileImagePath: '/images/pago-pa-test-esercizio.png',
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
          href: `${pagoPaGuideListsPath.path}/avviso-pagamento`,
          label: 'Scopri di più',
        },
        imagePath: '/images/guida-tecnica-sugli-avvisi-di-pagamento.png',
        mobileImagePath:
          '/images/guida-tecnica-sugli-avvisi-di-pagamento-mobile.png',
      },
    ],
  },
  bannerLinks: pagoPaBannerLinks,
};
