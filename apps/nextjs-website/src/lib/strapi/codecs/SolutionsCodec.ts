import * as t from 'io-ts/lib';
import * as tt from 'io-ts-types';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import { MediaCodec } from './MediaCodec';
import { PaginationCodec } from './PaginationCodec';
import { BaseProductCodec, ProductCodec } from './ProductCodec';
import { BlocksContentCodec } from './BlocksContentCodec';
import { BannerLinkCodec } from './BannerLinkCodec';
import { WebinarCodec } from './WebinarsCodec';
import { CaseHistoriesComponentCodec } from '@/lib/strapi/codecs/CaseHistoriesComponentCodec';
import { SEOCodec } from './SeoCodec';

const StepCodec = t.strict({
  title: t.string,
  content: BlocksContentCodec,
  products: t.strict({
    data: t.array(BaseProductCodec),
  }),
});

const StatCodec = t.strict({
  title: t.string,
  description: t.union([NullToUndefinedCodec, t.string]),
});

const BaseSolutionAttributesCodec = t.strict({
  slug: t.string,
  icon: t.strict({ data: MediaCodec }),
  kickerTitle: t.string,
  title: t.string,
  description: t.union([NullToUndefinedCodec, t.string]),
  dirName: t.string,
  landingUseCaseFile: t.string,
});

export const BaseSolutionCodec = t.strict({
  attributes: BaseSolutionAttributesCodec,
});

export const SolutionCodec = t.strict({
  id: t.number,
  attributes: t.intersection([
    BaseSolutionAttributesCodec,
    t.strict({
      publishedAt: tt.DateFromISOString,
      introductionToSteps: t.union([NullToUndefinedCodec, t.string]),
      steps: t.array(StepCodec),
      stats: t.array(StatCodec),
      bannerLinks: t.array(BannerLinkCodec),
      webinars: t.strict({
        data: t.array(WebinarCodec),
      }),
      products: t.strict({
        data: t.array(ProductCodec),
      }),
      caseHistories: t.union([
        NullToUndefinedCodec,
        CaseHistoriesComponentCodec,
      ]),
      seo: t.union([NullToUndefinedCodec, SEOCodec, t.undefined]),
    }),
  ]),
});

export const SolutionsCodec = t.strict({
  data: t.array(SolutionCodec),
  meta: PaginationCodec,
});

export type StrapiSolutions = t.TypeOf<typeof SolutionsCodec>;
