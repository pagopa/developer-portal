export type User = {
  readonly username: string;
  readonly email: string;
  readonly given_name: string;
  readonly family_name: string;
  readonly 'custom:mailinglist_accepted': string;
  readonly 'custom:survey_accepted'?: string;
  readonly 'custom:company_type': string;
  readonly 'custom:job_role': string;
  readonly 'custom:preferred_language'?: string;
};
