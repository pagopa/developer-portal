import { errors } from '@strapi/utils';

interface IWebinar {
  readonly slug?: string;
  readonly locale?: string;
  readonly startDatetime?: string;
  readonly endDatetime?: string;
}

interface IWebinarEvent {
  readonly params: {
    readonly data: IWebinar;
    readonly where?: {
      readonly id?: string;
    };
  };
}

const validateDates = (event: IWebinarEvent): boolean => {
  const { data } = event.params;

  const startDateTime = data.startDatetime
    ? new Date(data.startDatetime)
    : null;
  const endDateTime = data.endDatetime ? new Date(data.endDatetime) : null;

  if ((startDateTime && !endDateTime) || (!startDateTime && endDateTime)) {
    throw new errors.ApplicationError(
      'Both start and end dates must be provided, or none should be set'
    );
  }

  if (startDateTime && endDateTime && endDateTime <= startDateTime) {
    throw new errors.ApplicationError('End date must be after start date');
  }
  return true;
};

module.exports = {
  async beforeCreate(event: IWebinarEvent) {
    validateDates(event);
  },
  async beforeUpdate(event: IWebinarEvent) {
    validateDates(event);
  },
};
