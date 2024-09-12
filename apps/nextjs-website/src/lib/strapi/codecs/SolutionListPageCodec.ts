import * as t from 'io-ts/lib';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import { SolutionCodec } from './SolutionsCodec';
import { FeaturesCodec } from './FeaturesCodec';
import { CaseHistoriesComponentCodec } from '@/lib/strapi/codecs/CaseHistoriesComponentCodec';
import { SEOCodec } from './SeoCodec';

export const SolutionListPageCodec = t.strict({
  data: t.strict({
    attributes: t.strict({
      title: t.string,
      description: t.string,
      caseHistories: t.union([
        NullToUndefinedCodec,
        CaseHistoriesComponentCodec,
      ]),
      solutions: t.strict({
        data: t.array(SolutionCodec),
      }),
      features: t.union([NullToUndefinedCodec, FeaturesCodec]),
      seo: t.union([NullToUndefinedCodec, SEOCodec]),
    }),
  }),
});

export type StrapiSolutionListPage = t.TypeOf<typeof SolutionListPageCodec>;
