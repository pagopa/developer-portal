import * as qs from 'qs';
import { fetchFromStrapiNew } from '@/lib/strapi/fetchFromStrapi';
import { productRelationsPopulate } from './fetchProducts';
import { StrapiGuides } from '@/lib/strapi/types/guide';

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

export const fetchGuides = fetchFromStrapiNew<StrapiGuides>(
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
  fetchFromStrapiNew<StrapiGuides>(
    'guides',
    makeStrapiGuidePopulate(guideSlug, productSlug)
  );
