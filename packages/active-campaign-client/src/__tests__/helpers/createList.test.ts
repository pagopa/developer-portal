import { createList } from '../../helpers/createList';
import { SQSEvent } from 'aws-lambda';

describe.skip('createList handler', () => {
  it('should create a list successfully', async () => {
    const event: SQSEvent = {
      Records: [
        {
          messageId: '1',
          receiptHandle: '1',
          body: JSON.stringify({
            title: `Test Webinar ${new Date().getTime()}`,
            slug: `test-webinar-${new Date().getTime()}`,
            description: 'Test Description',
            subscribeCtaLabel: 'Subscribe to webinar',
            isVisibleInList: true,
            imagePath: '/path/to/image.jpg',
          }),
          attributes: {
            ApproximateReceiveCount: '1',
            SentTimestamp: '1',
            SenderId: '1',
            ApproximateFirstReceiveTimestamp: '1',
          },
          messageAttributes: {},
          md5OfBody: '1',
          eventSource: 'aws:sqs',
          eventSourceARN: 'arn:aws:sqs:region:account-id:queue-name',
          awsRegion: 'region',
        },
      ],
    };

    const response = await createList(event);
    expect(response.statusCode).toBe(200);
  });
});
