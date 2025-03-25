/**
 * webinar controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::webinar.webinar',
  ({ strapi }) => ({
    async deleteWithoutHooks(event) {
      // eslint-disable-next-line functional/no-try-statements
      try {
        const { params } = event;
        const { id } = params;

        if (!id) {
          return { error: 'Missing webinar ID' };
        }

        const webinarId = parseInt(id, 10);

        if (isNaN(webinarId)) {
          return { error: 'Invalid webinar ID format' };
        }

        // Use Knex to delete the record directly from the database, bypassing lifecycle hooks
        await strapi.db?.connection('webinars').where({ id: webinarId }).del();
        return { message: 'Webinar deleted successfully' };
      } catch (error) {
        return { error: 'Failed to delete webinar' };
      }
    },
  })
);
