import { PageOverview } from '@/pages/api/types/pageOverview';
import { Path } from '@/pages/api/types/path';

export const overviewPath: Path = {
  name: 'App IO overview',
  slug: 'overview',
};

export const appIOOverview: PageOverview = {
  ...overviewPath,
  hero: {
    title: 'Raccogli i servizi del tuo ente in unico spazio',
    subtitle:
      "Con l’app IO accresci la visibilità dei servizi offerti dal tuo ente, offri alla cittadinanza un'esperienza digitale di qualità e risparmi sulle spese di implementazione tecnologica.",
  },
};
