import qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { CustomMessagesMap } from '@/lib/strapi/types/customMessagesMap';

const makeCustomMessagesMapPopulate = () =>
  qs.stringify({
    populate: '*',
  });

export const fetchCustomMessagesMap = fetchFromStrapi<CustomMessagesMap>(
  'custom-messages-map',
  makeCustomMessagesMapPopulate()
);
