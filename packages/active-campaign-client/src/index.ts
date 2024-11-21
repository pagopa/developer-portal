import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { getUserFromCognito } from './helpers/getUserFromCognito';
import { QueueEvent } from './types/queueEvent';
import { addContact } from './helpers/addContact';
import { updateContact } from './helpers/updateContact';
import { deleteContact } from './helpers/deleteContact';
import { listUsersCommandOutputToUser } from './helpers/listUsersCommandOutputToUser';

export async function handler(event: {
  readonly Records: SQSEvent['Records'];
}): Promise<APIGatewayProxyResult> {
  try {
    console.log('Event:', event);
    const queueEvent = JSON.parse(
      event.Records[0].body
    ) as unknown as QueueEvent;
    console.log('queueEvent:', queueEvent);
    switch (queueEvent.detail.eventName) {
      case 'ConfirmSignUp':
        // eslint-disable-next-line no-case-declarations
        const user = listUsersCommandOutputToUser(
          await getUserFromCognito(queueEvent)
        );
        console.log('ConfirmSignUp:', JSON.stringify(user, null, 2));
        if (!user) {
          // eslint-disable-next-line functional/no-throw-statements
          throw new Error('User not found');
        }
        return await addContact(user);
      case 'UpdateUserAttributes':
        // eslint-disable-next-line no-case-declarations
        const userToUpdate = listUsersCommandOutputToUser(
          await getUserFromCognito(queueEvent)
        );
        console.log(
          'UpdateUserAttributes:',
          JSON.stringify(userToUpdate, null, 2)
        );
        if (!userToUpdate) {
          // eslint-disable-next-line functional/no-throw-statements
          throw new Error('User not found');
        }
        return await updateContact(userToUpdate);
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
