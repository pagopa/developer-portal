import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { GuidesCodec } from '@/lib/strapi/codecs/GuidesCodec';
import { productRelationsPopulate } from './fetchProducts';

const makeStrapiGuidesPopulate = () =>
  qs.stringify({
    populate: {
      image: { populate: '*' },
      mobileImage: { populate: '*' },
      listItems: { populate: '*' },
      versions: { populate: '*' },
      bannerLinks: { populate: ['icon'] },
      seo: { populate: 'metaSocial.image' },
      product: {
        ...productRelationsPopulate,
      },
    },
  });

export const fetchGuides = fetchFromStrapi(
  'guides',
  makeStrapiGuidesPopulate(),
  GuidesCodec
);
