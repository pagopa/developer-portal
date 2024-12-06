import { ListUsersCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '../clients/cognitoClient';
import { QueueEvent } from '../types/queueEvent';
import { listUsersCommandOutputToUser } from './listUsersCommandOutputToUser';

export async function getUserFromCognito(queueEvent: QueueEvent) {
  const username = queueEvent.detail.additionalEventData.sub;
  const user = await getUserFromCognitoByUsername(username);
  if (!user) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('User not found');
  }
  return user;
}

export async function getUserFromCognitoByUsername(username: string) {
  const command = new ListUsersCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Filter: `username = "${username}"`,
  });
  const listUsersCommandOutput = await cognitoClient.send(command);
  const user = listUsersCommandOutputToUser(listUsersCommandOutput);
  console.log('User:', JSON.stringify(user, null, 2)); // TODO: Remove after testing
  return user;
}
