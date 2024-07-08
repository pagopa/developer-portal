import * as t from 'io-ts/lib';
import { MediaCodec } from './MediaCodec';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import { fetchFromStrapi } from '../fetchFromStrapi';
import qs from 'qs';

const UrlCodec = t.strict({
  id: t.number,
  url: t.string,
});

export const ApiDataCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    title: t.string,
    description: t.union([NullToUndefinedCodec, t.string]),
    icon: t.strict({ data: t.union([NullToUndefinedCodec, MediaCodec]) }),
    slug: t.string,
    specUrls: t.array(UrlCodec),
    tag: t.union([NullToUndefinedCodec, t.string]),
  }),
});

export const ApisDataCodec = t.strict({
  data: t.array(ApiDataCodec),
});

export type ApiDataPages = t.TypeOf<typeof ApisDataCodec>;

const makeApisDataPagePopulate = () =>
  qs.stringify({
    populate: ['specUrls', 'icon'],
  });

export const fetchApisDataPages = fetchFromStrapi(
  'apis-data',
  makeApisDataPagePopulate(),
  ApisDataCodec
);
