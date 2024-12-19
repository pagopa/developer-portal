import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { getUserFromCognito } from '../helpers/getUserFromCognito';
import { addContact } from '../helpers/addContact';
import { updateContact } from '../helpers/updateContact';
import { deleteContact } from '../helpers/deleteContact';
import { queueEventParser } from '../helpers/queueEventParser';
import {
  addContactToList,
  removeContactToList,
} from '../helpers/manageListSubscription';

function manageError(result: APIGatewayProxyResult) {
  if (result.statusCode === 500) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Internal server error');
  }

  return result;
}

export async function sqsQueueHandler(event: {
  readonly Records: SQSEvent['Records'];
}): Promise<APIGatewayProxyResult> {
  try {
    console.log('Event:', event); // TODO: Remove after testing
    const queueEvent = queueEventParser(event);
    switch (queueEvent.detail.eventName) {
      case 'ConfirmSignUp':
        return manageError(
          await addContact(await getUserFromCognito(queueEvent))
        );
      case 'UpdateUserAttributes':
        return manageError(
          await updateContact(await getUserFromCognito(queueEvent))
        );
      case 'DeleteUser':
        return manageError(
          await deleteContact(queueEvent.detail.additionalEventData.sub)
        );
      case 'DynamoINSERT':
        return manageError(
          await addContactToList(
            queueEvent.detail.additionalEventData.sub,
            queueEvent.webinarId || ''
          )
        );
      case 'DynamoREMOVE':
        return manageError(
          await removeContactToList(
            queueEvent.detail.additionalEventData.sub,
            queueEvent.webinarId || ''
          )
        );
      default:
        // eslint-disable-next-line functional/no-throw-statements
        throw new Error('Unknown event');
    }
  } catch (error) {
    console.error('Error:', error); // TODO: Remove after testing
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}
