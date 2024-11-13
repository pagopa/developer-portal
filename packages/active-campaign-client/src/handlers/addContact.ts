import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { acClient } from '../activeCampaignClient';
import { SignUpUserData } from 'nextjs-website/src/lib/types/sign-up';
import { ACContactPayload } from '../activeCampaign';

export type HandlerEvent = Pick<APIGatewayProxyEvent, 'headers' | 'body'>;

export async function handler(
  event: HandlerEvent
): Promise<APIGatewayProxyResult> {
  try {
    // Parse request body
    const userData: SignUpUserData = JSON.parse(event.body || '{}');

    // Transform to AC payload
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
