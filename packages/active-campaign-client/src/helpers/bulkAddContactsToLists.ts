import { APIGatewayProxyResult } from 'aws-lambda';
import { acClient } from '../clients/activeCampaignClient';
import { ContactPayload } from '../types/contactPayload';
import { User } from '../types/user';

export async function bulkAddContactToList(
  users: readonly User[],
  listIds: readonly (readonly number[])[]
): Promise<APIGatewayProxyResult> {
  try {
    // Transform to AC payload
    const acPayload: readonly (ContactPayload & {
      readonly listIds: readonly number[];
    })[] = users.map((user, index) => ({
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
      listIds: listIds[index],
    }));

    const response = await acClient.bulkAddContactToList(acPayload);

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
