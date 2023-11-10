import { CustomMessageTriggerEvent } from 'aws-lambda';
import { makeHandler } from '../custom-message-handler';
import { makeConfirmationEmail } from '../templates/confirmation-message';

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
  it('should reply with verification link', async () => {
    const { response } = await makeHandler(env)(event);
    const { userAttributes, codeParameter } = event.request;
    const expected = makeConfirmationEmail(
      `https://${env.domain}/auth/confirmation?username=${userAttributes['sub']}&code=${codeParameter}`
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
      `https://${env.domain}/auth/confirmation?username=${userAttributes['sub']}&code=${codeParameter}`
    );
    expect(response.emailMessage).toStrictEqual(expected);
  });
});
