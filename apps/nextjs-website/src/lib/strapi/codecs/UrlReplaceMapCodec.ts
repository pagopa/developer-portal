import * as t from 'io-ts/lib';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';

const CustomGuideCodec = t.strict({
  attributes: t.strict({
    title: t.string,
    slug: t.string,
    product: t.strict({
      data: t.strict({
        attributes: t.strict({
          slug: t.string,
        }),
      }),
    }),
  }),
});
const UrlToGuideCodec = t.strict({
  id: t.number,
  url: t.string,
  subPath: t.union([NullToUndefinedCodec, t.string]),
  guide: t.strict({
    data: t.union([NullToUndefinedCodec, CustomGuideCodec]),
  }),
});

export const UrlReplaceMapCodec = t.strict({
  data: t.strict({
    attributes: t.strict({
      urlToGuide: t.array(UrlToGuideCodec),
    }),
  }),
});

export type StrapiUrlReplaceMap = t.TypeOf<typeof UrlReplaceMapCodec>;
