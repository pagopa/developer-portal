import * as t from 'io-ts/lib';
import * as tt from 'io-ts-types';
import * as qs from 'qs';
import { fetchFromStrapi } from './fetchFromStrapi';
import { NullToUndefinedCodec } from './codecs/NullToUndefinedCodec';
import { MediaCodec } from './codecs/MediaCodec';
import { PaginationCodec } from './codecs/PaginationCodec';
import { ProductCodec } from './codecs/ProductCodec';
import { BlocksContentCodec } from './codecs/BlocksContentCodec';
import { BannerLinkCodec } from './codecs/BannerLinkCodec';
import { WebinarCodec } from './webinars';

const StepCodec = t.strict({
  title: t.string,
  content: BlocksContentCodec,
  products: t.strict({
    data: t.array(ProductCodec),
  }),
});

const StatCodec = t.strict({
  title: t.string,
  description: t.union([NullToUndefinedCodec, t.string]),
});

export const SolutionCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    slug: t.string,
    kickerTitle: t.string,
    title: t.string,
    description: t.union([NullToUndefinedCodec, t.string]),
    dirName: t.string,
    landingUseCaseFile: t.string,
    publishedAt: tt.DateFromISOString,
    icon: t.strict({ data: MediaCodec }),
    steps: t.array(StepCodec),
    stats: t.array(StatCodec),
    bannerLinks: t.array(BannerLinkCodec),
    webinars: t.strict({
      data: t.array(WebinarCodec),
    }),
    products: t.strict({
      data: t.array(ProductCodec),
    }),
  }),
});

export const StrapiSolutionsCodec = t.strict({
  data: t.array(SolutionCodec),
  meta: PaginationCodec,
});

export type StrapiSolutions = t.TypeOf<typeof StrapiSolutionsCodec>;

const makeStrapiSolutionsPopulate = () =>
  qs.stringify({
    populate: {
      icon: 'icon',
      stats: '*',
      steps: {
        populate: {
          products: '*',
        },
      },
      products: {
        populate: ['logo'],
      },
      bannerLinks: {
        populate: ['icon'],
      },
      webinars: {
        populate: ['coverImage', 'webinarSpeakers.avatar'],
      },
    },
  });

export const fetchSolutions = fetchFromStrapi(
  'solutions',
  makeStrapiSolutionsPopulate(),
  StrapiSolutionsCodec
);
