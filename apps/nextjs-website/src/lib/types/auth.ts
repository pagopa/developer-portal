import { CognitoUser } from '@aws-amplify/auth';

export type DevPortalUser = CognitoUser & {
  readonly attributes: {
    readonly email: string;
    readonly email_verified: boolean;
    readonly family_name: string;
    readonly given_name: string;
    readonly sub: string;
  };
};
