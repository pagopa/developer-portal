import { CustomMessageTriggerEvent } from 'aws-lambda';
import { makeHandler } from '../custom-message-handler';
import { makeConfirmationEmail } from '../templates/confirmation-message';
import { makeConfirmationForgotPasswordEmail } from '../templates/confirmation-forgot-password';

const event: CustomMessageTriggerEvent = {
  version: 'aVersion',
  region: 'eu-south-1',
  userPoolId: 'aUserPoolId',
  triggerSource: 'CustomMessage_SignUp',
  userName: 'aUserName',
  callerContext: {
    awsSdkVersion: 'anAwsSdkVersion',
    clientId: 'aClientId',
  },
  request: {
    userAttributes: {
      'custom:mailinglist_accepted': 'false',
      sub: 'aUserIdentity',
      email_verified: 'false',
      'cognito:user_status': 'UNCONFIRMED',
      'custom:privacy_accepted': 'true',
      given_name: 'aGivenName',
      family_name: 'aFamilyName',
      email: 'email@email.com',
    },
    codeParameter: '{####}',
    linkParameter: '{##aLinkParameter##}',
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
  it('should reply with verification link', async () => {
    const { response } = await makeHandler(env)(event);
    const { userAttributes, codeParameter } = event.request;
    const expected = makeConfirmationEmail(
      `https://${env.domain}/auth/confirmation?username=${userAttributes['sub']}&code=${codeParameter}`,
      env.domain
    );
    expect(response.emailMessage).toStrictEqual(expected);
  });

  it('should reply with verification link on resend code request', async () => {
    const resendCodeEvent: CustomMessageTriggerEvent = {
      ...event,
      triggerSource: 'CustomMessage_ResendCode',
    };
    const { response } = await makeHandler(env)(resendCodeEvent);
    const { userAttributes, codeParameter } = resendCodeEvent.request;
    const expected = makeConfirmationEmail(
      `https://${env.domain}/auth/confirmation?username=${userAttributes['sub']}&code=${codeParameter}`,
      env.domain
    );
    expect(response.emailMessage).toStrictEqual(expected);
  });

  it('should reply with link to reset the password', async () => {
    const forgotPasswordEvent: CustomMessageTriggerEvent = {
      ...event,
      triggerSource: 'CustomMessage_ForgotPassword',
    };
    const { response } = await makeHandler(env)(forgotPasswordEvent);
    const { userAttributes, codeParameter } = forgotPasswordEvent.request;
    const expected = makeConfirmationForgotPasswordEmail(
      `https://${env.domain}/auth/change-password?username=${userAttributes['sub']}&code=${codeParameter}`,
      env.domain
    );
    expect(response.emailMessage).toStrictEqual(expected);
  });

  it('should not send any email and return the incoming event', async () => {
    const userVerifiedEvent = {
      ...event,
      request: {
        ...event.request,
        userAttributes: {
          ...event.request.userAttributes,
          'cognito:user_status': 'CONFIRMED',
          email_verified: 'true',
        },
      },
    };
    const actual = await makeHandler(env)(userVerifiedEvent);
    const expected = { ...userVerifiedEvent };
    expect(actual).toStrictEqual(expected);
  });
});
