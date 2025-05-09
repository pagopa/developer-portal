import * as t from 'io-ts/lib';
import { MediaCodec } from '@/lib/strapi/codecs/MediaCodec';
import { PaginationCodec } from '@/lib/strapi/codecs/PaginationCodec';

export const WebinarCategoryCodec = t.strict({
  id: t.number,
  attributes: t.strict({
    name: t.string,
    icon: t.strict({ data: MediaCodec }),
  }),
});

export const WebinarCategoriesCodec = t.strict({
  data: t.array(WebinarCategoryCodec),
  meta: PaginationCodec,
});

export type StrapiWebinarCategories = t.TypeOf<typeof WebinarCategoriesCodec>;
