import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { getUserFromCognito } from '../helpers/getUserFromCognito';
import { addContact } from '../helpers/addContact';
import { updateContact } from '../helpers/updateContact';
import { deleteContact } from '../helpers/deleteContact';
import { queueEventParser } from '../helpers/queueEventParser';

export async function sqsQueueHandler(event: {
  readonly Records: SQSEvent['Records'];
}): Promise<APIGatewayProxyResult> {
  try {
    console.log('Event:', event); // TODO: Remove after testing
    const queueEvent = queueEventParser(event);
    switch (queueEvent.detail.eventName) {
      case 'ConfirmSignUp':
        return await addContact(await getUserFromCognito(queueEvent));
      case 'UpdateUserAttributes':
        return await updateContact(await getUserFromCognito(queueEvent));
      case 'DeleteUser':
        return await deleteContact(queueEvent.detail.additionalEventData.sub);
      case 'DynamoINSERT':
        // TODO: implement pending from DEV-1983 and DEV-1986
        console.log(
          'Dynamo event:',
          queueEvent.detail.eventName,
          queueEvent.webinarId
        );
        break;
      case 'DynamoREMOVE':
        // TODO: implement pending from DEV-1983 and DEV-1986
        console.log(
          'Dynamo event:',
          queueEvent.detail.eventName,
          queueEvent.webinarId
        );
        break;
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
