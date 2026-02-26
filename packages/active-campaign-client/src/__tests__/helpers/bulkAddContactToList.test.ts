import { bulkAddContactToList } from '../../helpers/bulkAddContactsToLists';
import { User } from '../../types/user';

const user: User = {
  username: '466e0280-9061-7007-c3e0-beb6be672f68',
  email: `test@example${new Date().getTime()}e.com`,
  given_name: 'Giovanni',
  family_name: 'Doe',
  'custom:mailinglist_accepted': 'true',
  'custom:survey_accepted': 'false',
  'custom:company_type': 'Test Co',
  'custom:job_role': 'Developer',
  'custom:preferred_language': 'it',
};

describe.skip('Active campaign integration contact flow', () => {
  it('should bulk add contacts to a list', async () => {
    const response = await bulkAddContactToList(
      [user],
      [[Number(process.env.TEST_AC_LIST_ID)]]
    );
    expect(response.statusCode).toBe(200);
  });
});
