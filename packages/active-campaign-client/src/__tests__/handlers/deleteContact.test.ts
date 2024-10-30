import { handler } from '../../handlers/deleteContact';

describe('deleteContact handler', () => {
  it('should delete a contact successfully', async () => {
    const event = {
      headers: {
        Authorization: 'test-token',
      },
      body: JSON.stringify({
        email: 'test@example1730285270308e.com',
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
