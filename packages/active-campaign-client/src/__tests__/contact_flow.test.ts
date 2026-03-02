import { addContact } from '../helpers/addContact';
import { deleteContact } from '../helpers/deleteContact';
import { updateContact } from '../helpers/updateContact';
import { User } from '../types/user';

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

// remove .skip to run the test, be aware it does a real API call so it will create, update and delete a contact in the active campaign account
// NB: this test is not idempotent and it must run in this order
describe.skip('Active campaign integration contact flow', () => {
  it('should create a contact successfully', async () => {
    const response = await addContact(user);
    expect(response.statusCode).toBe(200);
  });

  it('should update a contact successfully', async () => {
    const updatedUser: User = {
      ...user,
      email: `test@example${new Date().getTime()}e.com`,
      given_name: 'new given_name',
      family_name: 'new family_name',
      'custom:mailinglist_accepted': 'true',
      'custom:survey_accepted': 'true',
      'custom:company_type': 'new company_type',
      'custom:job_role': 'new job_role',
      'custom:preferred_language': 'en',
    };

    const response = await updateContact(updatedUser);
    expect(response.statusCode).toBe(200);
  });

  it('should delete a contact successfully', async () => {
    const response = await deleteContact(user.username);
    expect(response.statusCode).toBe(200);
  });
});
