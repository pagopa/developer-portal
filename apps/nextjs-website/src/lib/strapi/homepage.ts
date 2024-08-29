import * as t from 'io-ts/lib';
import * as tt from 'io-ts-types';
import * as qs from 'qs';
import { fetchFromStrapi } from './fetchFromStrapi';
import { BlocksContentCodec } from './codecs/BlocksContentCodec';
import { NullToUndefinedCodec } from './codecs/NullToUndefinedCodec';
import { RelatedLinksCodec } from './codecs/RelatedLinksCodec';
import { MediaCodec } from './codecs/MediaCodec';
import { LinkCodec } from './codecs/LinkCodec';
import { WebinarCodec, webinarPopulate } from './webinars';
import { ProductCodec } from './codecs/ProductCodec';
import { SolutionBaseAttributesCodec } from './codecs/SolutionCodec';
import { SEOCodec } from './seoCodec';

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
    image: t.strict({ data: t.union([NullToUndefinedCodec, MediaCodec]) }),
  }),
});

export const StrapiHomepageCodec = t.strict({
  data: t.strict({
    attributes: t.strict({
      comingsoonDocumentation: RelatedLinksCodec,
      heroSlider: t.array(HeroSlideCodec),
      newsShowcase: t.union([
        NullToUndefinedCodec,
        t.strict({
          title: t.string,
          items: t.strict({
            data: t.array(NewsItemCodec),
          }),
        }),
      ]),
      ecosystem: t.union([
        NullToUndefinedCodec,
        t.strict({
          title: t.union([NullToUndefinedCodec, t.string]),
          productsTabName: t.string,
          products: t.strict({
            data: t.array(ProductCodec),
          }),
          solutionsTabName: t.string,
          solutions: t.strict({
            data: t.array(SolutionBaseAttributesCodec),
          }),
          solutionsCta: t.union([NullToUndefinedCodec, CallToActionCodec]),
        }),
      ]),
      webinars: t.strict({ data: t.array(WebinarCodec) }),
      seo: t.union([NullToUndefinedCodec, SEOCodec]),
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
      webinars: webinarPopulate,
      ecosystem: {
        populate: ['products.logo', 'solutions.icon', 'solutionsCta.link'],
      },
      seo: {
        populate: '*,metaImage,metaSocial.image',
      },
    },
  });

export const fetchHomepage = fetchFromStrapi(
  'homepage',
  makeStrapiHomepagePopulate(),
  StrapiHomepageCodec
);
