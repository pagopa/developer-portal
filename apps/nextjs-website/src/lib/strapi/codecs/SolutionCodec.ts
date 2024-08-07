import * as t from 'io-ts/lib';
import { MediaCodec } from './MediaCodec';
import { WebinarCodec } from '../webinars';
import { ProductCodec } from './ProductCodec';
import { BannerLinkCodec } from './BannerLinkCodec';
import { SolutionStepCodec } from './SolutionStepCodec';
import { SolutionStatCodec } from './SolutionStatCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';

export const SolutionBaseAttributesCodec = t.strict({
  attributes: t.strict({
    slug: t.string,
    icon: t.strict({ data: MediaCodec }),
    kickerTitle: t.string,
    title: t.string,
    description: t.union([NullToUndefinedCodec, t.string]),
    dirName: t.string,
    landingUseCaseFile: t.string,
  }),
});

const SolutionRelationsCodec = t.strict({
  attributes: t.strict({
    webinars: t.strict({ data: t.array(WebinarCodec) }),
    products: t.strict({ data: t.array(ProductCodec) }),
    bannerLinks: t.array(BannerLinkCodec),
    steps: t.array(SolutionStepCodec),
    stats: t.array(SolutionStatCodec),
  }),
});

export const SolutionCodec = t.intersection([
  SolutionBaseAttributesCodec,
  SolutionRelationsCodec,
]);
