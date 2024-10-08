import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { GuidesCodec } from '@/lib/strapi/codecs/GuidesCodec';

const makeStrapiGuidesPopulate = () =>
  qs.stringify({
    populate: [
      'image',
      'mobileImage',
      'listItems',
      'versions',
      'bannerLinks.icon',
      'seo',
      'seo.metaSocial.image',
      'product.logo',
      'product.bannerLinks.icon',
    ],
  });

export const fetchGuides = fetchFromStrapi(
  'guides',
  makeStrapiGuidesPopulate(),
  GuidesCodec
);
