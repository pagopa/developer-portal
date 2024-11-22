import { deleteList } from '../../handlers/deleteList';
import { SQSEvent } from 'aws-lambda';

describe.skip('deleteList handler', () => {
  it('should delete a list successfully', async () => {
    const event: SQSEvent = {
      Records: [
        {
          messageId: '1',
          receiptHandle: '1',
          body: JSON.stringify({
            slug: 'test-webinar-1732097293540',
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
    const response = await deleteList(event);
    expect(response.statusCode).toBe(200);
  });
});
