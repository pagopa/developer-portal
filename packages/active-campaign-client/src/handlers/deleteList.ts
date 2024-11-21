import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { acClient } from '../utils/activeCampaignClient';

export async function deleteList(event: {
  readonly Records: SQSEvent['Records'];
}): Promise<APIGatewayProxyResult> {
  try {
    const firstMessage = event.Records[0] ?? { body: '{}' };
    const { slug } = JSON.parse(firstMessage.body);

    if (!slug) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Webinar slug is required' }),
      };
    }

    // Get list ID using the slug (name)
    const listId = await acClient.getListIdByName(slug);

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
