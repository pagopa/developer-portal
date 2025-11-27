import * as qs from 'qs';
import { webinarPopulate } from '@/lib/strapi/fetches/fetchWebinars';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { StrapiSolutions } from '@/lib/strapi/types/solutions';
import { RootEntity } from '@/lib/strapi/types/rootEntity';

const solutionsPopulate = {
  populate: {
    stats: '*',
    steps: {
      populate: {
        products: {
          populate: ['logo'],
        },
      },
    },
    seo: {
      populate: '*',
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

export const fetchSolutions = fetchFromStrapi<RootEntity<StrapiSolutions>>(
  'solutions',
  makeStrapiSolutionsPopulate()
);

const makeStrapiSolutionPopulate = (solutionSlug: string) =>
  qs.stringify({
    ...solutionsPopulate,
    filters: {
      slug: solutionSlug,
    },
  });

export const fetchSolution = (solutionSlug: string) =>
  fetchFromStrapi<RootEntity<StrapiSolutions>>(
    'solutions',
    makeStrapiSolutionPopulate(solutionSlug)
  );
