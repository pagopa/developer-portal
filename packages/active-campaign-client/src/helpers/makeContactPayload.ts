import { ContactPayload } from '../types/contactPayload';
import { User } from '../types/user';

export function makeContactPayload(user: User): ContactPayload {
  return {
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
}
