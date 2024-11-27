import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { getUserFromCognito } from './helpers/getUserFromCognito';
import { QueueEvent } from './types/queueEvent';
import { addContact } from './helpers/addContact';
import { updateContact } from './helpers/updateContact';
import { deleteContact } from './helpers/deleteContact';

export async function handler(event: {
  readonly Records: SQSEvent['Records'];
}): Promise<APIGatewayProxyResult> {
  try {
    console.log('Event:', event); // TODO: Remove after testing
    const queueEvent = JSON.parse(
      event.Records[0].body
    ) as unknown as QueueEvent;
    switch (queueEvent.detail.eventName) {
      case 'ConfirmSignUp':
        return await addContact(await getUserFromCognito(queueEvent));
      case 'UpdateUserAttributes':
        return await updateContact(await getUserFromCognito(queueEvent));
      case 'DeleteUser':
        return await deleteContact(queueEvent.detail.additionalEventData.sub);
      default:
        console.log('Unknown event:', queueEvent.detail.eventName);
        break;
    }
    return {
      statusCode: 200,
      body: JSON.stringify(event),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}
