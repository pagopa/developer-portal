import { queueEventParser } from '../../helpers/queueEventParser';
import { QueueEvent, QueueEventType } from '../../types/queueEvent';

const MOCK_WEBINAR_ID = 'webinar-id';
const MOCK_COGNITO_ID = 'c67ec280-799a-40d6-b398-2a2b31aefbbd';

const generateMockBody = (eventName?: QueueEventType, webinarId?: string) => {
  const webinarData = webinarId ? { webinarId } : {};
  return {
    ...webinarData,
    version: '0',
    id: 'c67ec280-799a-40d6-b398-2a2b31aefbbd',
    'detail-type': 'AWS API Call via CloudTrail',
    source: 'aws.cognito-idp',
    account: '99999999999',
    time: '2024-11-25T13:34:12Z',
    region: 'region',
    resources: [],
    detail: {
      eventVersion: '1.08',
      userIdentity: {
        type: 'Unknown',
        principalId: 'Anonymous',
      },
      eventTime: '2024-11-25T13:34:12Z',
      eventSource: 'cognito-idp.amazonaws.com',
      eventName: `${eventName || 'Unknown'}`,
      awsRegion: 'region',
      sourceIPAddress: '1.1.1.1',
      userAgent:
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      requestParameters: {
        userAttributes: 'HIDDEN_DUE_TO_SECURITY_REASONS',
        accessToken: 'HIDDEN_DUE_TO_SECURITY_REASONS',
      },
      responseElements: null,
      additionalEventData: {
        sub: MOCK_COGNITO_ID,
      },
      requestID: 'c67ec280-799a-40d6-b398-2a2b31aefbbd',
      eventID: '1b231015-853a-4042-a157-4127a9ec5530',
      readOnly: false,
      eventType: 'AwsApiCall',
      managementEvent: true,
      recipientAccountId: '999999999',
      eventCategory: 'Management',
      tlsDetails: {
        tlsVersion: 'TLSv1.3',
        cipherSuite: 'TLS_AES_128_GCM_SHA256',
        clientProvidedHostHeader: 'clientProvidedHostHeader',
      },
    },
  };
};

const generateSQSMockEvent = (params?: {
  readonly eventType?: QueueEventType;
  readonly webinarId?: string;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  readonly customBody?: Record<string, unknown>;
}) => ({
  Records: [
    {
      messageId: '983ad1cf-e06a-4393-8382-e51af60c4f58',
      receiptHandle: 'receiptHandle',
      body: JSON.stringify(
        params?.customBody ||
          generateMockBody(params?.eventType, params?.webinarId)
      ),
      attributes: {
        ApproximateReceiveCount: '1',
        SentTimestamp: '99999999',
        SequenceNumber: '1245',
        MessageGroupId: 'userEvents',
        SenderId: 'SenderId',
        MessageDeduplicationId: 'MessageDeduplicationId',
        ApproximateFirstReceiveTimestamp: '99999999',
      },
      messageAttributes: {},
      md5OfBody: 'sdf1df457fg71d5sf1dfsd7',
      eventSource: 'aws:sqs',
      eventSourceARN: 'eventSourceARN',
      awsRegion: 'awsRegion',
    },
  ],
});

describe('Helpers: queueEventParser', () => {
  it('should rise an error if event is different from QueueEventType', async () => {
    const sqsEvent = generateSQSMockEvent();
    expect(() => {
      queueEventParser(sqsEvent);
    }).toThrow('Event missing required fields');
  });

  it('should rise an error if body is not a valid JSON', async () => {
    const sqsEvent = generateSQSMockEvent();
    expect(() => {
      queueEventParser(sqsEvent);
    }).toThrow('Event missing required fields');
  });

  it('should properly convert UpdateUserAttributes event', async () => {
    const sqsEvent = generateSQSMockEvent({
      eventType: 'UpdateUserAttributes',
    });
    const parsedQueueEvent = queueEventParser(sqsEvent);
    const queueEvent: QueueEvent = {
      detail: {
        eventName: 'UpdateUserAttributes',
        additionalEventData: {
          sub: MOCK_COGNITO_ID,
        },
      },
    };
    expect(parsedQueueEvent.detail.eventName).toEqual(
      queueEvent.detail.eventName
    );
    expect(parsedQueueEvent.detail.additionalEventData.sub).toEqual(
      queueEvent.detail.additionalEventData.sub
    );
  });

  it('should properly convert DeleteUser event', async () => {
    const sqsEvent = generateSQSMockEvent({ eventType: 'DeleteUser' });
    const parsedQueueEvent = queueEventParser(sqsEvent);
    const queueEvent: QueueEvent = {
      detail: {
        eventName: 'DeleteUser',
        additionalEventData: {
          sub: MOCK_COGNITO_ID,
        },
      },
    };
    expect(parsedQueueEvent.detail.eventName).toEqual(
      queueEvent.detail.eventName
    );
    expect(parsedQueueEvent.detail.additionalEventData.sub).toEqual(
      queueEvent.detail.additionalEventData.sub
    );
  });

  it('should properly convert ConfirmSignUp event', async () => {
    const sqsEvent = generateSQSMockEvent({ eventType: 'ConfirmSignUp' });
    const parsedQueueEvent = queueEventParser(sqsEvent);
    const queueEvent: QueueEvent = {
      detail: {
        eventName: 'ConfirmSignUp',
        additionalEventData: {
          sub: MOCK_COGNITO_ID,
        },
      },
    };
    expect(parsedQueueEvent.detail.eventName).toEqual(
      queueEvent.detail.eventName
    );
    expect(parsedQueueEvent.detail.additionalEventData.sub).toEqual(
      queueEvent.detail.additionalEventData.sub
    );
  });

  it('should properly convert DynamoINSERT event', async () => {
    const sqsEvent = generateSQSMockEvent({
      eventType: 'DynamoINSERT',
      webinarId: MOCK_WEBINAR_ID,
    });
    const parsedQueueEvent = queueEventParser(sqsEvent);
    const queueEvent: QueueEvent = {
      detail: {
        eventName: 'DynamoINSERT',
        additionalEventData: {
          sub: MOCK_COGNITO_ID,
        },
      },
      webinarId: MOCK_WEBINAR_ID,
    };
    expect(parsedQueueEvent.detail.eventName).toEqual(
      queueEvent.detail.eventName
    );
    expect(parsedQueueEvent.detail.additionalEventData.sub).toEqual(
      queueEvent.detail.additionalEventData.sub
    );
    expect(parsedQueueEvent.webinarId).toEqual(queueEvent.webinarId);
  });

  it('should properly convert DynamoREMOVE event', async () => {
    const sqsEvent = generateSQSMockEvent({
      eventType: 'DynamoREMOVE',
      webinarId: MOCK_WEBINAR_ID,
    });
    const parsedQueueEvent = queueEventParser(sqsEvent);
    const queueEvent: QueueEvent = {
      detail: {
        eventName: 'DynamoREMOVE',
        additionalEventData: {
          sub: MOCK_COGNITO_ID,
        },
      },
      webinarId: MOCK_WEBINAR_ID,
    };
    expect(parsedQueueEvent.detail.eventName).toEqual(
      queueEvent.detail.eventName
    );
    expect(parsedQueueEvent.detail.additionalEventData.sub).toEqual(
      queueEvent.detail.additionalEventData.sub
    );
    expect(parsedQueueEvent.webinarId).toEqual(queueEvent.webinarId);
  });

  it('should rise an error if webinar id is missing for Dynamo event', async () => {
    const sqsEvent = generateSQSMockEvent({ eventType: 'DynamoREMOVE' });
    expect(() => {
      queueEventParser(sqsEvent);
    }).toThrow('Event missing required fields');
  });
});
