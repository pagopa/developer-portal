import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import { makeBuildConfig } from '@/BuildConfig';
import { makeBuildEnv } from '@/BuildEnv';
import { makeHomepageProps, makeHomepagePropsFromStatic } from './homepage';
import { fetchHomepage } from '@/lib/strapi/homepage';
import { translations } from '@/_contents/translations';
import { webinars } from '@/_contents/webinars';
import { makeWebinarsProps, makeWebinarsPropsFromStatic } from './webinars';
import { fetchWebinars } from './strapi/webinars';
import { fetchQuickStarts } from './strapi/quickStarts';
import {
  makeQuickStartsProps,
  makeQuickStartsPropsFromStatic,
} from './quickStarts';
import { quickStartGuides } from '@/_contents/products';
import { makeCaseHistoriesProps } from './caseHistories';
import { fetchCaseHistories } from './strapi/caseHistoriesCodec';

// a BuildEnv instance ready to be used
const buildEnv = pipe(
  makeBuildConfig(process.env),
  E.map(makeBuildEnv),
  E.getOrElseW((errors) => {
    // eslint-disable-next-line functional/no-throw-statements
    throw errors;
  })
);

export const getHomepageProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  const { homepage: staticHomepage } = translations;

  if (fetchFromStrapi) {
    const strapiHomepage = await fetchHomepage(buildEnv);
    return makeHomepageProps(strapiHomepage, staticHomepage);
  } else {
    return makeHomepagePropsFromStatic(staticHomepage);
  }
};

export const getWebinarsProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const strapiWebinars = await fetchWebinars(buildEnv);
    return makeWebinarsProps(strapiWebinars, webinars);
  } else {
    return makeWebinarsPropsFromStatic(webinars);
  }
};

export const getQuickStartsProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const strapiQuickStart = await fetchQuickStarts(buildEnv);
    return makeQuickStartsProps(strapiQuickStart, quickStartGuides);
  } else {
    return makeQuickStartsPropsFromStatic(quickStartGuides);
  }
};

export const getCaseHistoriesProps = async () => {
  const {
    config: { FETCH_FROM_STRAPI: fetchFromStrapi },
  } = buildEnv;

  if (fetchFromStrapi) {
    const strapiCaseHistories = await fetchCaseHistories(buildEnv);
    return makeCaseHistoriesProps(strapiCaseHistories);
  } else {
    return [];
  }
};
