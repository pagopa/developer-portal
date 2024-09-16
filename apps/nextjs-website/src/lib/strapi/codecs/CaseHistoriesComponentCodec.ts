import * as t from 'io-ts';
import { NullToUndefinedCodec } from '@/lib/strapi/codecs/NullToUndefinedCodec';
import { CaseHistoryCodec } from '@/lib/strapi/codecs/CaseHistoriesCodec';

export const CaseHistoriesComponentCodec = t.strict({
  title: t.string,
  description: t.union([NullToUndefinedCodec, t.string]),
  case_histories: t.strict({
    data: t.array(CaseHistoryCodec),
  }),
});
