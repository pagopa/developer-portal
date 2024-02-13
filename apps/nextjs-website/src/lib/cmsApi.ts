import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import { makeBuildConfig } from '@/BuildConfig';
import { makeBuildEnv } from '@/BuildEnv';
import { makeHomepageProps, makeHomepagePropsFromStatic } from './homepage';
import { fetchHomepage } from '@/lib/strapi/homepage';
import { translations } from '@/_contents/translations';

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
    config: {
      FETCH_FROM_STRAPI: fetchFromStrapi,
      STRAPI_ENDPOINT: strapiEndpoint,
    },
  } = buildEnv;

  const { header: staticHeader, homepage: staticHomepage } = translations;

  if (fetchFromStrapi) {
    const strapiHomepage = await fetchHomepage(buildEnv);
    return makeHomepageProps(
      strapiHomepage,
      strapiEndpoint,
      staticHeader,
      staticHomepage
    );
  } else {
    return makeHomepagePropsFromStatic(staticHeader, staticHomepage);
  }
};
