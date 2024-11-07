/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { acClient } from '../activeCampaignClient';

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const { email } = JSON.parse(event.body || '{}');
    console.log('email:', email);

    const contactId = await acClient.getContactByEmail(email);
    console.log('contactId:', contactId);

    if (!contactId) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Contact not found' }),
      };
    }

    const response = await acClient.deleteContact(contactId);

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
