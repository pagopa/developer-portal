export type ResponseData<T> = {
  readonly data: {
    readonly id: number;
    readonly attributes: T;
  };
};
