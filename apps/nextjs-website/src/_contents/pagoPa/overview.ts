import { OverviewData } from '@/lib/types/overviewData';
import { pagoPa } from '@/_contents/pagoPa/pagoPa';
import { pagoPaOverviewPath } from '@/_contents/pagoPa/overviewPath';
import { ioSign } from '@/_contents/ioSign/ioSign';
import { tutorials as pagoPaTutorials } from '@/_contents/pagoPa/tutorials';

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
        stackIcon: {
          icon: 'AccountBalance',
        },
        subtitle:
          'Un unico accordo quadro che abilita EC e PSP a operare e definisce gli standard di comunicazione, senza la necessità di stipulare accordi multipli',
        title: 'Un unico accordo per Enti Creditori e PSP',
      },
      {
        stackIcon: {
          icon: 'Payment',
        },
        subtitle:
          'Una gestione centralizzata degli incassi per gli Enti Creditori, tramite servizi automatici di rendicontazione e riconciliazione',
        title: 'Un modo semplice per gestire i pagamenti',
      },
      {
        stackIcon: {
          icon: 'PeopleAlt',
        },
        subtitle:
          "Accesso diretto al settore dei pagamenti per i servizi pubblici e possibilità di promuovere la tua offerta multicanale da un'unica piattaforma",
        title: 'Milioni di cittadini e imprese raggiunti',
      },
      {
        stackIcon: {
          icon: 'TrendingUp',
        },
        subtitle:
          'Esiti immediati e riduzione di tempi e costi sviluppo IT per gli Enti Creditori. Risparmio e accesso ad un più regolato mercato dei pagamenti per i PSP',
        title: 'Più efficienza su tempi  e costi',
      },
    ],
  },
  startCards: [
    {
      title: 'Quick Start',
      text: 'Cinque semplici passi per aderire a Nuova connettività',
      href: '/',
      iconName: 'FlagOutlined',
    },
    {
      title: 'Documentazione API REST',
      text: 'Esplora le API Rest per la gestione delle posizioni debitorie',
      href: ioSign.subpaths.api?.path ?? '#',
      iconName: 'FolderOutlined',
    },
    {
      title: 'Documentazione  SOAP',
      text: 'Consulta tutti gli schemi XSD e WSDL che seguono le diverse release SANP',
      href: '#',
      iconName: 'FolderOutlined',
    },
  ],
  tutorials: pagoPaTutorials,
  relatedLinks: [
    {
      path: 'https://survey.pagopa.it/238313',
      name: 'Contribuisci al miglioramento della Tassonomia',
    },
    {
      path: 'https://docs.pagopa.it/linee-guida-brand-pagopa/',
      name: 'Consulta le linee guida brand pagoPA',
    },
    {
      path: 'https://www.gazzettaufficiale.it/eli/id/2018/07/03/18A04494/sg',
      name: 'Consulta le linee Guida Gazzetta Ufficiale',
    },
    {
      path: 'https://docs.pagopa.it/portale-delle-adesioni/portale-delle-adesioni',
      name: 'Leggi il documento sul Portale delle Adesioni predisposto per gli Enti Creditori',
    },
  ],
};
