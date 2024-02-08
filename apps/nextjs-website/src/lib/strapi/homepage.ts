import * as t from 'io-ts/lib';
import { fetchFromStrapi } from './fetchFromStrapi';

const StrapiHomepageCodec = t.strict({
  data: t.strict({
    id: t.number,
    attributes: t.strict({
      comingsoonDocumentation: t.type({
        title: t.string,
      }),
    }),
  }),
});

export type StrapiHomepage = t.TypeOf<typeof StrapiHomepageCodec>;

export const fetchHomepage = fetchFromStrapi(
  'homepage',
  '*',
  StrapiHomepageCodec
);
