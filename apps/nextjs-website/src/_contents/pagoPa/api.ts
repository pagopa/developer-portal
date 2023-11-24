import { ApiData } from '@/lib/types/apiData';
import { pagoPa } from '@/_contents/pagoPa/pagoPa';
import { pagoPaApiPath } from '@/_contents/pagoPa/apiPath';
import { pagoPaBannerLinks } from '@/_contents/pagoPa/bannerLinks';

export const pagoPaApi: ApiData = {
  ...pagoPaApiPath,
  product: pagoPa,
  soapDocumentation: {
    url: 'https://github.com/pagopa/pagopa-api',
    title: 'Consulta la documentazione API SOAP',
    buttonLabel: 'Vai a GitHub',
    icon: 'ExitToApp',
  },
  specURLs: [
    {
      url: 'https://raw.githubusercontent.com/pagopa/pagopa-api/SANP3.6.0/openapi/gpd.yaml',
    },
  ],
  bannerLinks: pagoPaBannerLinks,
};
