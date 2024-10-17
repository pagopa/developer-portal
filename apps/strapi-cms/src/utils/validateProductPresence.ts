export interface IEventWithProduct {
  readonly params: {
    readonly data: {
      readonly product?: {
        readonly connect?: Array<{
          readonly id: string;
        }>;
        readonly disconnect?: Array<{
          readonly id: string;
        }>;
      };
    };
    readonly where?: {
      readonly id?: string;
    };
  };
}

export const validateAssociatedProductPresenceOnUpdate = (): boolean => true;

export const validateAssociatedProductPresenceOnCreate = (): boolean => true;
