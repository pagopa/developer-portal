import * as t from 'io-ts/lib';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';

export const LinkCodec = t.strict({
  text: t.string,
  href: t.string,
  target: t.union([
    NullToUndefinedCodec,
    t.literal('_self'),
    t.literal('_blank'),
    t.literal('_parent'),
    t.literal('_top'),
  ]),
});
