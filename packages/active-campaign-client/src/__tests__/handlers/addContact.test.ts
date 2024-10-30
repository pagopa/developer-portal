import { handler } from '../../handlers/addContact';

describe('addContact handler', () => {
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

    const response = await handler(event as any);
    expect(response.statusCode).toBe(200);
  });

  it('should return 401 for missing authorization', async () => {
    const event = {
      headers: {},
      body: JSON.stringify({}),
    };

    const response = await handler(event as any);
    expect(response.statusCode).toBe(401);
  });
});
