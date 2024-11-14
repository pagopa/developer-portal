export type ACContactPayload = {
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

export type ListPayload = {
  readonly list: {
    readonly name: string;
    readonly stringid: string;
    readonly sender_url: string;
    readonly sender_reminder: string;
    readonly subscription_notify?: string;
    readonly unsubscription_notify?: string;
  };
};

export type ListStatusPayload = {
  readonly contactList: {
    readonly list: string;
    readonly contact: string;
    readonly status: string;
  };
};
