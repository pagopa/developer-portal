import * as t from 'io-ts/lib';
import * as tt from 'io-ts-types';
import { DateFromISOString } from 'io-ts-types/lib/DateFromISOString';
import { MediaCodec } from './MediaCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import { BlocksContentCodec } from './BlocksContentCodec';
import { ProductCodec } from './ProductCodec';
import { RelatedLinksCodec } from './RelatedLinksCodec';
import { PartCodec } from './PartCodec';
import { PaginationCodec } from './PaginationCodec';

const BannerLinkCodec = t.strict({
  id: t.number,
  title: t.union([NullToUndefinedCodec, t.string]),
  content: t.union([NullToUndefinedCodec, BlocksContentCodec]),
});

const BaseTutorialAttributesCodec = t.strict({
  title: t.string,
  slug: t.string,
  publishedAt: t.union([NullToUndefinedCodec, tt.DateFromISOString]),
  image: t.strict({ data: t.union([NullToUndefinedCodec, MediaCodec]) }),
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
    }),
  ]),
});

export const StrapiTutorialsCodec = t.strict({
  data: t.array(TutorialCodec),
  meta: PaginationCodec,
});

export type StrapiTutorials = t.TypeOf<typeof StrapiTutorialsCodec>;
