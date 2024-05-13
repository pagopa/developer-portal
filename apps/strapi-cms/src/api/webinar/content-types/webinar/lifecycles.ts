import { errors } from '@strapi/utils';

interface IWebinar {
  readonly id?: string;
  readonly slug: string;
  readonly locale?: string;
  readonly startDatetime?: string;
  readonly endDatetime?: string;
}

interface IWebinarEvent {
  readonly params: {
    readonly data: IWebinar;
  };
}

const validateDates = (event: IWebinarEvent): boolean => {
  const { data } = event.params;

  const startDateTime = data.startDatetime
    ? new Date(data.startDatetime)
    : null;
  const endDateTime = data.endDatetime ? new Date(data.endDatetime) : null;

  if ((startDateTime && !endDateTime) || (!startDateTime && endDateTime)) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new errors.ApplicationError(
      'Both start and end dates must be provided, or none should be set'
    );
  }

  if (startDateTime && endDateTime && endDateTime <= startDateTime) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new errors.ApplicationError('End date must be after start date');
  }
  return true;
};

const getLocale = async (event: IWebinarEvent): Promise<string> => {
  if (event.params.data.locale) {
    return event.params.data.locale;
  } else {
    const webinar: IWebinar | undefined = await strapi
      .service('api::webinar.webinar')
      .findOne(event.params.data.id);
    return webinar?.locale || 'it';
  }
};

const validateSlugUniqByLocale = async (
  event: IWebinarEvent
): Promise<boolean> => {
  const currentLocale = await getLocale(event);

  const query: { where: Record<string, unknown> } = {
    where: {
      locale: currentLocale,
      slug: event.params.data.slug,
    },
  };
  if (event.params.data.id) {
    query.where = {
      id: {
        $notIn: [event.params.data.id],
      },
      ...query.where,
    };
  }
  const webinarWithSameSlug: IWebinar | undefined = await strapi.db
    .query('api::webinar.webinar')
    .findOne(query);

  if (webinarWithSameSlug) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new errors.ApplicationError(
      'Webinar with the same slug already exists for the current locale'
    );
  }
  return true;
};

module.exports = {
  async beforeCreate(event: IWebinarEvent) {
    validateDates(event);
    await validateSlugUniqByLocale(event);
  },
  async beforeUpdate(event: IWebinarEvent) {
    validateDates(event);
    await validateSlugUniqByLocale(event);
  },
};
