import { pagoPa } from '@/_contents/pagoPa/pagoPa';
import { GuideListsData } from '@/lib/types/guideListsData';
import { pagoPaGuideListsPath } from '@/_contents/pagoPa/guideListsPath';

export const pagoPaGuideLists: GuideListsData = {
  ...pagoPaGuideListsPath,
  product: pagoPa,
  abstract: {
    title: 'La piattaforma per gestire e rendicontare i pagamenti',
    description:
      'pagoPA permette alle Pubbliche Amministrazioni di gestire gli incassi in modo centralizzato, offrendo servizi automatici di rendicontazione e riconciliazione con un significativo risparmio nei costi di gestione.',
  },
  guidesSections: [
    {
      title: "Per l'integrazione",
      guides: [
        {
          title: 'SACI 3.1.0',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Genera un codice IUV',
              'Comprendi la gestione delle operazioni di trasferimento fondi',
              'Crea il flusso di rendicontazione',
              'Riconcilia il flusso dei pagamenti',
            ],
          },
          link: {
            href: `${pagoPaGuideListsPath.path}/saci/3.1.0`,
            label: 'Vai al manuale',
          },
          imagePath: '/images/saci.png',
          mobileImagePath: '/images/saci-mobile.png',
        },
        {
          title: 'SANP 3.4.1',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Conosci, usa e gestisci il prodotto pagoPA',
              'Esplora i principali casi d’uso per PSP ed Enti Creditori',
              'Scopri come un Ente Creditore può aderire e integrarsi in pagoPA',
              'Scopri come un PSP può aderire e integrarsi in pagoPA',
            ],
          },
          link: {
            href: `${pagoPaGuideListsPath.path}/sanp/3.4.1`,
            label: 'Vai al manuale',
          },
          imagePath: '/images/sanp.png',
          mobileImagePath: '/images/sanp-mobile.png',
        },
      ],
    },
    {
      title: "Per l'utilizzo",
      guides: [
        {
          title: 'Avvisi di Pagamento',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Scopri come si crea un avviso di pagamento',
              'Usa i modelli grafici per la creazione di un avviso',
              'Visualizza alcuni esempi',
              'Consulta le indicazioni per la produzione di un avviso di pagamento',
            ],
          },
          link: {
            href: `${pagoPaGuideListsPath.path}/avviso-pagamento/3.1.0`,
            label: 'Vai al manuale',
          },
          imagePath: '/images/guida-tecnica-sugli-avvisi-di-pagamento.png',
          mobileImagePath: '/images/avvisi-mobile.png',
        },
        {
          title: 'Linee Guida Brand pagoPA',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Utilizza correttamente il brand pagoPA',
              'Crea una campagna di sensibilizzazion',
              'Scopri come come comunicare il brand pagoPA sui social media',
              'Leggi i suggerimenti per una comunicazione efficace',
            ],
          },
          link: {
            href: `${pagoPaGuideListsPath.path}/linee-guida-brand-pagopa/v1.0`,
            label: 'Vai al manuale',
          },
          imagePath: '/images/saci.png',
          mobileImagePath: '/images/saci-mobile.png',
        },
        {
          title: 'Portale delle Adesioni',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Scarica il PDF per iscriversi e comprendere il “portale delle Adesioni“',
            ],
          },
          link: {
            href: `${pagoPaGuideListsPath.path}/portale-delle-adesioni/v4`,
            label: 'Vai al manuale',
          },
          imagePath: '/images/saci.png',
          mobileImagePath: '/images/saci-mobile.png',
        },
      ],
    },
  ],
};
