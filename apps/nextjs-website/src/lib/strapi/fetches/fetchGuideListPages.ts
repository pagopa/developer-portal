import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { GuideListPagesCodec } from '@/lib/strapi/codecs/GuideListPagesCodec';

const makeStrapiGuideListPopulate = () =>
  qs.stringify({
    populate: {
      product: {
        populate: ['logo', 'bannerLinks.icon'],
      },
      guidesByCategory: {
        populate: ['guides.mobileImage', 'guides.image', 'guides.listItems'],
      },
      bannerLinks: {
        populate: ['icon'],
      },
      seo: {
        populate: '*,metaImage,metaSocial.image',
      },
    },
  });

export const fetchGuideListPages = fetchFromStrapi(
  'guide-list-pages',
  makeStrapiGuideListPopulate(),
  GuideListPagesCodec
);
