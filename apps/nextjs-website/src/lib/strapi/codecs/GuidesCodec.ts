import * as t from 'io-ts/lib';
import { MediaCodec } from '@/lib/strapi/codecs/MediaCodec';

const BaseGuideAttributesCodec = t.strict({
  title: t.string,
  slug: t.string,
  image: t.strict({ data: MediaCodec }),
  mobileImage: t.strict({ data: MediaCodec }),
  listItems: t.array(
    t.strict({
      text: t.string,
    })
  ),
});

export const BaseGuideCodec = t.strict({
  attributes: BaseGuideAttributesCodec,
});
