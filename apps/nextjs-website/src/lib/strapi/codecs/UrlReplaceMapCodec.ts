import * as t from 'io-ts/lib';
import { GuideCodec } from './GuidesCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';

const UrlToGuideCodec = t.strict({
  id: t.number,
  url: t.string,
  version: t.union([NullToUndefinedCodec, t.string]),
  guide: t.strict({
    data: t.union([NullToUndefinedCodec, GuideCodec]),
  }),
});

export const UrlReplaceMapCodec = t.strict({
  data: t.strict({
    attributes: t.strict({
      urlToGuide: t.array(UrlToGuideCodec),
    }),
  }),
});

export type UrlReplaceMap = t.TypeOf<typeof UrlReplaceMapCodec>;
