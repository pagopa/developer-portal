import * as t from 'io-ts/lib';
import * as tt from 'io-ts-types';
import * as qs from 'qs';
import { fetchFromStrapi } from './fetchFromStrapi';
import { NullToUndefinedCodec } from './codecs/NullToUndefinedCodec';
import { BlocksContentCodec } from './codecs/BlocksContentCodec';
import { MediaCodec } from './codecs/MediaCodec';
import { RelatedLinksCodec } from './codecs/RelatedLinksCodec';
import { PaginationCodec } from './codecs/PaginationCodec';

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

const Resource = t.strict({
  title: t.string,
  subtitle: t.union([NullToUndefinedCodec, t.string]),
  description: t.union([NullToUndefinedCodec, BlocksContentCodec]),
  linkText: t.string,
  linkHref: t.string,
  image: t.strict({ data: t.union([NullToUndefinedCodec, MediaCodec]) }),
});

const RelatedResources = t.strict({
  title: t.string,
  resources: t.union([NullToUndefinedCodec, t.array(Resource)]),
  downloadableDocuments: t.strict({
    data: t.union([NullToUndefinedCodec, t.array(MediaCodec)]),
  }),
});

const QuestionAndAnswerCodec = t.strict({
  question: t.string,
  answer: BlocksContentCodec,
});

export const WebinarCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    title: t.string,
    description: t.string,
    slug: t.string,
    publishedAt: tt.DateFromISOString,
    isVisibleInList: t.boolean,
    coverImage: t.strict({ data: MediaCodec }),
    bodyContent: t.union([NullToUndefinedCodec, BlocksContentCodec]),
    playerSrc: t.union([NullToUndefinedCodec, t.string]),
    startDatetime: t.union([NullToUndefinedCodec, tt.DateFromISOString]),
    endDatetime: t.union([NullToUndefinedCodec, tt.DateFromISOString]),
    subscribeParagraphLabel: t.union([NullToUndefinedCodec, t.string]),
    relatedLinks: t.union([
      NullToUndefinedCodec,
      RelatedLinksCodec,
      t.undefined,
    ]),
    relatedResources: t.union([NullToUndefinedCodec, RelatedResources]),
    webinarSpeakers: t.strict({ data: t.array(WebinarSpeakerCodec) }),
    questionsAndAnswers: t.array(QuestionAndAnswerCodec),
  }),
});

export const StrapiWebinarsCodec = t.strict({
  data: t.array(WebinarCodec),
  meta: PaginationCodec,
});

export type StrapiWebinars = t.TypeOf<typeof StrapiWebinarsCodec>;

export const webinarPopulate = {
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
    relatedResources: {
      populate: {
        resources: {
          populate: ['image'],
        },
        downloadableDocuments: {
          populate: '*',
        },
      },
    },
    questionsAndAnswers: '*',
  },
};

const makeStrapiWebinarsPopulate = () => qs.stringify(webinarPopulate);

export const fetchWebinars = fetchFromStrapi(
  'webinars',
  makeStrapiWebinarsPopulate(),
  StrapiWebinarsCodec
);
