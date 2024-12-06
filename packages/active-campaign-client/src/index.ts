import { SQSEvent } from 'aws-lambda';
import { sqsQueueHandler } from './handlers/sqsQueueHandler';
import { resyncUserHandler } from './helpers/resyncUser';

export async function sqsQueue(event: {
  readonly Records: SQSEvent['Records'];
}) {
  return await sqsQueueHandler(event);
}

export async function handler(event: {
  readonly Records: SQSEvent['Records'];
}) {
  return await resyncUserHandler(event);
}
