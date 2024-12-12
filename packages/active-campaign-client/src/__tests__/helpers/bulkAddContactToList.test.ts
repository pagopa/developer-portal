import { bulkAddContactToList } from '../../helpers/bulkAddContactsToLists';
import { User } from '../../types/user';

const user: User = {
  username: '466e0280-9061-7007-c3e0-beb6be672f68',
  email: `test@example${new Date().getTime()}e.com`,
  given_name: 'Giovanni',
  family_name: 'Doe',
  'custom:mailinglist_accepted': 'true',
  'custom:company_type': 'Test Co',
  'custom:job_role': 'Developer',
};

describe.skip('Active campaign integration contact flow', () => {
  it('should bulk add contacts to a list', async () => {
    const response = await bulkAddContactToList([user], [[28]]);
    expect(response.statusCode).toBe(200);
  });
});
