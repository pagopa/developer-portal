import { APIGatewayProxyResult } from 'aws-lambda';
import { acClient } from '../clients/activeCampaignClient';
import { User } from '../types/user';
import { makeContactPayload } from './makeContactPayload';

export async function addContact(user: User): Promise<APIGatewayProxyResult> {
  try {
    const acPayload = makeContactPayload(user);

    const response = await acClient.createContact(acPayload);

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
