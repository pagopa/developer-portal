import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { addContact } from './handlers/addContact';

export async function handler(event: {
  readonly Records: SQSEvent['Records'];
}): Promise<APIGatewayProxyResult> {
  return addContact(event);
}
