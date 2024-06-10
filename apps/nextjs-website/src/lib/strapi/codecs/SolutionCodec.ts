import * as t from 'io-ts/lib';
import { MediaCodec } from './MediaCodec';
import { WebinarCodec } from '../webinars';
import { ProductCodec } from './ProductCodec';
import { BannerLinkCodec } from './BannerLinkCodec';
import { SolutionStepCodec } from './SolutionStepCodec';
import { SolutionStatCodec } from './SolutionStatCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';

export const SolutionCodec = t.strict({
  attributes: t.strict({
    slug: t.string,
    icon: t.strict({ data: MediaCodec }),
    kickerTitle: t.string,
    title: t.string,
    description: t.union([NullToUndefinedCodec, t.string]),
    step: t.array(SolutionStepCodec),
    dirName: t.string,
    landingUseCaseFile: t.string,
    stats: t.array(SolutionStatCodec),
    webinars: t.strict({ data: t.array(WebinarCodec) }),
    products: t.strict({ data: t.array(ProductCodec) }),
    bannerLinks: t.array(BannerLinkCodec),
  }),
});
