import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { addContact } from './handlers/addContact';

export async function handler(event: {
  readonly Records: SQSEvent['Records'];
}): Promise<APIGatewayProxyResult> {
  console.log('Event:', event);
  return {
    statusCode: 200,
    body: JSON.stringify(event),
  };
}
