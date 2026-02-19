import { ListUsersCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { listUsersCommandOutputToUser } from '../../helpers/listUsersCommandOutputToUser';
import { User } from '../../types/user';

const listUsersCommandOutput: ListUsersCommandOutput = {
  $metadata: {
    httpStatusCode: 200,
    requestId: 'c67ec280-799a-40d6-b398-2a2b31aefbbd',
    attempts: 1,
    totalRetryDelay: 0,
  },
  Users: [
    {
      Attributes: [
        {
          Name: 'email',
          Value: 'test@mail.com',
        },
        {
          Name: 'email_verified',
          Value: 'true',
        },
        {
          Name: 'family_name',
          Value: 'Doe',
        },
        {
          Name: 'given_name',
          Value: 'Giovanni',
        },
        {
          Name: 'custom:mailinglist_accepted',
          Value: 'true',
        },
        {
          Name: 'custom:survey_accepted',
          Value: 'true',
        },
        {
          Name: 'custom:user_preferences',
          Value:
            '{"subscribedWebinarSlugs":["comunicazioni-a-valore-legale","nuove-api-io","live","cooming-soon","test","always-live","PagoPA-multe"]}',
        },
        {
          Name: 'custom:company_type',
          Value: 'gestore-di-pubblico-servizio',
        },
        {
          Name: 'custom:job_role',
          Value: 'Developer',
        },
        {
          Name: 'custom:privacy_accepted',
          Value: 'true',
        },
        {
          Name: 'sub',
          Value: 'c67ec280-799a-40d6-b398-2a2b31aefbbd',
        },
        {
          Name: 'custom:preferred_language',
          Value: 'it',
        },
      ],
      Enabled: true,
      UserStatus: 'CONFIRMED',
      Username: 'c67ec280-799a-40d6-b398-2a2b31aefbbd',
    },
  ],
};

describe('Helpers: listUsersCommandOutputToUser', () => {
  it('should properly convert ListUsersCommandOutput to User', async () => {
    const user = listUsersCommandOutputToUser(listUsersCommandOutput);
    const expectedUser: User = {
      username: 'c67ec280-799a-40d6-b398-2a2b31aefbbd',
      email: 'test@mail.com',
      given_name: 'Giovanni',
      family_name: 'Doe',
      'custom:mailinglist_accepted': 'true',
      'custom:survey_accepted': 'true',
      'custom:company_type': 'gestore-di-pubblico-servizio',
      'custom:job_role': 'Developer',
      'custom:preferred_language': 'it',
    };
    expect(user).toBeDefined();
    Object.keys(expectedUser).forEach((value) => {
      const key = value as keyof User;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(user![key]).toBe(expectedUser[key]);
    });
  });
});
