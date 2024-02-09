import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { Auth } from 'aws-amplify';
import { BrowserConfig } from '@/BrowserConfig';

// Create a aws credentials provider given a cognito user
export const makeAwsCredentialsFromCognito = (
  config: BrowserConfig,
  getCurrentSession: typeof Auth.currentSession
) => {
  const providerName = `cognito-idp.${config.NEXT_PUBLIC_COGNITO_REGION}.amazonaws.com/${config.NEXT_PUBLIC_COGNITO_USER_POOL_ID}`;
  // create custom credentials provider
  return async () => {
    // get session of the user
    const session = await getCurrentSession();

    const credentials = fromCognitoIdentityPool({
      clientConfig: { region: config.NEXT_PUBLIC_COGNITO_REGION },
      identityPoolId: config.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID,
      logins: {
        [providerName]: session.getIdToken().getJwtToken(),
      },
    });

    return await credentials();
  };
};
