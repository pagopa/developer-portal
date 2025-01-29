// To run this script you need to have proper environment variables set up.
// Must be logged in to AWS CLI and have the proper permissions to access the Cognito User Pool and DynamoDB tables.
// Then run 'npm run normalize-and-delete-duplicated-users -w active-campaign-client'

/* eslint-disable */
import { ActiveCampaignClient } from "../clients/activeCampaignClient";
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// create logs folder if not exists
if (!fs.existsSync('src/scripts/logs')) {
  fs.mkdirSync('src/scripts/logs');
}
const filePrefix = `src/scripts/logs/${process.env.FILE_ENV_PREFIX}`;

const sideEffect = process.env.SIDE_EFFECT === 'true';

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

export async function createWebinarSubscription(username: string, webinarId: string): Promise<void> {
  if (!sideEffect) {
    console.log('Side effect disabled for createWebinarSubscription', username, webinarId);
    return;
  }
  
  try {
    const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
    const command = new PutItemCommand({
      TableName: process.env.DYNAMO_WEBINARS_TABLE_NAME,
      Item: {
        username: { S: username },
        webinarId: { S: webinarId },
        inscriptionDate: { S: (new Date()).toISOString() }
      }
    });

    await dynamoClient.send(command);
    console.log(`Inscription created for user ${username} to webinar ${webinarId}`);
  } catch (error) {
    console.error('Error creating webinar inscription:', error);
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

function findDuplicatedUsers(users: any[]) {
  const emailMap: { [email: string]: any[] } = {};

  users.forEach(user => {
    const email = user.Attributes.find((attr: any) => attr.Name === 'email')?.Value.toLowerCase();
    if (email) {
      if (!emailMap[email]) {
        emailMap[email] = [];
      }
      emailMap[email].push(user);
    }
  });

  for (const email in emailMap) {
    if (emailMap[email].length == 1) {
      delete emailMap[email];
    } else {
    }
  }

  const duplicatedUsersCount = Object.keys(emailMap).reduce((acc, email) => {
    return acc + emailMap[email].length;
  }, 0);
  console.log('Duplicated users count:', Object.keys(emailMap).length, 'Total users:', duplicatedUsersCount);

  fs.writeFileSync(`${filePrefix}_duplicated_users.json`, JSON.stringify(emailMap, null, 2));
  return emailMap;
}

async function getDuplicatedUsers() {
  const users = await listAllUsers();
  const duplicatedUsers = findDuplicatedUsers(users);
  return duplicatedUsers;
}

// async funtion getDuplicatedUsersWebinars(duplicatedUsersMap: { [email: string]: any[] }) {

// }
type TargetUserMap = { [email: string]: {
  targetUser: any,
  webinarsSlugToSubscribe: string[],
  usersToDelete: any[],
} };

async function buildUsersToMerge(duplicatedUsersMap: { [email: string]: any[] }) {
  const targetUserMap: TargetUserMap = {};

  let usersToDeleteCount = 0;
  for (const email in duplicatedUsersMap) {
    const users = duplicatedUsersMap[email];
    
    let userWithContact: any;
    for (const user of users) {
      await new Promise((resolve) => setTimeout(resolve, 1100));
      console.log('Username:', user.Username);
      const contact = await activeCampaignClient.getContactByCognitoUsername(user.Username);
      if (contact) {
        userWithContact = user;
        break;
      }
    }

    const usersToDelete = users.filter(user => user.Username !== userWithContact.Username);
    let webinarsSlugToSubscribe = [];
    for (const user of usersToDelete) {
      const subscriptions = await getSubscribedWebinars(user.Username);
      webinarsSlugToSubscribe = subscriptions.map((webinar: any) => webinar?.webinarId?.S).filter(Boolean);
    }
    targetUserMap[email] = {
      targetUser: userWithContact,
      webinarsSlugToSubscribe,
      usersToDelete: usersToDelete,
    };
    usersToDeleteCount += usersToDelete.length;
  }

  console.log('Users to delete:', usersToDeleteCount);
  fs.writeFileSync(`${filePrefix}_buildUsersToMerge.json`, JSON.stringify(targetUserMap, null, 2));
  
  return targetUserMap;
}

async function alignUserSubscription(targetUserMap: TargetUserMap) {
  const emails = Object.keys(targetUserMap);
  for (const email of emails) {
    const { targetUser, webinarsSlugToSubscribe } = targetUserMap[email];
    for (const webinarSlug of webinarsSlugToSubscribe) {
      await createWebinarSubscription(targetUser.Username, webinarSlug);
    } 
  }
}

async function updateUserEmailToLowerCase(user: any) {
  const username = user.Username;
  const email = user.Attributes.find((attr: any) => attr.Name === 'email')?.Value.toLowerCase();
  if (!sideEffect) {
    console.log('Side effect disabled for updateUserToLowerCase', username, email);
    return;
  }

  const params = {
    UserPoolId: userPoolId,
    Username: username,
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
    ],
  };

  try {
    await cognito.adminUpdateUserAttributes(params).promise();
    // logut user
    // await cognito.adminUserGlobalSignOut({ UserPoolId: userPoolId, Username: username }).promise();
  } catch (error) {
    console.error(`Error updating email for user ${username}:`, error);
  }
}

async function setUsersToLowerCase(users: any[]) {
  const count = users.length;
  for (let i = 0; i < count; i++) {
    const user = users[i];
    await updateUserEmailToLowerCase(user);
    console.log(`Updated ${i + 1}/${count} users`);
  }
}

function getUsersToDelete(targetUserMap: TargetUserMap) {  
  let allUsersToDelete: any[] = [];
  for (const targetUserEmail in targetUserMap) {
    allUsersToDelete = [...allUsersToDelete, ...targetUserMap[targetUserEmail].usersToDelete];
  }

  fs.writeFileSync(`${filePrefix}_get_user_to_delete.json`, JSON.stringify(allUsersToDelete, null, 2));
  return allUsersToDelete;
}

async function getUserToUpdateToLowerCase() {
  const allUsers = await listAllUsers();
  const upperCaseEmailUsers = []
  for (const user of allUsers) {
    const email = `${user.Attributes.find((attr: any) => attr.Name === 'email')?.Value}`;
    if (
      email !== email.toLowerCase()
    ) {
      upperCaseEmailUsers.push(user);
    }
  }

  // generate file that contains array of usernames to sync
  const usernamesToSync = upperCaseEmailUsers.map((user: any) => user.Username);
  fs.writeFileSync(`${filePrefix}_usernames_to_sync.json`, JSON.stringify(usernamesToSync, null, 2));

  console.log('User To Update To LowerCase:', upperCaseEmailUsers.length);
  fs.writeFileSync(`${filePrefix}_get_user_to_update_to_lower_case.json`, JSON.stringify(upperCaseEmailUsers, null, 2));
  return upperCaseEmailUsers;
}

async function logOutUser(user: any) {
  const username = user.Username;
  if (!sideEffect) {
    console.log('Side effect disabled for logOutUser', username);
    return;
  }

  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  try {
    await cognito.adminUserGlobalSignOut(params).promise();
    console.log(`Logged out user ${username}`);
  } catch (error) {
    console.error(`Error logging out user ${username}:`, error);
  }
}

async function deleteUser(user: any) {
  const username = user.Username;
  if (!sideEffect) {
    console.log('Side effect disabled for deleteUser', username);
    return;
  }

  const params = {
    UserPoolId: userPoolId,
    Username: username,
  };

  try {
    await cognito.adminDeleteUser(params).promise();
    console.log(`Deleted user ${username}`);
  } catch (error) {
    console.error(`Error deleting user ${username}:`, error);
  }
}

async function logoutAndDeleteUsers(usersToDelete: any[]) {
  const count = usersToDelete.length;
  for (let i = 0; i < count; i++) {
    const user = usersToDelete[i];
    await logOutUser(user);
    await deleteUser(user);
    console.log(`Deleted ${i + 1}/${count} users`);
  }
}

async function main() {
  console.log('SIDE EFFECT', sideEffect);
  
  const duplicatedUsers = await getDuplicatedUsers();
  const targetUserMap = await buildUsersToMerge(duplicatedUsers);
  await alignUserSubscription(targetUserMap);
  const usersToDelete = getUsersToDelete(targetUserMap);
  await logoutAndDeleteUsers(usersToDelete);
  const userToUpdateToLowerCase = await getUserToUpdateToLowerCase();
  await setUsersToLowerCase(userToUpdateToLowerCase);
}

// Execute the main function
main().catch(error => {
  console.error('Error executing script:', error);
  process.exit(1);
});
