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

const getLocale = async (event: IWebinarEvent): Promise<string> => {
  // eslint-disable-next-line functional/no-let
  let currentLocale: string | undefined;
  if (event.params.data.locale) {
    currentLocale = event.params.data.locale;
  } else if (event.params.where?.id) {
    const webinar: IWebinar | undefined = await strapi
      .service('api::webinar.webinar')
      .findOne(event.params.where?.id);
    currentLocale = webinar?.locale;
  }
  return currentLocale || 'it';
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
  if (event.params.where?.id) {
    query.where = {
      id: {
        $notIn: [event.params.where.id],
      },
      ...query.where,
    };
  }

  const webinarWithSameSlug: IWebinar | undefined = await strapi.db
    .query('api::webinar.webinar')
    .findOne(query);

  if (webinarWithSameSlug) {
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
