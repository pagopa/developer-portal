import { CustomMessageTriggerEvent } from 'aws-lambda';
import { emailTemplate, makeHandler } from '../custom-message-handler';

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
  it('should reply with verification link', async () => {
    const env = {
      domain: 'thedomain.org',
    };
    const { response } = await makeHandler(env)(event);
    const { userAttributes, codeParameter } = event.request;
    const expected = emailTemplate(
      `https://${env.domain}/auth/confirmation?username=${userAttributes['sub']}&code=${codeParameter}`
    );
    expect(response.emailMessage).toStrictEqual(expected);
  });

  it('should reply with verification link on resend code request', async () => {
    const env = {
      domain: 'thedomain.org',
    };
    const { response } = await makeHandler(env)({
      ...event,
      triggerSource: 'CustomMessage_ResendCode',
    });
    const { userAttributes, codeParameter } = event.request;
    const expected = emailTemplate(
      `https://${env.domain}/auth/confirmation?username=${userAttributes['sub']}&code=${codeParameter}`
    );
    expect(response.emailMessage).toStrictEqual(expected);
  });
});
