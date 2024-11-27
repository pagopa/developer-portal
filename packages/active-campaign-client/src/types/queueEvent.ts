export type QueueEventType =
  | 'UpdateUserAttributes'
  | 'DeleteUser'
  | 'ConfirmSignUp';

export type QueueEvent = {
  readonly detail: {
    readonly eventName: QueueEventType;
    readonly additionalEventData: {
      readonly sub: string;
    };
  };
};
