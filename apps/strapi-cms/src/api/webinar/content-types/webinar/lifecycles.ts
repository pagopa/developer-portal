import { errors, env } from '@strapi/utils';
import axios from 'axios';

interface IActiveCampaignListPayload {
  readonly list: {
    readonly name: string;
    readonly stringid: string;
    readonly sender_url: string;
    readonly sender_reminder: string;
    readonly subscription_notify?: string;
    readonly unsubscription_notify?: string;
  };
}

const activeCampaignIntegrationIsEnabled =
  env('ACTIVE_CAMPAIGN_INTEGRATION_IS_ENABLED', 'False') === 'True';

function getHeaders() {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Api-Token': env('AC_API_KEY', ''),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Content-Type': 'application/json',
  };
}

interface IWebinar {
  readonly id?: string;
  readonly slug?: string;
  readonly title?: string;
  readonly locale?: string;
  readonly startDatetime?: string;
  readonly endDatetime?: string;
  readonly publishedAt?: string;
}

interface IWebinarEvent {
  readonly params: {
    readonly data: IWebinar;
    readonly where?: {
      readonly id?: string;
    };
  };
  readonly result: IWebinar;
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

const validateSlug = async (event: IWebinarEvent): Promise<boolean> => {
  const { id } = event.params.data;
  if (!id) {
    throw new errors.ApplicationError('Webinar id not found');
  }
  const previousWebinar = await strapi.db
    .query('api::webinar.webinar')
    .findOne({
      select: ['slug'],
      where: { id },
    });
  if (previousWebinar && previousWebinar.slug !== event.params.data.slug) {
    throw new errors.ApplicationError(
      'The slug of a webinar cannot be changed'
    );
  }
  return true;
};

const activeCampaignError = (message: string) => {
  throw new errors.ApplicationError(
    `Something went wrong during Active Campaign ${message}`
  );
};

const createActiveCampaignList = async (
  event: IWebinarEvent
): Promise<boolean> => {
  if (
    !activeCampaignIntegrationIsEnabled ||
    !event.result?.slug ||
    !event.result?.title
  ) {
    return true;
  }

  const { slug: name, title: stringid } = event.result;

  const payload: IActiveCampaignListPayload = {
    list: {
      name,
      sender_reminder: '',
      sender_url: `${env(
        'SENDER_URL',
        'http://localhost:3000/'
      )}/webinars/${name}`,
      stringid,
      subscription_notify: '',
      unsubscription_notify: '',
    },
  };

  const response = await axios
    .post(`${env('AC_BASE_URL')}/api/3/lists`, payload, {
      headers: getHeaders(),
    })
    .catch((_) => {
      activeCampaignError('list creation');
    });

  if (response?.status !== 201) {
    activeCampaignError('list creation');
  }

  return response?.status === 201;
};

const getListIdByName = async (name: string): Promise<number> => {
  const response = await axios.get<{
    readonly lists: ReadonlyArray<{ readonly id: number }>;
  }>(
    `${env('AC_BASE_URL')}/api/3/lists`,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    { headers: getHeaders(), params: { 'filters[name][eq]': name } }
  );
  return response?.data.lists[0]?.id;
};

const deleteActiveCampaignList = async (
  event: IWebinarEvent
): Promise<boolean> => {
  if (
    !activeCampaignIntegrationIsEnabled ||
    !event?.params.where ||
    !event.params.where.id
  ) {
    return true;
  }
  const webinar = await strapi.db
    .query('api::webinar.webinar')
    .findOne({ where: { id: event.params.where.id } });

  if (!webinar?.slug) {
    activeCampaignError('list deletion: webinar slug is missing');
  }
  // Get list ID using the slug (name)
  const listId = await getListIdByName(webinar.slug);

  if (!listId) {
    return false;
  }

  const response = await axios
    .delete(`${env('AC_BASE_URL')}/api/3/lists/${listId}`, {
      headers: getHeaders(),
    })
    .catch((_) => {
      activeCampaignError('list deletion');
    });

  if (response?.status !== 200) {
    activeCampaignError('list deletion');
  }

  return response?.status === 200;
};

module.exports = {
  async afterCreate(event: IWebinarEvent) {
    await createActiveCampaignList(event);
  },
  beforeCreate(event: IWebinarEvent) {
    validateDates(event);
  },
  async beforeDelete(event: IWebinarEvent) {
    await deleteActiveCampaignList(event);
  },
  beforeDeleteMany() {
    if (activeCampaignIntegrationIsEnabled) {
      throw new errors.ApplicationError(
        'Bulk deletion is not allowed for webinars if Active Campaign integration is enabled'
      );
    }
  },
  async beforeUpdate(event: IWebinarEvent) {
    validateDates(event);
    await validateSlug(event);
  },
};
