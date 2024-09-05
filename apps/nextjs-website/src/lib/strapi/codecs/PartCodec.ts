import * as t from 'io-ts/lib';
import { NullToUndefinedCodec } from './NullToUndefinedCodec';
import { BlocksContentCodec } from './BlocksContentCodec';
import { MediaCodec } from './MediaCodec';
import { Part } from '@/lib/types/part';

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

const QuotePartCodec = t.strict({
  text: t.string,
  backgroundImage: t.strict({
    data: t.union([NullToUndefinedCodec, MediaCodec]),
  }),
});

const CKEditorPartCodec = t.strict({
  content: t.string,
});

export const PartCodec = t.union([
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
  t.intersection([
    QuotePartCodec,
    t.type({ __component: t.literal('parts.quote') }),
  ]),
  t.intersection([
    CKEditorPartCodec,
    t.type({ __component: t.literal('parts.ck-editor') }),
  ]),
]);

export type StrapiPart = t.TypeOf<typeof PartCodec>;

export function partFromStrapiPart(part: StrapiPart): Part | null {
  switch (part.__component) {
    case 'parts.alert':
      return {
        component: 'alert',
        ...part,
      };
    case 'parts.api-tester':
      return {
        component: 'apiTester',
        apiRequest: {
          ...part.requestCode,
          description: part.requestDescription,
          attributes: part.requestAttributes,
        },
        apiResponse: {
          ...part.responseCode,
          description: part.responseDescription,
        },
      };
    case 'parts.code-block':
      return {
        component: 'codeBlock',
        ...part,
      };
    case 'parts.html':
      return {
        component: 'blockRenderer',
        ...part,
      };
    case 'parts.embed-html':
      return {
        component: 'innerHTMLLazyLoaded',
        ...part,
      };
    case 'parts.quote':
      return {
        component: 'quote',
        quote: part.text,
        backgroundImage: part.backgroundImage.data?.attributes,
      };
    default:
      return null;
  }
}
