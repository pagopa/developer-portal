import * as t from 'io-ts/lib';
import { PaginationCodec } from './PaginationCodec';
import { MediaCodec } from '@/lib/strapi/codecs/MediaCodec';
import { BaseProductCodec } from '@/lib/strapi/codecs/ProductCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import { SEOCodec } from './SeoCodec';

const VersionCodec = t.strict({
  main: t.boolean,
  dirName: t.string,
  version: t.string,
});

const BaseGuideAttributesCodec = t.strict({
  title: t.string,
  slug: t.string,
  image: t.strict({ data: MediaCodec }),
  mobileImage: t.strict({ data: MediaCodec }),
  listItems: t.array(
    t.strict({
      text: t.string,
    })
  ),
});

export const BaseGuideCodec = t.strict({
  attributes: BaseGuideAttributesCodec,
});

export const GuideCodec = t.strict({
  attributes: t.intersection([
    BaseGuideAttributesCodec,
    t.strict({
      versions: t.array(VersionCodec),
      product: t.strict({ data: BaseProductCodec }),
      seo: t.union([NullToUndefinedCodec, SEOCodec]),
    }),
  ]),
});

export const GuidesCodec = t.strict({
  data: t.array(GuideCodec),
  meta: PaginationCodec,
});

export type StrapiGuides = t.TypeOf<typeof GuidesCodec>;
