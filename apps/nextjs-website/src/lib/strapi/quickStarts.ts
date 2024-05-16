import * as t from 'io-ts/lib';
import * as tt from 'io-ts-types';
import * as qs from 'qs';
import { fetchFromStrapi } from './fetchFromStrapi';
import { NullToUndefinedCodec } from './codecs/NullToUndefinedCodec';
import { PaginationCodec } from './codecs/PaginationCodec';
import { ProductCodec } from './codecs/ProductCodec';
import { BlocksContentCodec } from './codecs/BlocksContentCodec';

const HtmlPartCodec = t.strict({
  html: BlocksContentCodec,
});

const EmbedHtmlPartCodec = t.strict({
  html: t.string,
});

const CodeBlockPartCodec = t.strict({
  code: t.string,
  language: t.union([t.string, NullToUndefinedCodec]),
  showLineNumbers: t.union([t.boolean, NullToUndefinedCodec]),
});

const AlertPartCodec = t.strict({
  text: t.union([t.string, NullToUndefinedCodec]),
  title: t.union([t.string, NullToUndefinedCodec]),
  severity: t.union([
    t.literal('success'),
    t.literal('info'),
    t.literal('warning'),
    t.literal('error'),
  ]),
});

const ApiTesterAttributeCodec = t.strict({
  label: t.union([t.string, NullToUndefinedCodec]),
  value: t.string,
});

const ApiTesterPartCodec = t.strict({
  requestDescription: t.string,
  requestAttributes: t.array(ApiTesterAttributeCodec),
  requestCode: CodeBlockPartCodec,
  responseDescription: t.string,
  responseCode: CodeBlockPartCodec,
});

const PartCodec = t.union([
  t.intersection([
    AlertPartCodec,
    t.type({ __component: t.literal('parts.alert') }),
  ]),
  t.intersection([
    ApiTesterPartCodec,
    t.type({ __component: t.literal('parts.api-tester') }),
  ]),
  t.intersection([
    CodeBlockPartCodec,
    t.type({ __component: t.literal('parts.code-block') }),
  ]),
  t.intersection([
    HtmlPartCodec,
    t.type({ __component: t.literal('parts.html') }),
  ]),
  t.intersection([
    EmbedHtmlPartCodec,
    t.type({ __component: t.literal('parts.embed-html') }),
  ]),
]);

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
    description: t.union([NullToUndefinedCodec, BlocksContentCodec]),
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
