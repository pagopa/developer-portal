import * as t from 'io-ts/lib';
import * as tt from 'io-ts-types';
import { ProductCodec } from '@/lib/strapi/codecs/ProductCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import { PaginationCodec } from '@/lib/strapi/codecs/PaginationCodec';
import { BannerLinkCodec } from '@/lib/strapi/codecs/BannerLinkCodec';
import { SEOCodec } from './SeoCodec';

export const ReleaseNoteCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    bannerLinks: t.array(BannerLinkCodec),
    createdAt: tt.DateFromISOString,
    dirName: t.string,
    landingFile: t.string,
    product: t.strict({ data: ProductCodec }),
    publishedAt: tt.DateFromISOString,
    seo: t.union([NullToUndefinedCodec, SEOCodec]),
    title: t.string,
    updatedAt: tt.DateFromISOString,
  }),
});

export const ReleaseNotesCodec = t.strict({
  data: t.array(ReleaseNoteCodec),
  meta: PaginationCodec,
});

export type StrapiReleaseNotes = t.TypeOf<typeof ReleaseNotesCodec>;
