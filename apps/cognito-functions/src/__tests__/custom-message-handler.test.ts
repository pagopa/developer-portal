import { CustomMessageTriggerEvent } from 'aws-lambda';
import { handler } from '../custom-message-handler';

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
    const { response } = await handler(event);
    const expected =
      'Your confirmation code is <a href="https://domain/auth/confirmation?username=user-identity&code=####">Verify</a>.';
    expect(response.emailMessage).toStrictEqual(expected);
  });
});
