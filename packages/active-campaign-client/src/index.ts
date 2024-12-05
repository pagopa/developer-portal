import { SQSEvent } from 'aws-lambda';
import { sqsQueueHandler } from './handlers/sqsQueueHandler';

export async function sqsQueue(event: {
  readonly Records: SQSEvent['Records'];
}) {
  return await sqsQueueHandler(event);
}
