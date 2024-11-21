import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { getUserFromCognito } from './handlers/getUserFromCognito';
import { QueueEvent } from './types/queueEvent';
import { addContact } from './handlers/addContact';
import { ListUsersCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { updateContact } from './handlers/updateContact';
import { deleteContact } from './handlers/deleteContact';

export type User = {
  readonly username: string;
  readonly email: string;
  readonly given_name: string;
  readonly family_name: string;
  readonly 'custom:mailinglist_accepted': string;
  readonly 'custom:company_type': string;
  readonly 'custom:job_role': string;
};

function listUsersCommandOutputToUser(
  listUsersCommandOutput: ListUsersCommandOutput
) {
  const userData = listUsersCommandOutput.Users?.[0];
  if (!userData) {
    return undefined;
  }
  return {
    username: userData.Username,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ...userData.Attributes?.reduce((acc, attr) => {
      if (!attr.Name || !attr.Value) {
        return acc;
      }
      acc[attr.Name] = attr.Value;
      return acc;
    }, {} as Record<string, string>),
  } as User;
}

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
