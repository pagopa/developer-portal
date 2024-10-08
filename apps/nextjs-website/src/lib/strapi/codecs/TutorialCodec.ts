import * as t from 'io-ts/lib';
import * as tt from 'io-ts-types';
import { DateFromISOString } from 'io-ts-types/lib/DateFromISOString';
import { MediaCodec } from './MediaCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import { BannerLinkCodec } from '@/lib/strapi/codecs/BannerLinkCodec';
import { BaseProductCodec, ProductCodec } from './ProductCodec';
import { RelatedLinksCodec } from './RelatedLinksCodec';
import { PartCodec } from './PartCodec';
import { PaginationCodec } from './PaginationCodec';
import { SEOCodec } from './SeoCodec';

const BaseTutorialAttributesCodec = t.strict({
  title: t.string,
  slug: t.string,
  publishedAt: t.union([NullToUndefinedCodec, tt.DateFromISOString]),
  image: t.strict({ data: t.union([NullToUndefinedCodec, MediaCodec]) }),
  product: t.strict({ data: BaseProductCodec }),
});

export const BaseTutorialCodec = t.strict({
  attributes: BaseTutorialAttributesCodec,
});

export const TutorialCodec = t.strict({
  attributes: t.intersection([
    BaseTutorialAttributesCodec,
    t.strict({
      parts: t.array(PartCodec),
      createdAt: DateFromISOString,
      updatedAt: DateFromISOString,
      locale: t.string,
      bannerLinks: t.union([NullToUndefinedCodec, t.array(BannerLinkCodec)]),
      relatedLinks: t.union([NullToUndefinedCodec, RelatedLinksCodec]),
      product: t.strict({ data: ProductCodec }),
      seo: t.union([NullToUndefinedCodec, SEOCodec]),
    }),
  ]),
});

export const TutorialsCodec = t.strict({
  data: t.array(TutorialCodec),
  meta: PaginationCodec,
});

export type StrapiTutorials = t.TypeOf<typeof TutorialsCodec>;
