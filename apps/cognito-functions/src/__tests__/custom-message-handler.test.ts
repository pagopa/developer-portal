import { CustomMessageTriggerEvent } from 'aws-lambda';
import { makeHandler } from '../custom-message-handler';
import { makeConfirmationEmail } from '../templates/confirmation-message';
import { makeConfirmationForgotPasswordEmail } from '../templates/confirmation-forgot-password';

const makeEvent = (): CustomMessageTriggerEvent => ({
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
});

describe('Handler', () => {
  const env = {
    domain: 'thedomain.org',
  };
  it('should reply with verification link', async () => {
    const event = makeEvent();
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
      ...makeEvent(),
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
    const event = makeEvent();
    const forgotPasswordEvent: CustomMessageTriggerEvent = {
      ...event,
      triggerSource: 'CustomMessage_ForgotPassword',
      request: {
        ...event.request,
        userAttributes: {
          ...event.request.userAttributes,
          'cognito:user_status': 'CONFIRMED',
          email_verified: 'true',
        },
      },
    };
    const { response } = await makeHandler(env)(forgotPasswordEvent);
    const { userAttributes, codeParameter } = forgotPasswordEvent.request;
    const expected = makeConfirmationForgotPasswordEmail(
      `https://${env.domain}/auth/change-password?username=${userAttributes['sub']}&code=${codeParameter}`,
      env.domain
    );
    expect(response.emailMessage).toStrictEqual(expected);
  });

  it('should throw an error on user confirmed', async () => {
    const event = makeEvent();
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

    // eslint-disable-next-line functional/no-try-statements
    try {
      await makeHandler(env)(userVerifiedEvent);
      fail('Should not reach this point');
    } catch (error) {
      expect(error).toStrictEqual(new Error('Operation not permitted'));
    }
  });
});
