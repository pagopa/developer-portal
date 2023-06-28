import { ApisData } from '@/lib/types/apisData';
import { appIO } from '@/_contents/appIo/appIO';
import { appIoApisPath } from '@/_contents/appIo//apisPath';

export const appIoApis: ApisData = {
  ...appIoApisPath,
  product: appIO,
  hero: {
    title: 'Raccogli i servizi del tuo ente in unico spazio',
    subtitle:
      "Con l’app IO accresci la visibilità dei servizi offerti dal tuo ente, offri alla cittadinanza un'esperienza digitale di qualità e risparmi sulle spese di implementazione tecnologica.",
  },
  yaml: 'https://raw.githubusercontent.com/pagopa/io-functions-services/50a116f/openapi/index.yaml',
};
