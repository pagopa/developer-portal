import { APIGatewayProxyResult } from 'aws-lambda';
import { acClient } from '../clients/activeCampaignClient';

export async function manageListSubscription(
  cognitoUserId: string,
  listName: string,
  action: 'subscribe' | 'unsubscribe'
): Promise<APIGatewayProxyResult> {
  try {
    const contactId = await acClient.getContactByCognitoId(cognitoUserId);
    if (!contactId) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Contact not found' }),
      };
    }

    const listId = await acClient.getListIdByName(listName);

    if (action == 'subscribe') {
      const response = await acClient.addContactToList(contactId, listId);
      return {
        statusCode: 200,
        body: JSON.stringify(response),
      };
    } else {
      const response = await acClient.removeContactFromList(contactId, listId);
      return {
        statusCode: 200,
        body: JSON.stringify(response),
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
}
