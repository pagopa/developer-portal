export type ResponseData<T> = {
  readonly data: {
    readonly id: number;
    readonly attributes: T;
  };
  readonly meta: unknown; // TODO: add correct type when defined
};
