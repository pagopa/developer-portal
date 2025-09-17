import * as qs from 'qs';
import { webinarPopulate } from '@/lib/strapi/fetches/fetchWebinars';
import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import { StrapiSolutions } from '@/lib/strapi/types/solutions';

const solutionsPopulate = {
  populate: {
    icon: 'icon',
    stats: '*',
    steps: {
      populate: {
        products: '*'
      }
    },
    seo: {
      populate: '*,metaImage,metaSocial.image'
    },
    products: {
      populate: ['logo']
    },
    bannerLinks: {
      populate: ['icon']
    },
    webinars: webinarPopulate,
    caseHistories: {
      populate: ['case_histories', 'case_histories.image']
    }
  }
};

const makeStrapiSolutionsPopulate = () =>
  qs.stringify({
    ...solutionsPopulate
  });

export const fetchSolutions = fetchFromStrapi<StrapiSolutions>(
  'solutions',
  makeStrapiSolutionsPopulate()
);

const makeStrapiSolutionPopulate = (solutionSlug: string) =>
  qs.stringify({
    ...solutionsPopulate,
    filters: {
      slug: solutionSlug
    }
  });

export const fetchSolution = (solutionSlug: string) =>
  fetchFromStrapi<StrapiSolutions>(
    'solutions',
    makeStrapiSolutionPopulate(solutionSlug)
  );
