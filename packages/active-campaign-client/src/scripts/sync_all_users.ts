// This script is only ment to be launched manually to sync all users from Cognito to ActiveCampaign
/* eslint-disable */
import { ActiveCampaignClient } from '../clients/activeCampaignClient';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import { ContactPayload } from '../types/contactPayload';

const activeCampaignClient = new ActiveCampaignClient(
  process.env.TEST_AC_BASE_URL,
  process.env.TEST_AC_API_KEY
);

const userPoolId = process.env.COGNITO_USER_POOL_ID!;

// Initialize Cognito client
const cognito = new CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getSubscribedWebinars(username: string): Promise<any[]> {
  try {
    const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
    const command = new QueryCommand({
      TableName: process.env.DYNAMO_WEBINARS_TABLE_NAME,
      KeyConditionExpression: 'username = :username',
      ExpressionAttributeValues: {
        ':username': { S: username },
      },
    });

    const response = await dynamoClient.send(command);
    return response.Items as any[];
  } catch (error) {
    console.error('Error querying items by username:', error);
    return [];
  }
}

// Load all users from Cognito
async function listAllUsers() {
  try {
    const allUsers = [];
    let paginationToken = undefined;

    do {
      const params: any = {
        UserPoolId: userPoolId,
        PaginationToken: paginationToken,
      };

      const response = await cognito.listUsers(params).promise();
      if (response.Users) {
        allUsers.push(...response.Users);
      }
      paginationToken = response.PaginationToken;
    } while (paginationToken);

    return allUsers;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

async function main() {
  const users = await listAllUsers();

  console.log(process.env.DYNAMO_WEBINARS_TABLE_NAME);

  const usersAndWebinars = [];

  for (const user of users) {
    if (!user.Username) {
      continue;
    }
    const subscribedWebinars = await getSubscribedWebinars(user.Username);
    usersAndWebinars.push({
      user,
      subscribedWebinars: subscribedWebinars
        .map((webinar: any) => webinar?.webinarId?.S)
        .filter(Boolean),
    });
  }

  const allLists: any = await activeCampaignClient.getLists();

  const webinarIdByName = allLists.lists.reduce((acc: any, list: any) => {
    acc[list.name] = Number(list.id);
    return acc;
  }, {});

  const emails = new Set();
  // remove duplicates on emails
  const uniqueUsersAndWebinars = usersAndWebinars.filter((userAndWebinars) => {
    const email = userAndWebinars?.user?.Attributes?.find(
      (attr: any) => attr.Name === 'email'
    )?.Value;
    if (emails.has(email)) {
      return false;
    }
    emails.add(email);
    return true;
  });

  // TODO: limit uniqueUsersAndWebinars to 10 remove after testing
  const limitedUniqueUsersAndWebinars = uniqueUsersAndWebinars
    .filter((userAndWebinars) => userAndWebinars.subscribedWebinars.length > 0)
    .slice(0, 10);

  const acPayload = limitedUniqueUsersAndWebinars.map(
    (userAndWebinars, index) => {
      const attributes = userAndWebinars.user.Attributes;
      return {
        contact: {
          email: attributes?.find((attr: any) => attr.Name === 'email')?.Value,
          firstName: attributes?.find((attr: any) => attr.Name === 'given_name')
            ?.Value,
          lastName: attributes?.find((attr: any) => attr.Name === 'family_name')
            ?.Value,
          phone: `cognito:${userAndWebinars.user.Username}`,
          fieldValues: [
            {
              field: '2',
              value: attributes?.find(
                (attr: any) => attr.Name === 'custom:company_type'
              )?.Value,
            },
            {
              field: '1',
              value: attributes?.find(
                (attr: any) => attr.Name === 'custom:job_role'
              )?.Value,
            },
            {
              field: '3',
              value:
                attributes?.find(
                  (attr: any) => attr.Name === 'custom:mailinglist_accepted'
                )?.Value === 'true'
                  ? 'TRUE'
                  : 'FALSE',
            },
          ],
        },
        listIds: userAndWebinars.subscribedWebinars
          .map((webinar: any) => webinarIdByName[webinar])
          .filter(Boolean) as unknown as number[],
      };
    }
  ) as unknown as readonly (ContactPayload & {
    readonly listIds: readonly number[];
  })[];

  console.log(acPayload.filter((user: any) => user.listIds.length !== 0));

  const response = await activeCampaignClient.bulkAddContactToList(acPayload);

  console.log(response);
}

// Execute the main function
main().catch((error) => {
  console.error('Error executing sync:', error);
  process.exit(1);
});
