import * as t from 'io-ts/lib';

export const PaginationCodec = t.strict({
  pagination: t.strict({
    page: t.number,
    pageSize: t.number,
    pageCount: t.number,
    total: t.number,
  }),
});
