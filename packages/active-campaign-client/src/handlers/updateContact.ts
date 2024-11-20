import { APIGatewayProxyResult, SQSEvent } from 'aws-lambda';
import { acClient } from '../activeCampaignClient';
import { ContactPayload } from '../types/contactPayload';

export async function handler(event: {
  readonly Records: SQSEvent['Records'];
}): Promise<APIGatewayProxyResult> {
  try {
    const firstMessage = event.Records[0] ?? { body: '{}' };
    // Parse request body
    const userData = JSON.parse(firstMessage.body);

    if (!userData.username) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing email' }),
      };
    }

    const contactId = await acClient.getContactByEmail(userData.username);

    if (!contactId) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Contact not found' }),
      };
    }

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
