import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { acClient } from '../activeCampaignClient';

export async function handler(event: {
  readonly Records: SQSEvent['Records'];
}): Promise<APIGatewayProxyResult> {
  try {
    const firstMessage = event.Records[0] ?? { body: '{}' };
    // Parse request body
    const { username } = JSON.parse(firstMessage.body);
    console.log('email:', username);

    const contactId = await acClient.getContactByEmail(username);
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
