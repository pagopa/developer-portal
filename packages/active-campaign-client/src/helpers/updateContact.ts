import { APIGatewayProxyResult } from 'aws-lambda';
import { acClient } from '../clients/activeCampaignClient';
import { ContactPayload } from '../types/contactPayload';
import { User } from '../types/user';

export async function updateContact(
  user: User
): Promise<APIGatewayProxyResult> {
  try {
    const acPayload: ContactPayload = {
      contact: {
        email: user.email,
        firstName: user.given_name,
        lastName: user.family_name,
        phone: `cognito:${user.username}`,
        fieldValues: [
          {
            field: '2',
            value: user['custom:company_type'],
          },
          {
            field: '1',
            value: user['custom:job_role'],
          },
          {
            field: '3',
            value:
              user['custom:mailinglist_accepted'] === 'true' ? 'TRUE' : 'FALSE',
          },
        ],
      },
    };
    const contactId = await acClient.getContactByCognitoId(user.username);
    if (!contactId) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Contact not found' }),
      };
    }

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
