/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { validateCognitoToken } from '../cognito';
import { ACContactPayload } from '../activeCampaign';
import { acClient } from '../activeCampaignClient';

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

    const { contactId, ...userData } = JSON.parse(event.body || '{}');

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
