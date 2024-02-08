import * as t from 'io-ts';

export const StrapiConfig = t.type({
  STRAPI_ENDPOINT: t.string,
  STRAPI_API_TOKEN: t.string,
});

export type StrapiConfig = t.TypeOf<typeof StrapiConfig>;
