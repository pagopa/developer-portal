import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import { makeStrapiConfig, StrapiConfig } from '@/lib/strapi/StrapiConfig';
import { publicEnv } from '@/BrowserConfig';

// This type represents the environment of Strapi.
export type StrapiEnv = {
  readonly strapiEndpoint: string;
  readonly strapiApiToken: string;
  readonly fetchFun: typeof fetch;
};

const makeStrapiEnv = (config: StrapiConfig): StrapiEnv => ({
  strapiEndpoint: config.STRAPI_ENDPOINT,
  strapiApiToken: config.STRAPI_API_TOKEN,
  fetchFun: fetch,
});

export const strapiEnv = pipe(
  makeStrapiConfig(publicEnv),
  E.map(makeStrapiEnv),
  E.getOrElseW((errors) => {
    // eslint-disable-next-line functional/no-throw-statements
    throw errors;
  })
);
