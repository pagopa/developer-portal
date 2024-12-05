import * as t from 'io-ts/lib';
import { LinkCodec } from './LinkCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';

export const RelatedLinksCodec = t.type({
  title: t.union([NullToUndefinedCodec, t.string]),
  links: t.array(LinkCodec),
});
