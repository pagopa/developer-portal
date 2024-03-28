import * as t from 'io-ts/lib';
import * as tt from 'io-ts-types';
import * as qs from 'qs';
import { fetchFromStrapi } from './fetchFromStrapi';
import { NullToUndefinedCodec } from './codecs/NullToUndefinedCodec';
import { BlocksContentCodec } from './codecs/BlocksContentCodec';
import { MediaCodec } from './codecs/MediaCodec';
import { RelatedLinksCodec } from './codecs/RelatedLinksCodec';

const WebinarSpeakerCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    name: t.string,
    jobTitle: t.string,
    description: t.union([NullToUndefinedCodec, BlocksContentCodec]),
    avatar: t.strict({ data: t.union([NullToUndefinedCodec, MediaCodec]) }),
    publishedAt: tt.DateFromISOString,
  }),
});

const WebinarCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    title: t.string,
    description: t.string,
    slug: t.string,
    publishedAt: tt.DateFromISOString,
    isVisibleInList: t.boolean,
    coverImage: t.strict({ data: MediaCodec }),
    textContent: t.union([NullToUndefinedCodec, BlocksContentCodec]),
    playerSrc: t.union([NullToUndefinedCodec, t.string]),
    startDatetime: t.union([NullToUndefinedCodec, tt.DateFromISOString]),
    endDatetime: t.union([NullToUndefinedCodec, tt.DateFromISOString]),
    subscribeParagraphLabel: t.union([NullToUndefinedCodec, t.string]),
    relatedLinks: t.union([NullToUndefinedCodec, RelatedLinksCodec]),
    webinarSpeakers: t.strict({ data: t.array(WebinarSpeakerCodec) }),
  }),
});

const PaginationCodec = t.strict({
  pagination: t.strict({
    page: t.number,
    pageSize: t.number,
    pageCount: t.number,
    total: t.number,
  }),
});

export const StrapiWebinarsCodec = t.strict({
  data: t.array(WebinarCodec),
  meta: PaginationCodec,
});

export type StrapiWebinars = t.TypeOf<typeof StrapiWebinarsCodec>;

const makeStrapiWebinarsPopulate = () =>
  qs.stringify({
    populate: {
      coverImage: {
        populate: ['image'],
      },
      webinarSpeakers: {
        populate: ['avatar'],
      },
      relatedLinks: {
        populate: ['links'],
      },
    },
  });

export const fetchWebinars = fetchFromStrapi(
  'webinars',
  makeStrapiWebinarsPopulate(),
  StrapiWebinarsCodec
);
