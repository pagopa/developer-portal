import { handler } from '../../handlers/deleteContact';
import { SQSEvent } from 'aws-lambda';

// remove .skip to run the test, be aware it does a real API call so it will create a contact in the active campaign account
describe('deleteContact handler', () => {
  it('should delete a contact successfully', async () => {
    const event: SQSEvent = {
      Records: [
        {
          messageId: '1',
          receiptHandle: '1',
          body: JSON.stringify({
            // Replace this with the existing email of the contact you want to delete, otherwise the test will fail
            cognitoId: `466e0280-9061-7007-c3e0-beb6be672f68`,
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

    const response = await handler(event);
    expect(response.statusCode).toBe(200);
  });
});
