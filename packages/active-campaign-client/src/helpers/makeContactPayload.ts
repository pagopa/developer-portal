import { customFieldIds } from '../config';
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
          field: customFieldIds.companyType,
          value: user['custom:company_type'],
        },
        {
          field: customFieldIds.jobRole,
          value: user['custom:job_role'],
        },
        {
          field: customFieldIds.mailingListAccepted,
          value:
            user['custom:mailinglist_accepted'] === 'true' ? 'TRUE' : 'FALSE',
        },
        {
          field: customFieldIds.surveyAccepted,
          value: user['custom:survey_accepted'] === 'true' ? 'TRUE' : 'FALSE',
        },
        {
          field: customFieldIds.preferredLanguage,
          value: user['custom:preferred_language'] || 'it',
        },
      ],
    },
  };
}
