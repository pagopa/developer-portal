import { SQSEvent } from 'aws-lambda';
import { sqsQueueHandler } from './handlers/sqsQueueHandler';
import { resyncUserHandler } from './handlers/resyncUserHandler';

export async function sqsQueue(event: {
  readonly Records: SQSEvent['Records'];
}) {
  return await sqsQueueHandler(event);
}

export async function resyncQueue(event: {
  readonly Records: SQSEvent['Records'];
}) {
  return await resyncUserHandler(event);
}
