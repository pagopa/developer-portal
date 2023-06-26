import { OverviewData } from '@/lib/types/overviewData';
import { appIO } from '@/_contents/appIo/appIO';
import { appIoOverviewPath } from '@/_contents/appIo/overviewPath';

export const appIoOverview: OverviewData = {
  ...appIoOverviewPath,
  product: appIO,
  hero: {
    title: 'Raccogli i servizi del tuo ente in unico spazio',
    subtitle:
      "Con l’app IO accresci la visibilità dei servizi offerti dal tuo ente, offri alla cittadinanza un'esperienza digitale di qualità e risparmi sulle spese di implementazione tecnologica.",
  },
};
