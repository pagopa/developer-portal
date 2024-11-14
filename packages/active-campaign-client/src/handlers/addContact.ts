import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { acClient } from '../activeCampaignClient';
import { SignUpUserData } from 'nextjs-website/src/lib/types/sign-up';
import { ContactPayload } from '../types/contactPayload';

export type HandlerEvent = Pick<APIGatewayProxyEvent, 'body'>;

export async function handler(
  event: HandlerEvent
): Promise<APIGatewayProxyResult> {
  try {
    // Parse request body
    const userData: SignUpUserData = JSON.parse(event.body || '{}');

    // Transform to AC payload
    const acPayload: ContactPayload = {
      contact: {
        email: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        fieldValues: [
          {
            field: '2',
            value: userData.company,
          },
          {
            field: '1',
            value: userData.role,
          },
          {
            field: '3',
            value: userData.mailinglistAccepted ? 'TRUE' : 'FALSE',
          },
        ],
      },
    };

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
