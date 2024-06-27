import * as t from 'io-ts/lib';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';

export const SolutionStatCodec = t.strict({
  title: t.string,
  description: t.union([NullToUndefinedCodec, t.string]),
});
