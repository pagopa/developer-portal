import * as t from 'io-ts/lib';
import * as qs from 'qs';
import { fetchFromStrapi } from './fetchFromStrapi';
import { PaginationCodec } from './codecs/PaginationCodec';
import { GuideCodec } from './codecs/GuideCodec';

export const StrapiGuidesCodec = t.strict({
  data: t.array(GuideCodec),
  meta: PaginationCodec,
});

export type StrapiGuides = t.TypeOf<typeof StrapiGuidesCodec>;

const makeStrapiGuidesPopulate = () =>
  qs.stringify({
    populate: '*',
  });

export const fetchGuides = fetchFromStrapi(
  'guides',
  makeStrapiGuidesPopulate(),
  StrapiGuidesCodec
);
