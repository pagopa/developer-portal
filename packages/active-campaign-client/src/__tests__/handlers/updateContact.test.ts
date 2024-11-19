import { handler } from '../../handlers/updateContact';
import { SQSEvent } from 'aws-lambda';

// remove .skip to run the test, be aware it does a real API call so it will create a contact in the active campaign account
describe.skip('addContact handler', () => {
  it('should update a contact successfully', async () => {
    const event: SQSEvent = {
      Records: [
        {
          messageId: '1',
          receiptHandle: '1',
          body: JSON.stringify({
            username: `test@example1731961399739e.com`,
            firstName: 'Alberto',
            lastName: 'Doe',
            company: 'Test Co',
            role: 'Developer',
            mailinglistAccepted: true,
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
