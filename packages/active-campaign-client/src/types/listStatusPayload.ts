export type ListStatusPayload = {
  readonly contactList: {
    readonly list: number;
    readonly contact: string;
    readonly status: number;
  };
};
