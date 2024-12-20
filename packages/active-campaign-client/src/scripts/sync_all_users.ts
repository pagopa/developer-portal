/* eslint-disable */
import { ActiveCampaignClient } from "../clients/activeCampaignClient";
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import dotenv from 'dotenv';

dotenv.config();

const activeCampaignClient = new ActiveCampaignClient(
  process.env.AC_BASE_URL!,
  process.env.AC_API_KEY!
);

const userPoolId = process.env.COGNITO_USER_POOL_ID!;

// Initialize Cognito client
const cognito = new CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export async function getSubscribedWebinars(
  username: string
): Promise<any[]> {
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
        PaginationToken: paginationToken
      };

      const response: any = await cognito.listUsers(params).promise();
      allUsers.push(...response.Users);
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
    const subscribedWebinars = await getSubscribedWebinars(user.Username);
    usersAndWebinars.push({
      username: user,
      subscribedWebinars: subscribedWebinars.map((webinar: any) => webinar?.webinarId?.S).filter(Boolean)
    });
  }

  const subscribedWebinarNames = usersAndWebinars.flatMap((userAndWebinars) => userAndWebinars.subscribedWebinars);

  const allLists: any = await activeCampaignClient.getLists();

  const webinarIdByName = allLists.lists.reduce((acc: any, list: any) => {
    acc[list.name] = Number(list.id);
    return acc;
  }, {});

  console.log(webinarIdByName);

  const emails = new Set();
  // remove duplicates on emails
  const uniqueUsersAndWebinars = usersAndWebinars.filter((userAndWebinars) => {
    const email = userAndWebinars.username.Attributes.find((attr: any) => attr.Name === 'email')?.Value;
    if (emails.has(email)) {
      return false;
    }
    emails.add(email);
    return true;
  });

  // limit uniqueUsersAndWebinars to 10
  const limitedUniqueUsersAndWebinars = uniqueUsersAndWebinars
    .filter((userAndWebinars) => userAndWebinars.subscribedWebinars.length > 0)
    .slice(0, 2);

  const acPayload = limitedUniqueUsersAndWebinars.map((userAndWebinars, index) => ({
    contact: {
      email: userAndWebinars.username.Attributes.find((attr: any) => attr.Name === 'email')?.Value,
      firstName: userAndWebinars.username.Attributes.find((attr: any) => attr.Name === 'given_name')?.Value,
      lastName: userAndWebinars.username.Attributes.find((attr: any) => attr.Name === 'family_name')?.Value,
      phone: `cognito:${userAndWebinars.username.Username}`,
      fieldValues: [
        {
          field: '2',
          value: userAndWebinars.username.Attributes.find((attr: any) => attr.Name === 'custom:company_type')?.Value,
        },
        {
          field: '1',
          value: userAndWebinars.username.Attributes.find((attr: any) => attr.Name === 'custom:job_role')?.Value,
        },
        {
          field: '3',
          value: userAndWebinars.username.Attributes.find((attr: any) => attr.Name === 'custom:mailinglist_accepted')?.Value === 'true' ? 'TRUE' : 'FALSE',
        },
      ],
    },
    listIds: userAndWebinars.subscribedWebinars.map((webinar: any) => webinarIdByName[webinar]).filter(Boolean),
  }));

  const response = await activeCampaignClient.bulkAddContactToList(acPayload);

  console.log(response);
}

// Execute the main function
main().catch(error => {
  console.error('Error executing script:', error);
  process.exit(1);
});