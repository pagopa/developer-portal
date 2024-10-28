/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { acClient } from '../activeCampaignClient';
import { validateCognitoToken } from '../cognito';
import { ACListStatusPayload } from '../activeCampaign';

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

    const { listId, contactId, status } = JSON.parse(event.body || '{}');

    const acPayload: ACListStatusPayload = {
      contactList: {
        list: listId,
        contact: contactId,
        status,
      },
    };

    const response = await acClient.updateListStatus(acPayload);

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
