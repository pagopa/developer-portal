import { APIGatewayProxyResult } from 'aws-lambda';
import { acClient } from '../clients/activeCampaignClient';

export async function addContactToList(
  cognitoId: string,
  listName: string
): Promise<APIGatewayProxyResult> {
  try {
    const contactId = await acClient.getContactByCognitoId(cognitoId);
    if (!contactId) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Contact not found' }),
      };
    }

    const listId = await acClient.getListIdByName(listName);

    const response = await acClient.addContactToList(contactId, listId);
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

export async function removeContactToList(
  cognitoId: string,
  listName: string
): Promise<APIGatewayProxyResult> {
  try {
    const contactId = await acClient.getContactByCognitoId(cognitoId);
    if (!contactId) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Contact not found' }),
      };
    }

    const listId = await acClient.getListIdByName(listName);

    const response = await acClient.removeContactFromList(contactId, listId);
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
