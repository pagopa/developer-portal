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
          field: '3', // id 3 in prod env (field id '4' in dev)
          value:
            user['custom:mailinglist_accepted'] === 'true' ? 'TRUE' : 'FALSE',
        },
        {
          field: '4', // id 4 in prod env (field id '5' in dev)
          value: user['custom:survey_accepted'] === 'true' ? 'TRUE' : 'FALSE',
        },
        {
          field: '6', // id 5 in prod env (field id '6' in dev)
          value: user['custom:preferred_language'] || 'it',
        },
      ],
    },
  };
}
