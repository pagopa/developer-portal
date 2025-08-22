import * as qs from 'qs';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { GuidesCodec } from '@/lib/strapi/codecs/GuidesCodec';
import { productRelationsPopulate } from './fetchProducts';

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

export const fetchGuides = (locale?: string) =>
  fetchFromStrapi('guides', makeStrapiGuidesPopulate(), GuidesCodec, locale);

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

export const fetchGuide = (
  guideSlug: string,
  productSlug: string,
  locale?: string
) =>
  fetchFromStrapi(
    'guides',
    makeStrapiGuidePopulate(guideSlug, productSlug),
    GuidesCodec,
    locale
  );
