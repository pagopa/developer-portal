import * as t from 'io-ts/lib';
import * as qs from 'qs';
import { fetchFromStrapi } from './fetchFromStrapi';
import { DateFromISOString } from 'io-ts-types/lib/DateFromISOString';

const NullToUndefinedCodec = <C extends t.Mixed>(codec: C) =>
  t.union([codec, t.null, t.undefined]);

const BlocksContentCodec = t.array(
  t.strict({
    type: t.string,
    children: t.array(
      t.strict({
        type: t.string,
        text: t.string,
      })
    ),
  })
);

const BannerLinkCodec = t.strict({
  id: t.number,
  title: NullToUndefinedCodec(t.string),
  body: NullToUndefinedCodec(BlocksContentCodec),
});

const RelatedLinksCodec = t.strict({
  id: t.number,
  title: t.string,
});

const ProductCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    name: t.string,
    description: t.string,
    slug: t.string,
    createdAt: DateFromISOString,
    updatedAt: DateFromISOString,
    publishedAt: NullToUndefinedCodec(DateFromISOString),
    locale: t.string,
  }),
});

export const TutorialCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    title: t.string,
    slug: t.string,
    content: BlocksContentCodec,
    createdAt: DateFromISOString,
    updatedAt: DateFromISOString,
    publishedAt: NullToUndefinedCodec(DateFromISOString),
    locale: t.string,
    dirName: t.string,
    name: t.string,
    image: t.strict({ data: NullToUndefinedCodec(t.unknown) }),
    bannerLinks: t.array(BannerLinkCodec),
    relatedLinks: RelatedLinksCodec,
    product: t.strict({ data: ProductCodec }),
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

export const StrapiTutorialsCodec = t.strict({
  data: t.array(TutorialCodec),
  meta: PaginationCodec,
});

export type StrapiTutorials = t.TypeOf<typeof StrapiTutorialsCodec>;

const makeStrapiTutorialsPopulate = () =>
  qs.stringify({
    populate: 'image,bannerLinks,relatedLinks,product',
  });

export const fetchTutorials = fetchFromStrapi(
  'webinars',
  makeStrapiTutorialsPopulate(),
  StrapiTutorialsCodec
);
