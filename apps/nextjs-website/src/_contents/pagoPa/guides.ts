import { pagoPA } from '@/_contents/pagoPa/pagoPA';
import { GuidesData } from '@/lib/types/guidesData';
import { pagoPaGuidesPath } from '@/_contents/pagoPa/guidesPath';

export const pagoPaGuides: GuidesData = {
  ...pagoPaGuidesPath,
  product: pagoPA,
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
              'Come generare un codice IUV',
              'La gestione e gli attributi delle operazioni di trasferimento fondi',
              'Come creare  il flusso di rendicontazione da inoltrare al Nodo dei Pagamenti-SPC',
              'Come EC riconcilia il flusso dei pagamenti',
            ],
          },
          link: {
            href: '#',
            icon: '',
            title: 'Vai al manuale',
          },
          imagePath: '/images/saci.png',
        },
        {
          title: 'SANP 3.4.1',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Conoscere usare e gestire il prodotto pagoPA',
              'Principali casi d’uso per PSP, Ec e Touchpoint',
              'Come un EC può aderire e integrarsi in pagoPA',
              'Come PSP può aderire e integrarsi in pagoPA',
            ],
          },
          link: {
            href: '#',
            icon: '',
            title: 'Vai al manuale',
          },
          imagePath: '/images/sanp.png',
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
            href: '#',
            icon: '',
            title: 'Vai al manuale',
          },
          imagePath: '/images/avvisi.png',
        },
        {
          title: 'Linee Guida Brand pagoPA',
          description: {
            title: 'Argomenti trattati',
            listItems: [
              'Linee guida per la comunicazione corretta del brand per EC, PSP, Partner e Intermediari Tecnologici',
              'Crea una campagna di sensibilizzazione',
              'Scopri come come comunicare il brand pagoPA nei post sui social media',
              'Leggi i suggerimenti per una comunicazione efficace',
            ],
          },
          link: {
            href: '#',
            icon: '',
            title: 'Vai al manuale',
          },
          imagePath: '/images/saci.png',
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
            href: '#',
            icon: '',
            title: 'Vai al manuale',
          },
          imagePath: '/images/saci.png',
        },
      ],
    },
  ],
};
