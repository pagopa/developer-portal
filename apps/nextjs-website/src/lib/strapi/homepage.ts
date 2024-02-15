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

const CtaCodec = t.strict({
  label: t.string,
  href: t.string,
  variant: t.union([
    t.undefined,
    t.literal('text'),
    t.literal('contained'),
    t.literal('outlined'),
  ]),
});

const CtaSlideCodec = t.strict({
  title: t.string,
  color: t.union([t.string, t.undefined]),
  cta: t.union([CtaCodec, t.undefined]),
  child: t.union([t.string, t.undefined]),
  backgroundImage: t.union([t.string, t.undefined]),
});

export const StrapiHomepageCodec = t.strict({
  data: t.strict({
    id: t.number,
    attributes: t.strict({
      comingsoonDocumentation: t.type({
        title: t.string,
        links: t.array(LinkHomepageCodec),
      }),
      hero: t.type({
        siteTitle: t.string,
        boldTitle: t.string,
        cards: t.array(CtaSlideCodec),
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
        populate: ['boldTitle', 'siteTitle', 'cards'],
      },
    },
  });

export const fetchHomepage = fetchFromStrapi(
  'homepage',
  makeStrapiHomepagePopulate(),
  StrapiHomepageCodec
);
