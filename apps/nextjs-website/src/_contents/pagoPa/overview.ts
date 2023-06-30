import { OverviewData } from '@/lib/types/overviewData';
import { pagoPA } from '@/_contents/pagoPa/pagoPA';
import { pagoPaOverviewPath } from '@/_contents/pagoPa/overviewPath';

export const pagoPaOverview: OverviewData = {
  ...pagoPaOverviewPath,
  product: pagoPA,
  hero: {
    altText: 'Hero: La piattaforma per gestire e rendicontare i pagamenti',
    backgroundImage: '/images/hero.jpg',
    title: 'La piattaforma per gestire e rendicontare i pagamenti',
    subtitle:
      'pagoPA permette alle Pubbliche Amministrazioni di gestire gli incassi in modo centralizzato, offrendo servizi automatici di rendicontazione e riconciliazione con un significativo risparmio nei costi di gestione.',
  },
  feature: {
    title: 'title',
    subtitle: 'subtitle',
    items: [],
  },
};
