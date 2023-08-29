import { ApiData } from '@/lib/types/apiData';
import { ioSign } from '@/_contents/ioSign/ioSign';
import { ioSignApiPath } from '@/_contents/ioSign/apiPath';
import { ioSignBannerLinks } from '@/_contents/ioSign/bannerLinks';

export const ioSignApi: ApiData = {
  ...ioSignApiPath,
  product: ioSign,
  specURLs: [
    {
      url: 'https://raw.githubusercontent.com/pagopa/io-sign/latest/apps/io-func-sign-issuer/openapi.yaml',
    },
  ],
  bannerLinks: ioSignBannerLinks,
};
