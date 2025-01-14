// To run this script you need to have proper environment variables set up.
// Must be logged in to AWS CLI and have the proper permissions to access the Cognito User Pool and DynamoDB tables.
// Then run 'npm run sync-all-users -w active-campaign-client'

/* eslint-disable */
import { ActiveCampaignClient } from "../clients/activeCampaignClient";
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb';
import fs from 'fs';
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

function splitArray(array: {
  username: any;
  subscribedWebinars: any[];
}[], chunkSize: number) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

async function main() {
  const users = await listAllUsers();
  const usersToImportLimit = !!process.env.USERS_TO_IMPORT_LIMIT && parseInt(process.env.USERS_TO_IMPORT_LIMIT);

  console.log(process.env.DYNAMO_WEBINARS_TABLE_NAME);

  let usersAndWebinars: any[] = [];

  const limitedUsers = usersToImportLimit ? users.slice(0, usersToImportLimit) : users;

  const totalUsers = limitedUsers.length;
  let processedUsers = 0;
  fs.readFile('data.json', 'utf8', async (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      for (const user of limitedUsers) {
        processedUsers++;
        console.log(processedUsers, '/', totalUsers);
        const subscribedWebinars = await getSubscribedWebinars(user.Username);
        usersAndWebinars.push({
          username: user,
          subscribedWebinars: subscribedWebinars.map((webinar: any) => webinar?.webinarId?.S).filter(Boolean)
        });
      }
    
      usersAndWebinars.flatMap((userAndWebinars) => userAndWebinars.subscribedWebinars);
    
      const jsonString = JSON.stringify(usersAndWebinars); 
      fs.writeFile('data.json', jsonString, (err) => {
        if (err) {
          console.error('Error writing file:', err);
        } else {
          console.log('JSON saved to data.json');
        }
      });
    } else {
      console.log('JSON read from data.json');
      usersAndWebinars = JSON.parse(data);
    }
  });

  const allLists: any = await activeCampaignClient.getLists();
  await new Promise((resolve) => setTimeout(resolve, 2500));

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

  const limitedUniqueUsersAndWebinars = usersToImportLimit ? uniqueUsersAndWebinars
    .slice(0, usersToImportLimit)
    : uniqueUsersAndWebinars;


  // console.log('limitedUniqueUsersAndWebinars', limitedUniqueUsersAndWebinars.map((userAndWebinars) => userAndWebinars.username.Username));
  const selectedUsers = limitedUniqueUsersAndWebinars; //.splice(0, 399);
  const chunks = splitArray(selectedUsers, 100);
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const acPayload = chunk.map((userAndWebinars, index) => ({
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
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

// Execute the main function
main().catch(error => {
  console.error('Error executing script:', error);
  process.exit(1);
});
