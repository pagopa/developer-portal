import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { GuidesCodec } from '@/lib/strapi/codecs/GuidesCodec';

const makeStrapiGuidesPopulate = () =>
  qs.stringify({
    populate: '*',
  });

export const fetchGuides = fetchFromStrapi(
  'guides',
  makeStrapiGuidesPopulate(),
  GuidesCodec
);
