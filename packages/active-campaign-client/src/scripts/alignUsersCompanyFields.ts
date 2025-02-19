// To run this script you need to set the appropriate environment variables.
// You must be signed in to AWS CLI and have the proper permissions to access the Cognito User Pool and DynamoDB tables.
// Then run 'npm run normalize-and-delete-duplicated-users -w active-campaign-client'

// auth: {
//   signUp: {
//     companyRoles: [
//       { title: 'Ente pubblico', value: 'public-authority' },
//       { title: 'Partner tecnologico', value: 'tech-partner' },
//       { title: 'PSP', value: 'psp' },
//       {
//         title: 'Gestore di pubblico servizio',
//         value: 'operator-of-public-service',
//       },
//       { title: 'Azienda privata', value: 'private-company' },
//       { title: 'Altro', value: 'other' },
//     ],
//   },
// },

/* eslint-disable */
import { ActiveCampaignClient } from "../clients/activeCampaignClient";
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// create logs folder if not exists
if (!fs.existsSync('src/scripts/logs')) {
  fs.mkdirSync('src/scripts/logs');
}
const filePrefix = `src/scripts/logs/${process.env.FILE_ENV_PREFIX}`;

const sideEffect = process.env.SIDE_EFFECT === 'true';

const deprecatedCompanyTypes = [
  'public-authority',
  'tech-partner',
  'operator-of-public-servi',
  'private-company',
  'other',
];

const targetCompanyRolesMap = [
  { key: "public-authority", target: "ente-pubblico" },
  { key: "tech-partner", target: "partner-tecnologico" },
  { key: "operator-of-public-servi", target: "gestore-di-pubblico-servizio" },
  { key: "private-company", target: "azienda-privata" },
  { key: "other", target: "altro" },
];

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

async function getDeprecatedCompanyTypeUsers() {
  const allUsers = await listAllUsers();
  const deprecatedCompanyTypeUsers = []
  for (const user of allUsers) {
    const companyType = `${user.Attributes.find((attr: any) => attr.Name === 'custom:company_type')?.Value}`;
    if (
      deprecatedCompanyTypes.some((item) => item === companyType)
    ) {
      deprecatedCompanyTypeUsers.push(user);
    }
  }

  // generate file that contains array of usernames to sync
  const usernamesToSync = deprecatedCompanyTypeUsers.map((user: any) => user.Username);
  fs.writeFileSync(`${filePrefix}_deprecated_usernames_to_sync.json`, JSON.stringify(usernamesToSync, null, 2));

  console.log('User To Update To LowerCase:', deprecatedCompanyTypeUsers.length);
  fs.writeFileSync(`${filePrefix}_deprecated_company_type_users.json`, JSON.stringify(deprecatedCompanyTypeUsers, null, 2));
  return deprecatedCompanyTypeUsers;
}

async function updateUserCompanyType(user: any) {
  const username = user.Username;
  const deprecatedCompanyType = user.Attributes.find((attr: any) => attr.Name === 'custom:company_type')?.Value;
  const targetCompanyType = targetCompanyRolesMap.find((item) => item.key === deprecatedCompanyType)?.target;
  if (!targetCompanyType) {
    console.log('Target company type not found for', username, deprecatedCompanyType);
    return;
  }

  if (!sideEffect) {
    console.log('Side effect disabled for updateUserToLowerCase', username, deprecatedCompanyType);
    return;
  }

  const params = {
    UserPoolId: userPoolId,
    Username: username,
    UserAttributes: [
      {
        Name: 'custom:company_type',
        Value: targetCompanyType,
      },
    ],
  };

  try {
    await cognito.adminUpdateUserAttributes(params).promise();
  } catch (error) {
    console.error(`Error updating email for user ${username}:`, error);
  }
}

// async function setUsersToLowerCase(users: any[]) {
//   const count = users.length;
//   for (let i = 0; i < count; i++) {
//     const user = users[i];
//     await updateUserEmailToLowerCase(user);
//     console.log(`Updated ${i + 1}/${count} users`);
//   }
// }

async function main() {
  console.log('SIDE EFFECT', sideEffect);
  
  const users = await getDeprecatedCompanyTypeUsers();
}

// Execute the main function
main().catch(error => {
  console.error('Error executing script:', error);
  process.exit(1);
});
