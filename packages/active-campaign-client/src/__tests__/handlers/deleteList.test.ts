import { handler } from '../../handlers/deleteList';

describe('deleteList handler', () => {
  it('should delete a list successfully', async () => {
    const event = {
      headers: {
        Authorization: 'test-token',
      },
      body: JSON.stringify({
        slug: 'test-webinar-1731014915127',
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
