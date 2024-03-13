import * as t from 'io-ts/lib';
import * as tt from 'io-ts-types';
import * as qs from 'qs';
import { fetchFromStrapi } from './fetchFromStrapi';
import { BlocksContentCodec } from './codecs/BlocksContentCodec';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';

/**
 * This type is used to convert null to undefined when decoding.
 * This is useful becuase Strapi returns null for missing fields, so we want to convert those to undefined to be more consistent with the rest of our codebase.
 *
 * @example
 * const codec = t.union([NullToUndefined, t.string]);
 * const result = codec.decode(null);
 * // result will be Right(undefined)
 */
export const NullToUndefined = new t.Type<undefined, null, unknown>(
  // name: a unique name for this codec
  'NullToUndefined',
  // is: a custom type guard
  t.undefined.is,
  // validate: succeeds if a value of type I can be decoded to a value of type A
  (u, c) =>
    pipe(
      t.null.validate(u, c),
      E.map(() => undefined)
    ),
  // encode: converts a value of type A to a value of type O
  () => null
);

const LinkCodec = t.strict({
  text: t.string,
  href: t.string,
  target: t.union([
    NullToUndefined,
    t.literal('_self'),
    t.literal('_blank'),
    t.literal('_parent'),
    t.literal('_top'),
  ]),
});

const MediaCodec = t.strict({
  attributes: t.strict({
    name: t.string,
    alternativeText: t.union([t.null, t.string]),
    caption: t.union([t.null, t.string]),
    width: t.number,
    height: t.number,
    ext: t.string,
    mime: t.string,
    url: t.string,
  }),
});

const ProductCodec = t.strict({
  attributes: t.strict({
    name: t.string,
    description: t.union([t.null, t.string]),
    slug: t.string,
    logo: t.strict({ data: MediaCodec }),
  }),
});

const CallToActionCodec = t.strict({
  link: LinkCodec,
  variant: t.union([
    NullToUndefined,
    t.literal('text'),
    t.literal('contained'),
    t.literal('outlined'),
  ]),
});

const HeroSlideCodec = t.strict({
  title: t.string,
  subhead: t.union([NullToUndefined, BlocksContentCodec]),
  callToAction: t.union([NullToUndefined, CallToActionCodec]),
  titleColor: t.union([
    NullToUndefined,
    t.literal('contrastText'),
    t.literal('main'),
    t.literal('light'),
    t.literal('dark'),
  ]),
  backgroundImage: t.strict({ data: t.union([NullToUndefined, MediaCodec]) }),
});

const NewsItemCodec = t.strict({
  attributes: t.strict({
    comingSoon: t.boolean,
    title: t.string,
    link: LinkCodec,
    publishedAt: tt.DateFromISOString,
    image: t.strict({ data: t.union([t.null, MediaCodec]) }),
  }),
});

export const StrapiHomepageCodec = t.strict({
  data: t.strict({
    attributes: t.strict({
      comingsoonDocumentation: t.type({
        title: t.string,
        links: t.array(LinkCodec),
      }),
      heroSlider: t.array(HeroSlideCodec),
      newsShowcase: t.union([
        t.null,
        t.strict({
          title: t.string,
          items: t.strict({
            data: t.array(NewsItemCodec),
          }),
        }),
      ]),
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
      heroSlider: {
        populate: ['backgroundImage', 'callToAction.link'],
      },
      newsShowcase: {
        populate: ['items.image', 'items.link'],
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
