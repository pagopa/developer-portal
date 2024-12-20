import { APIGatewayProxyResult } from 'aws-lambda';
import { acClient } from '../clients/activeCampaignClient';

export async function deleteContact(
  cognitoId: string
): Promise<APIGatewayProxyResult> {
  try {
    const contactId = await acClient.getContactByCognitoUsername(cognitoId);

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
