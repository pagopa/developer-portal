import * as t from 'io-ts/lib';
import { MediaCodec } from './MediaCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import { SEOCodec } from './SeoCodec';
import { BaseProductCodec } from './ProductCodec';

const UrlCodec = t.strict({
  id: t.number,
  name: t.union([NullToUndefinedCodec, t.string]),
  url: t.string,
  hideTryIt: t.boolean,
});

const BaseApiDataAttributesCodec = t.strict({
  title: t.string,
  description: t.union([NullToUndefinedCodec, t.string]),
  icon: t.strict({ data: t.union([NullToUndefinedCodec, MediaCodec]) }),
  apiRestDetail: t.union([
    NullToUndefinedCodec,
    t.strict({
      slug: t.string,
      specUrls: t.array(UrlCodec),
    }),
  ]),
  apiSoapUrl: t.union([NullToUndefinedCodec, t.string]),
});

const BaseApiDataCodec = t.strict({
  id: t.number,
  attributes: BaseApiDataAttributesCodec,
});

const ApiDataCodec = t.strict({
  id: t.number,
  attributes: t.intersection([
    BaseApiDataAttributesCodec,
    t.strict({
      product: t.strict({ data: BaseProductCodec }),
      seo: t.union([NullToUndefinedCodec, SEOCodec]),
    }),
  ]),
});

export const ApiDataListCodec = t.strict({
  data: t.array(ApiDataCodec),
});

export const BaseApiDataListCodec = t.strict({
  data: t.array(BaseApiDataCodec),
});

export type StrapiApiDataList = t.TypeOf<typeof ApiDataListCodec>;
