import { handler } from '../../handlers/createList';

describe('createList handler', () => {
  it('should create a list successfully', async () => {
    const event = {
      headers: {
        Authorization: 'test-token',
      },
      body: JSON.stringify({
        title: `Test Webinar ${new Date().getTime()}`,
        slug: `test-webinar-${new Date().getTime()}`,
        description: 'Test Description',
        subscribeCtaLabel: 'Subscribe to webinar',
        isVisibleInList: true,
        imagePath: '/path/to/image.jpg',
      }),
    };

    const response = await handler(event as any);
    expect(response.statusCode).toBe(200);
  });
});
