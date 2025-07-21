import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from './fetchProducts';
import { StrapiGuidesPaginated } from '@/lib/strapi/types/guide';

const guidesPopulate = {
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
};

const makeStrapiGuidesPopulate = () =>
  qs.stringify({
    ...guidesPopulate,
  });

export const fetchGuides = fetchFromStrapi<StrapiGuidesPaginated>(
  'guides',
  makeStrapiGuidesPopulate()
);

const makeStrapiGuidePopulate = (guideSlug: string, productSlug: string) =>
  qs.stringify({
    ...guidesPopulate,
    filters: {
      slug: guideSlug,
      product: {
        slug: productSlug,
      },
    },
  });

export const fetchGuide = (guideSlug: string, productSlug: string) =>
  fetchFromStrapi<StrapiGuidesPaginated>(
    'guides',
    makeStrapiGuidePopulate(guideSlug, productSlug)
  );
