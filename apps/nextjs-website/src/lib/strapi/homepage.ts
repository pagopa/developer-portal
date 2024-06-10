import * as t from 'io-ts/lib';
import * as tt from 'io-ts-types';
import * as qs from 'qs';
import { fetchFromStrapi } from './fetchFromStrapi';
import { BlocksContentCodec } from './codecs/BlocksContentCodec';
import { NullToUndefinedCodec } from './codecs/NullToUndefinedCodec';
import { RelatedLinksCodec } from './codecs/RelatedLinksCodec';
import { MediaCodec } from './codecs/MediaCodec';
import { LinkCodec } from './codecs/LinkCodec';
import { WebinarCodec } from './webinars';
import { ProductCodec } from './codecs/ProductCodec';
import { SolutionCodec } from './codecs/SolutionCodec';

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
      comingsoonDocumentation: RelatedLinksCodec,
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
      ecosystem: t.strict({
        title: t.string,
        productsTabName: t.string,
        products: t.strict({
          data: t.array(ProductCodec),
        }),
        solutionsTabName: t.string,
        solutions: t.strict({
          data: t.array(SolutionCodec),
        }),
        solutionsCta: t.union([NullToUndefinedCodec, CallToActionCodec]),
      }),
      webinars: t.strict({ data: t.array(WebinarCodec) }),
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
      webinars: {
        populate: [
          'coverImage.image',
          'relatedLinks.links',
          'webinarSpeakers.avatar',
        ],
      },
      ecosystem: {
        populate: [
          'products.logo',
          'solutions.icon',
          'solutions.step',
          'solutions.step.products',
          'solutions.stats',
          'solutions.webinars',
          'solutions.webinars.coverImage.image',
          'solutions.webinars.relatedLinks.link',
          'solutions.webinars.webinarSpeakers.avatar',
          'solutions.bannerLinks',
          'solutions.bannerLinks.icon',
          'solutions.products',
          'solutions.products.logo',
          'solutionsCta.link',
        ],
      },
    },
  });

export const fetchHomepage = fetchFromStrapi(
  'homepage',
  makeStrapiHomepagePopulate(),
  StrapiHomepageCodec
);
