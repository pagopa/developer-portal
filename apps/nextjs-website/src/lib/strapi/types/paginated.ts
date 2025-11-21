type Pagination = {
  readonly page: number;
  readonly pageSize: number;
  readonly pageCount: number;
  readonly total: number;
};

export type Paginated<T> = {
  readonly meta: {
    readonly pagination: Pagination;
  };
} & readonly T[];
