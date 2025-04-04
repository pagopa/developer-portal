import * as t from 'io-ts/lib';
import { type BlocksContent } from '@strapi/blocks-react-renderer';
import { MediaAttributesCodec } from './MediaCodec';

const TextInlineNodeCodec = t.intersection([
  t.strict({
    type: t.literal('text'),
    text: t.string,
  }),
  t.partial({
    bold: t.boolean,
    italic: t.boolean,
    underline: t.boolean,
    strikethrough: t.boolean,
    code: t.boolean,
  }),
]);

const LinkInlineNodeCodec = t.strict({
  type: t.literal('link'),
  url: t.string,
  children: t.array(TextInlineNodeCodec),
});

const DefaultInlineNodeCodec = t.union([
  TextInlineNodeCodec,
  LinkInlineNodeCodec,
]);

const ListItemInlineNodeCodec = t.strict({
  type: t.literal('list-item'),
  children: t.array(DefaultInlineNodeCodec),
});

const ParagraphBlockNodeCodec = t.strict({
  type: t.literal('paragraph'),
  children: t.array(DefaultInlineNodeCodec),
});

const QuoteBlockNodeCodec = t.strict({
  type: t.literal('quote'),
  children: t.array(DefaultInlineNodeCodec),
});

const CodeBlockNodeCodec = t.strict({
  type: t.literal('code'),
  children: t.array(DefaultInlineNodeCodec),
});

const HeadingBlockNodeCodec = t.strict({
  type: t.literal('heading'),
  level: t.union([
    t.literal(1),
    t.literal(2),
    t.literal(3),
    t.literal(4),
    t.literal(5),
    t.literal(6),
  ]),
  children: t.array(DefaultInlineNodeCodec),
});

// We need the any type here because of the recursive nature of the codec.
const ListBlockNodeCodec: any = t.type({
  type: t.literal('list'),
  format: t.union([t.literal('ordered'), t.literal('unordered')]),
  children: t.array(
    t.union([
      ListItemInlineNodeCodec,
      t.recursion('ListBlockNodeCodec', () => t.unknown),
    ])
  ),
});

const ImageBlockChildCodec = t.strict({
  type: t.literal('text'),
  text: t.literal(''),
});

export const ImageBlockNodeCodec = t.strict({
  type: t.literal('image'),
  image: MediaAttributesCodec,
  children: t.array(ImageBlockChildCodec),
});

export const RootNodeCodec = t.union([
  ParagraphBlockNodeCodec,
  QuoteBlockNodeCodec,
  CodeBlockNodeCodec,
  HeadingBlockNodeCodec,
  ListBlockNodeCodec,
  ImageBlockNodeCodec,
]);

export const BlocksContentCodec: t.Type<BlocksContent> = t.array(RootNodeCodec);
