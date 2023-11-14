import { CustomMessageForgotPasswordTriggerEvent } from 'aws-lambda';
import { makeHandler } from '../custom-message-forgot-password-handler';
import { makeConfirmationForgotPasswordEmail } from '../templates/confirmation-message-forgot-password';

const event: CustomMessageForgotPasswordTriggerEvent = {
  version: 'aVersion',
  region: 'eu-south-1',
  userPoolId: 'aUserPoolId',
  triggerSource: 'CustomMessage_ForgotPassword',
  userName: 'aUserName',
  callerContext: {
    awsSdkVersion: 'anAwsSdkVersion',
    clientId: 'aClientId',
  },
  request: {
    userAttributes: {
      sub: 'user-identity',
    },
    codeParameter: '####',
    linkParameter: 'aLinkParameter',
    usernameParameter: null,
  },
  response: {
    smsMessage: null,
    emailMessage: null,
    emailSubject: null,
  },
};

describe('Handler', () => {
  const env = {
    domain: 'thedomain.org',
  };
  it('should reply with forgot password link', async () => {
    const { response } = await makeHandler(env)(event);
    const { userAttributes } = event.request;
    const expected = makeConfirmationForgotPasswordEmail(
      `https://${env.domain}/auth/forgot-password?username=${userAttributes['sub']}`
    );
    expect(response.emailMessage).toStrictEqual(expected);
  });
});
