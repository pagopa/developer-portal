import * as qs from 'qs';
import { webinarPopulate } from '@/lib/strapi/fetches/fetchWebinars';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { SolutionsCodec } from '@/lib/strapi/codecs/SolutionsCodec';

const solutionsPopulate = {
  populate: {
    icon: 'icon',
    stats: '*',
    steps: {
      populate: {
        products: '*',
      },
    },
    seo: {
      populate: '*,metaImage,metaSocial.image',
    },
    products: {
      populate: ['logo'],
    },
    bannerLinks: {
      populate: ['icon'],
    },
    webinars: webinarPopulate,
    caseHistories: {
      populate: ['case_histories', 'case_histories.image'],
    },
  },
};

const makeStrapiSolutionsPopulate = () =>
  qs.stringify({
    ...solutionsPopulate,
  });

export const fetchSolutions = (locale?: string) =>
  fetchFromStrapi(
    'solutions',
    makeStrapiSolutionsPopulate(),
    SolutionsCodec,
    locale
  );

const makeStrapiSolutionPopulate = (solutionSlug: string) =>
  qs.stringify({
    ...solutionsPopulate,
    filters: {
      slug: solutionSlug,
    },
  });

export const fetchSolution = (solutionSlug: string, locale?: string) =>
  fetchFromStrapi(
    'solutions',
    makeStrapiSolutionPopulate(solutionSlug),
    SolutionsCodec,
    locale
  );
