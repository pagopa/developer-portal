import * as t from 'io-ts/lib';
import { BlocksContentCodec } from './BlocksContentCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import { RelatedLinksCodec } from './RelatedLinksCodec';
import { MediaCodec } from './MediaCodec';
import { LinkCodec } from './LinkCodec';
import { WebinarCodec } from './WebinarsCodec';
import { ProductCodec } from './ProductCodec';
import { SEOCodec } from './SeoCodec';
import { BaseSolutionCodec } from './SolutionsCodec';
import { NewsShowcaseCodec } from '@/lib/strapi/codecs/NewsShowcaseCodec';

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

export const HomepageCodec = t.strict({
  data: t.strict({
    attributes: t.strict({
      comingsoonDocumentation: RelatedLinksCodec,
      heroSlider: t.array(HeroSlideCodec),
      newsShowcase: t.union([NullToUndefinedCodec, NewsShowcaseCodec]),
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
            data: t.array(BaseSolutionCodec),
          }),
          solutionsCta: t.union([NullToUndefinedCodec, CallToActionCodec]),
        }),
      ]),
      webinars: t.strict({ data: t.array(WebinarCodec) }),
      seo: t.union([NullToUndefinedCodec, SEOCodec]),
    }),
  }),
});

export type StrapiHomepage = t.TypeOf<typeof HomepageCodec>;
