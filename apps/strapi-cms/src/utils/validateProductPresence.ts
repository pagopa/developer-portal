import { errors } from '@strapi/utils';

const validatorsAreDisabled = process.env.DISABLE_CUSTOM_VALIDATORS === 'True';

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

export const validateAssociatedProductPresenceOnUpdate = (
  event: IEventWithProduct
): boolean => {
  if (validatorsAreDisabled) {
    return true;
  }
  // if there's only disconnect and no connect, throw error
  if (
    (event.params.data.product?.disconnect?.length ?? 0) > 0 &&
    (event.params.data.product?.connect?.length ?? 0) === 0
  ) {
    throw new errors.ApplicationError('Product is required');
  }

  return true;
};

export const validateAssociatedProductPresenceOnCreate = (
  event: IEventWithProduct
): boolean => {
  if (validatorsAreDisabled) {
    return true;
  }
  // if theres no connect inside connect elements throw error
  if ((event.params.data.product?.connect?.length ?? 0) === 0) {
    throw new errors.ApplicationError('Product is required');
  }
  return true;
};
