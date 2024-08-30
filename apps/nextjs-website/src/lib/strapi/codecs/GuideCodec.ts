import * as t from 'io-ts/lib';
import { MediaCodec } from './MediaCodec';
import { BaseProductCodec } from './ProductCodec';

const VersionCodec = t.strict({
  main: t.boolean,
  dirName: t.string,
  version: t.string,
});

export const BaseGuideCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    title: t.string,
    slug: t.string,
    image: t.strict({ data: MediaCodec }),
    mobileImage: t.strict({ data: MediaCodec }),
    listItems: t.array(
      t.strict({
        text: t.string,
      })
    ),
  }),
});

export const GuideCodec = t.intersection([
  BaseGuideCodec,
  t.strict({
    attributes: t.strict({
      versions: t.array(VersionCodec),
      product: t.strict({ data: BaseProductCodec }),
    }),
  }),
]);
