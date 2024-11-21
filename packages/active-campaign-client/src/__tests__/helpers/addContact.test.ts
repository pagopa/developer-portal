import { addContact } from '../../helpers/addContact';
import { User } from '../../types/user';

// remove .skip to run the test, be aware it does a real API call so it will create a contact in the active campaign account
describe.skip('addContact handler', () => {
  it('should create a contact successfully', async () => {
    const user: User = {
      username: '466e0280-9061-7007-c3e0-beb6be672f68',
      email: `test@example${new Date().getTime()}e.com`,
      given_name: 'Giovanni',
      family_name: 'Doe',
      'custom:mailinglist_accepted': 'true',
      'custom:company_type': 'Test Co',
      'custom:job_role': 'Developer',
    };

    const response = await addContact(user);
    expect(response.statusCode).toBe(200);
  });
});
