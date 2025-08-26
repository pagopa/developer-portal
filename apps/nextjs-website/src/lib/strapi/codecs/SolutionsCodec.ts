import * as t from 'io-ts/lib';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import { MediaCodec } from './MediaCodec';

const BaseSolutionAttributesCodec = t.strict({
  slug: t.string,
  icon: t.strict({ data: MediaCodec }),
  kickerTitle: t.string,
  title: t.string,
  description: t.union([NullToUndefinedCodec, t.string]),
  dirName: t.string,
  landingUseCaseFile: t.string,
});

export const BaseSolutionCodec = t.strict({
  attributes: BaseSolutionAttributesCodec,
});
