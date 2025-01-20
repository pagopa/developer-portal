import { SQSEvent } from 'aws-lambda';
import { QueueEvent, QueueEventType } from '../types/queueEvent';

const queueEvents: readonly QueueEventType[] = [
  'ConfirmSignUp',
  'UpdateUserAttributes',
  'DeleteUser',
  'DynamoINSERT',
  'DynamoREMOVE',
  'DynamoMODIFY',
];

const dynamoEvents: readonly QueueEventType[] = [
  'DynamoINSERT',
  'DynamoREMOVE',
  'DynamoMODIFY',
];

export function queueEventParser(event: {
  readonly Records: SQSEvent['Records'];
}): QueueEvent {
  const queueEvent = JSON.parse(event.Records[0].body) as unknown as QueueEvent;

  if (
    !queueEvents.includes(queueEvent.detail.eventName) ||
    !queueEvent.detail.additionalEventData.sub ||
    (dynamoEvents.includes(queueEvent.detail.eventName) &&
      !queueEvent.webinarId)
  ) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Event missing required fields');
  }

  return queueEvent;
}
