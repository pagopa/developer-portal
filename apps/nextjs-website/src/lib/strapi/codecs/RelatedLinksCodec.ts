import * as t from 'io-ts/lib';
import { LinkCodec } from './LinkCodec';

export const RelatedLinksCodec = t.type({
  title: t.string,
  links: t.array(LinkCodec),
});
