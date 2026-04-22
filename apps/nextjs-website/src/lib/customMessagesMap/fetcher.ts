import qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import type { CustomMessagesMap } from '@/lib/customMessagesMap/strapiTypes';

const makeCustomMessagesMapPopulate = () =>
  qs.stringify({
    populate: '*',
  });

export const fetchCustomMessagesMap = fetchFromStrapi<CustomMessagesMap>(
  'custom-messages-map',
  makeCustomMessagesMapPopulate()
);
