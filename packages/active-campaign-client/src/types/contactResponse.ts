export type ContactResponse = {
  readonly contact: {
    readonly id: string;
  };
};

export type ContactResponseWithLists = {
  readonly contactLists: ReadonlyArray<{
    readonly list: string;
    readonly status: string;
  }>;
} & ContactResponse;
