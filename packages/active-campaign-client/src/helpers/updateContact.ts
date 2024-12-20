import { APIGatewayProxyResult } from 'aws-lambda';
import { acClient } from '../clients/activeCampaignClient';
import { User } from '../types/user';
import { makeContactPayload } from './makeContactPayload';

export async function updateContact(
  user: User
): Promise<APIGatewayProxyResult> {
  try {
    const acPayload = makeContactPayload(user);
    const contactId = await acClient.getContactByCognitoUsername(user.username);
    if (!contactId) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Contact not found' }),
      };
    }

    const response = await acClient.updateContact(contactId, acPayload);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}
