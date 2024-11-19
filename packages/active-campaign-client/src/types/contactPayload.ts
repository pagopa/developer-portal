export type ContactPayload = {
  readonly contact: {
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly phone?: string;
    readonly fieldValues: readonly {
      readonly field: string;
      readonly value: string;
    }[];
  };
};
