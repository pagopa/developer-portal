import * as t from 'io-ts/lib';
import { fetchFromStrapi } from './fetchFromStrapi';

const StrapiHomepageCodec = t.strict({
  data: t.strict({
    id: t.number,
    attributes: t.strict({
      Title: t.string,
      Description: t.string,
    }),
  }),
});

export type StrapiHomepage = t.TypeOf<typeof StrapiHomepageCodec>;

export const fetchHomepage = fetchFromStrapi(
  'homepage',
  '*',
  StrapiHomepageCodec
);
