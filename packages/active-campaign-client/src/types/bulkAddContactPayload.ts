export type BulkAddContactPayload = {
  readonly contacts: readonly {
    readonly email: string;
    readonly first_name: string;
    readonly last_name: string;
    readonly phone: string | undefined;
    readonly customer_acct_name: string;
    readonly fields: readonly { readonly id: number; readonly value: string }[];
    readonly subscribe: readonly { readonly listid: number }[];
  }[];
};
