import { ListUsersCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient } from '../clients/cognitoClient';
import { QueueEvent } from '../types/queueEvent';

export async function getUserFromCognito(queueEvent: QueueEvent) {
  const command = new ListUsersCommand({
    UserPoolId: process.env.COGNITO_USER_POOL_ID,
    Filter: `username = "${queueEvent.detail.additionalEventData.sub}"`,
  });
  return await cognitoClient.send(command);
}
