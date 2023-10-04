import { ApiData } from '@/lib/types/apiData';
import { send } from '@/_contents/send/send';
import {
  sendApiPath,
  sendB2BApiPathName,
  sendNotificationsApiPathName,
} from '@/_contents/send/apiPath';
import { sendBannerLinks } from '@/_contents/send/bannerLinks';

export const sendApi: ApiData = {
  ...sendApiPath,
  product: send,
  specURLsName: 'Documentazione API di SEND',
  specURLs: [
    {
      name: sendB2BApiPathName,
      url: 'https://raw.githubusercontent.com/pagopa/pn-delivery/main/docs/openapi/api-external-b2b-pa.yaml',
    },
    {
      name: sendNotificationsApiPathName,
      url: 'https://raw.githubusercontent.com/pagopa/pn-delivery-push/main/docs/openapi/api-external-b2b-webhook.yaml',
    },
  ],
  bannerLinks: sendBannerLinks,
};
