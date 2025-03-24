/**
 * webinar router
 */

export default {
  routes: [
    {
      handler: 'webinar.deleteWithoutHooks',
      method: 'DELETE',
      path: '/webinars/delete-without-hooks/:id', // Only match when the first parameter contains 2 or 3 digits.
    },
  ],
};
