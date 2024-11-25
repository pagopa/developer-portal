import { ListUsersCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '../clients/cognitoClient';
import { QueueEvent } from '../types/queueEvent';
import { listUsersCommandOutputToUser } from './listUsersCommandOutputToUser';

export async function getUserFromCognito(queueEvent: QueueEvent) {
  const command = new ListUsersCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Filter: `username = "${queueEvent.detail.additionalEventData.sub}"`,
  });
  const listUsersCommandOutput = await cognitoClient.send(command);
  const user = listUsersCommandOutputToUser(listUsersCommandOutput);
  if (!user) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('User not found');
  }
  console.log('User:', JSON.stringify(user, null, 2)); // TODO: Remove after testing
  return user;
}
