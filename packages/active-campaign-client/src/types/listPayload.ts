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
