type Pagination = {
  readonly page: number;
  readonly pageSize: number;
  readonly pageCount: number;
  readonly total: number;
};

export type Paginated<T> = {
  readonly data: readonly T[];
  readonly meta: {
    readonly pagination: Pagination;
  };
};
