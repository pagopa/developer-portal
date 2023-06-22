import { OverviewData } from '@/api/types/overviewData';
import { ioSign } from '@/features/ioSign/ioSign';
import { ioSignOverviewPath } from '@/features/ioSign/overviewPath';

export const ioSignOverview: OverviewData = {
  ...ioSignOverviewPath,
  product: ioSign,
  hero: {
    title: 'Raccogli i servizi del tuo ente in unico spazio',
    subtitle:
      "Con l’app IO accresci la visibilità dei servizi offerti dal tuo ente, offri alla cittadinanza un'esperienza digitale di qualità e risparmi sulle spese di implementazione tecnologica.",
  },
};
