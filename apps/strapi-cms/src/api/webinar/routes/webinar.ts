/**
 * webinar router
 */

export default {
  routes: [
    {
      handler: 'webinar.deleteWithoutHooks',
      method: 'DELETE',
      path: '/webinars/delete-without-hooks/:id',
    },
  ],
};
