import * as t from 'io-ts/lib';
import * as tt from 'io-ts-types';
import * as qs from 'qs';
import { fetchFromStrapi } from './fetchFromStrapi';
import { PaginationCodec } from './codecs/PaginationCodec';
import { ProductCodec } from './codecs/ProductCodec';
import { PartCodec } from './codecs/PartCodec';

const QuickStartItemCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    title: t.string,
    anchor: t.string,
    publishedAt: tt.DateFromISOString,
    parts: t.array(PartCodec),
  }),
});

export const QuickStartCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    title: t.string,
    description: t.string,
    product: t.strict({ data: ProductCodec }),
    quickstartGuideItems: t.strict({ data: t.array(QuickStartItemCodec) }),
  }),
});

export const StrapiQuickStartsCodec = t.strict({
  data: t.array(QuickStartCodec),
  meta: PaginationCodec,
});

export type StrapiQuickStarts = t.TypeOf<typeof StrapiQuickStartsCodec>;

const makeStrapiQuickStartsPopulate = () =>
  qs.stringify({
    populate: {
      quickstartGuideItems: {
        populate:
          'parts.responseCode,parts.requestCode,parts.requestAttributes',
      },
      product: { populate: 'logo' },
    },
  });

export const fetchQuickStarts = fetchFromStrapi(
  'quickstart-guides',
  makeStrapiQuickStartsPopulate(),
  StrapiQuickStartsCodec
);
