import { CognitoUser } from '@aws-amplify/auth';
import { WebinarSubscription } from '../webinars/webinarSubscriptions';

export type DevPortalUser = CognitoUser & {
  readonly username: string;
  readonly attributes: {
    readonly email: string;
    readonly email_verified: boolean;
    readonly family_name: string;
    readonly given_name: string;
    readonly sub: string;
    readonly 'custom:company_type': string;
    readonly 'custom:job_role': string;
    readonly 'custom:mailinglist_accepted': 'true' | 'false';
    readonly 'custom:survey_accepted'?: 'true' | 'false';
    readonly 'custom:privacy_accepted': boolean;
    readonly 'custom:user_preferences'?: string;
    readonly 'custom:preferred_language'?: string;
  };
  readonly webinarSubscriptions?: readonly WebinarSubscription[];
};

export type UserPreferences = {
  readonly subscribedWebinarSlugs: readonly string[];
};
