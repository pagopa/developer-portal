/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { acClient } from '../activeCampaignClient';
import { validateCognitoToken } from '../cognito';

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    // Validate authorization
    const token = event.headers.Authorization;
    if (!token || !(await validateCognitoToken(token))) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized' }),
      };
    }

    const { slug } = JSON.parse(event.body || '{}');

    if (!slug) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Webinar slug is required' }),
      };
    }

    // Get list ID using the slug (stringid)
    const listId = await acClient.getListIdByStringId(slug);

    if (!listId) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'List not found' }),
      };
    }

    // Delete the list
    await acClient.deleteList(Number(listId));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'List deleted successfully' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}
