import * as t from 'io-ts/lib';
import * as qs from 'qs';
import { fetchFromStrapi } from './fetchFromStrapi';
import { RootNodeCodec } from '../codecs/BlocksContentCodec';

const CtaCodec = t.intersection([
  t.strict({
    text: t.string,
    href: t.string,
  }),
  t.partial({
    target: t.union([
      t.null,
      t.literal('_self'),
      t.literal('_blank'),
      t.literal('_parent'),
      t.literal('_top'),
    ]),
  }),
]);

const MediaCodec = t.strict({
  attributes: t.strict({
    name: t.readonly(t.string),
    width: t.readonly(t.number),
    height: t.readonly(t.number),
    ext: t.readonly(t.string),
    mime: t.readonly(t.string),
    url: t.readonly(t.string),
  }),
});

const CtaSlideCodec = t.intersection([
  t.strict({
    subhead: t.array(RootNodeCodec),
  }),
  t.partial({
    variant: t.union([
      t.null,
      t.literal('text'),
      t.literal('contained'),
      t.literal('outlined'),
    ]),
    cta: t.union([t.null, CtaCodec]),
    child: t.union([t.string, t.null]),
    backgroundImage: t.strict({ data: MediaCodec }),
  }),
]);

const ProductCodec = t.strict({
  attributes: t.strict({
    name: t.string,
    description: t.string,
    slug: t.string,
    logo: t.strict({ data: MediaCodec }),
  }),
});

export const StrapiHomepageCodec = t.strict({
  data: t.strict({
    attributes: t.strict({
      comingsoonDocumentation: t.type({
        title: t.string,
        links: t.array(CtaCodec),
      }),
      hero: t.array(CtaSlideCodec),
      productsShowcase: t.strict({
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
      hero: {
        populate: ['backgroundImage', 'cta'],
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
