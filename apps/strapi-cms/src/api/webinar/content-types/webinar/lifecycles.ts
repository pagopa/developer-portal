// The only way to make this code work is to do side effects, and throwing exceptions and creating functions
/*eslint-disable*/
import { errors } from '@strapi/utils';

interface IWebinarEvent {
  readonly params: {
    readonly data: {
      readonly startDatetime?: string;
      readonly endDatetime?: string;
    };
  };
}

const validateDates = (event: IWebinarEvent) => {
  const { data } = event.params;

  const startDateTime = data.startDatetime
    ? new Date(data.startDatetime)
    : null;
  const endDateTime = data.endDatetime ? new Date(data.endDatetime) : null;

  if ((startDateTime && !endDateTime) || (!startDateTime && endDateTime)) {
    throw new errors.ApplicationError(
      'Both start and end dates must be provided'
    );
  }

  if (startDateTime && endDateTime && endDateTime < startDateTime) {
    throw new errors.ApplicationError('End date must be after start date');
  }
};

module.exports = {
  beforeCreate(event: IWebinarEvent) {
    validateDates(event);
  },

  beforeUpdate(event: IWebinarEvent) {
    validateDates(event);
  },
};
