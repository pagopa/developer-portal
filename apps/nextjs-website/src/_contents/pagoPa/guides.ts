import { pagoPA } from '@/_contents/pagoPa/pagoPA';
import { GuidesData } from '@/lib/types/guidesData';
import { pagoPaGuidesPath } from '@/_contents/pagoPa/guidesPath';

export const pagoPaGuides: GuidesData = {
  ...pagoPaGuidesPath,
  product: pagoPA,
  hero: {
    title: 'La piattaforma per gestire e rendicontare i pagamenti',
    subtitle:
      'pagoPA permette alle Pubbliche Amministrazioni di gestire gli incassi in modo centralizzato, offrendo servizi automatici di rendicontazione e riconciliazione con un significativo risparmio nei costi di gestione.',
  },
};
