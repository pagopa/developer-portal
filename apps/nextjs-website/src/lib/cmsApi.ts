import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import { makeBuildEnv } from '@/BuildEnv';
import { fetchHomepage } from './strapi/homepage';
import { translations } from '@/_contents/translations';
import { makeHomepageProps, makeHomepagePropsFromStatic } from './homepage';

// an BuildEnv instance ready to be used
export const buildEnv = pipe(
  makeBuildEnv(process.env),
  E.getOrElseW((errors) => {
    // eslint-disable-next-line functional/no-throw-statements
    throw errors;
  })
);

export const getHomepage = async () => {
  const {
    config: { FETCH_FROM_STRAPI },
  } = buildEnv;
  const { header, homepage } = translations;
  if (FETCH_FROM_STRAPI) {
    const strapiHomepage = await fetchHomepage(buildEnv);
    return makeHomepageProps(strapiHomepage, header, homepage);
  } else {
    return makeHomepagePropsFromStatic(header, homepage);
  }
};
