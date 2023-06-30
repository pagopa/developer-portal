import { OverviewData } from '@/lib/types/overviewData';
import { pagoPa } from '@/_contents/pagoPa/pagoPa';
import { pagoPaOverviewPath } from '@/_contents/pagoPa/overviewPath';

export const pagoPaOverview: OverviewData = {
  ...pagoPaOverviewPath,
  product: pagoPa,
  hero: {
    title: 'La piattaforma per gestire e rendicontare i pagamenti',
    subtitle:
      'pagoPA permette alle Pubbliche Amministrazioni di gestire gli incassi in modo centralizzato, offrendo servizi automatici di rendicontazione e riconciliazione con un significativo risparmio nei costi di gestione.',
  },
};
