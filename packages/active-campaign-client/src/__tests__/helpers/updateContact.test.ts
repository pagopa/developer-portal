import { updateContact } from '../../helpers/updateContact';
import { User } from '../../types/user';

// remove .skip to run the test, be aware it does a real API call so it will update a contact in the active campaign account
describe.skip('updateContact handler', () => {
  it('should update a contact successfully', async () => {
    const user: User = {
      username: '466e0280-9061-7007-c3e0-beb6be672f68',
      email: `test@example${new Date().getTime()}e.com`,
      given_name: 'Alberto',
      family_name: 'Doe',
      'custom:mailinglist_accepted': 'true',
      'custom:company_type': 'Test Co',
      'custom:job_role': 'Developer',
    };

    const response = await updateContact(user);
    expect(response.statusCode).toBe(200);
  });
});
