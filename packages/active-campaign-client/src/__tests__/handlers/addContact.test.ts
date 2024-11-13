import { handler } from '../../handlers/addContact';

// remove .skip to run the test, be aware it does a real API call so it will create a contact in the active campaign account
describe.skip('addContact handler', () => {
  it('should create a contact successfully', async () => {
    const event = {
      headers: {
        Authorization: 'test-token',
      },
      body: JSON.stringify({
        username: `test@example${new Date().getTime()}e.com`,
        firstName: 'John',
        lastName: 'Doe',
        company: 'Test Co',
        role: 'Developer',
        mailinglistAccepted: true,
      }),
    };

    const response = await handler(event);
    expect(response.statusCode).toBe(200);
  });
});
