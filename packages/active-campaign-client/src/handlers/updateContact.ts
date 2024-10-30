/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { acClient } from '../activeCampaignClient';
import { validateCognitoToken } from '../cognito';
import { ACContactPayload } from '../activeCampaign';

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const token = event.headers.Authorization;
    if (!token || !(await validateCognitoToken(token))) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized' }),
      };
    }

    const { email, ...userData } = JSON.parse(event.body || '{}');

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing email' }),
      };
    }

    const contactId = await acClient.getContactByEmail(email);

    if (!contactId) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Contact not found' }),
      };
    }

    const acPayload: ACContactPayload = {
      contact: {
        email: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        fieldValues: [
          {
            field: 'company',
            value: userData.company,
          },
          {
            field: 'role',
            value: userData.role,
          },
        ],
      },
    };

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
