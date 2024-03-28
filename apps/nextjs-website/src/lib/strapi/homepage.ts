import * as t from 'io-ts/lib';
import * as tt from 'io-ts-types';
import * as qs from 'qs';
import { fetchFromStrapi } from './fetchFromStrapi';
import { BlocksContentCodec } from './codecs/BlocksContentCodec';
import { NullToUndefinedCodec } from './codecs/NullToUndefinedCodec';

const LinkCodec = t.strict({
  text: t.string,
  href: t.string,
  target: t.union([
    NullToUndefinedCodec,
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
    NullToUndefinedCodec,
    t.literal('text'),
    t.literal('contained'),
    t.literal('outlined'),
  ]),
});

const HeroSlideCodec = t.strict({
  title: t.string,
  subhead: t.union([NullToUndefinedCodec, BlocksContentCodec]),
  subheadColor: t.union([
    NullToUndefinedCodec,
    t.literal('contrastText'),
    t.literal('main'),
    t.literal('light'),
    t.literal('dark'),
  ]),
  callToAction: t.union([NullToUndefinedCodec, CallToActionCodec]),
  titleColor: t.union([
    NullToUndefinedCodec,
    t.literal('contrastText'),
    t.literal('main'),
    t.literal('light'),
    t.literal('dark'),
  ]),
  backgroundImage: t.strict({
    data: t.union([NullToUndefinedCodec, MediaCodec]),
  }),
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
