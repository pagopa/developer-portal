import { deleteContact } from '../../helpers/deleteContact';

// remove .skip to run the test, be aware it does a real API call so it will delete a contact in the active campaign account
describe.skip('deleteContact handler', () => {
  it('should delete a contact successfully', async () => {
    const response = await deleteContact(
      '466e0280-9061-7007-c3e0-beb6be672f68'
    );
    expect(response.statusCode).toBe(200);
  });
});
