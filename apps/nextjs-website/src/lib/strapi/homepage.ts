import * as t from 'io-ts/lib';
import * as qs from 'qs';
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

const MediaCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    name: t.string,
    width: t.number,
    height: t.number,
    ext: t.string,
    mime: t.string,
    url: t.string,
  }),
});

const ProductCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    name: t.string,
    description: t.string,
    slug: t.string,
    logo: t.strict({ data: MediaCodec }),
  }),
});

export const StrapiHomepageCodec = t.strict({
  data: t.strict({
    id: t.number,
    attributes: t.strict({
      comingsoonDocumentation: t.type({
        title: t.string,
        links: t.array(LinkHomepageCodec),
      }),
      productsShowcase: t.strict({
        id: t.number,
        title: t.string,
        products: t.strict({
          data: t.array(ProductCodec),
        }),
      }),
    }),
  }),
});

export type StrapiHomepage = t.TypeOf<typeof StrapiHomepageCodec>;

const makeStrapiHomepagePopulate = () =>
  qs.stringify({
    populate: {
      comingsoonDocumentation: {
        populate: ['links'],
      },
      productsShowcase: {
        populate: ['products.logo'],
      },
    },
  });

export const fetchHomepage = fetchFromStrapi(
  'homepage',
  makeStrapiHomepagePopulate(),
  StrapiHomepageCodec
);
