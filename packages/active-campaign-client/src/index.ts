import { SQSEvent } from 'aws-lambda';
import { sqsQueueHandler } from './handlers/sqsQueueHandler';
import { resyncUser } from './helpers/resyncUser';

export async function sqsQueue(event: {
  readonly Records: SQSEvent['Records'];
}) {
  return await sqsQueueHandler(event);
}

export async function handler(event: {
  readonly Records: SQSEvent['Records'];
}) {
  //return await sqsQueueHandler(event);
  const cognitoId = event.Records[0].body;
  console.log('cognitoId: ', cognitoId);
  return await resyncUser(cognitoId);
}
