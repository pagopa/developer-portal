export type StrapiWebinars = {
  readonly data: readonly {
    readonly id: string;
    readonly attributes: {
      readonly startDatetime: string;
      readonly endDatetime: string;
    };
  }[];
  readonly meta: {
    readonly pagination: {
      readonly total: number;
    };
  };
};
