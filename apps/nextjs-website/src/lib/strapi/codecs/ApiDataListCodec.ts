import * as t from 'io-ts/lib';
import { MediaCodec } from './MediaCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';

const UrlCodec = t.strict({
  id: t.number,
  name: t.union([NullToUndefinedCodec, t.string]),
  url: t.string,
  hideTryIt: t.boolean,
});

const ApiDataCodec = t.strict({
  id: t.number,
  attributes: t.strict({
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
  }),
});

export const ApiDataListCodec = t.strict({
  data: t.array(ApiDataCodec),
});

export type StrapiApiDataList = t.TypeOf<typeof ApiDataListCodec>;