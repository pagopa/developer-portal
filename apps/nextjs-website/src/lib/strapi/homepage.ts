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

const ImageBlockCodec = t.strict({
  type: t.literal('image'),
  image: t.strict({
    url: t.string,
    width: t.number,
    height: t.number,
    alternativeText: t.string,
  }),
});

const BlocksContentCodec = t.strict({
  type: t.string,
  children: t.UnknownArray,
  image: t.unknown,
});

const CtaSlideCodec = t.strict({
  subhead: t.union([t.string, BlocksContentCodec]),
  color: t.union([t.string, t.null, t.undefined]),
  variant: t.union([
    t.null,
    t.literal('text'),
    t.literal('contained'),
    t.literal('outlined'),
  ]),
  cta: t.union([LinkHomepageCodec, t.null, t.undefined]),
  child: t.union([t.string, t.null, t.undefined]),
  backgroundImage: t.union([t.string, t.null, t.undefined, ImageBlockCodec]),
});

const MediaCodec = t.strict({
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
        links: t.array(LinkHomepageCodec),
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
        populate: ['backgroundImage'],
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
