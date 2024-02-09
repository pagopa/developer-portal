import * as t from 'io-ts/lib';
import { fetchFromStrapi } from './fetchFromStrapi';

const LinkHomepageCodec = t.strict({
  text: t.string,
  href: t.string,
  target: t.union([
    t.null,
    t.literal('_self'),
    t.literal('_blank'),
    t.literal('_parent'),
    t.literal('_top'),
  ]),
});

export const StrapiHomepageCodec = t.strict({
  data: t.strict({
    id: t.number,
    attributes: t.strict({
      comingsoonDocumentation: t.type({
        title: t.string,
        links: t.array(LinkHomepageCodec),
      }),
    }),
  }),
});

export type StrapiHomepage = t.TypeOf<typeof StrapiHomepageCodec>;

export const fetchHomepage = fetchFromStrapi(
  'homepage',
  'populate[comingsoonDocumentation][populate][0]=links',
  StrapiHomepageCodec
);
