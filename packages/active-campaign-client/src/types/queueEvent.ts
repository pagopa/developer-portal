export type QueueEventType =
  | 'UpdateUserAttributes'
  | 'DeleteUser'
  | 'ConfirmSignUp'
  | 'DynamoINSERT'
  | 'DynamoREMOVE';

export type QueueEvent = {
  readonly detail: {
    readonly eventName: QueueEventType;
    readonly additionalEventData: {
      readonly sub: string;
    };
  };
  readonly webinarId?: string;
};
