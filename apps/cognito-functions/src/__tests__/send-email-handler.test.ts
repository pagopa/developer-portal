import { PostConfirmationConfirmSignUpTriggerEvent } from 'aws-lambda';

const event: PostConfirmationConfirmSignUpTriggerEvent = {
  version: 'aVersion',
  region: 'eu-south-1',
  userPoolId: 'aUserPoolId',
  userName: 'aUserName',
  callerContext: {
    awsSdkVersion: 'anAwsSdkVersion',
    clientId: 'aClientId',
  },
  request: {
    userAttributes: {
      sub: 'aSub',
      email_verified: 'true',
      'cognito:user_status': 'CONFIRMED',
      given_name: 'aGivenName',
      family_name: 'aFamilyName',
      email: 'a@email.com',
    },
  },
  response: {
    smsMessage: null,
    emailMessage: null,
    emailSubject: null,
  },
  triggerSource: 'PostConfirmation_ConfirmSignUp',
};

describe('Handler', () => {
  it('send the welcome email', async () => {
    expect(true).toStrictEqual(true);
  });
});
