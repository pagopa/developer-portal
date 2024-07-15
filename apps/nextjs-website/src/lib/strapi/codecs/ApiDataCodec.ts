import * as t from 'io-ts/lib';
import { MediaCodec } from './MediaCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import { fetchFromStrapi } from '../fetchFromStrapi';
import qs from 'qs';

const UrlCodec = t.strict({
  id: t.number,
  name: t.union([NullToUndefinedCodec, t.string]),
  url: t.string,
  hideTryIt: t.boolean,
});

export const ApiDataCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    title: t.string,
    description: t.union([NullToUndefinedCodec, t.string]),
    icon: t.strict({ data: t.union([NullToUndefinedCodec, MediaCodec]) }),
    apiRestDetail: t.union([
      NullToUndefinedCodec,
      t.strict({
        slug: t.string,
        specUrls: t.array(UrlCodec),
      }),
    ]),
    apiSoapUrl: t.union([NullToUndefinedCodec, t.string]),
  }),
});

export const StrapiApiDataCodec = t.strict({
  data: t.array(ApiDataCodec),
});

export type StrapiApiData = t.TypeOf<typeof StrapiApiDataCodec>;

const makeStrapiApiDataPopulate = () =>
  qs.stringify({
    populate: {
      apiRestDetail: {
        populate: ['slug', 'specUrls'],
      },
      icon: { populate: '*' },
    },
  });

export const fetchApiData = fetchFromStrapi(
  'apis-data',
  makeStrapiApiDataPopulate(),
  StrapiApiDataCodec
);
