import { DefineAuthChallengeTriggerEvent } from 'aws-lambda';
import { makeHandler } from '../define-auth-challenge-handler';

const makeEvent = (
  session: DefineAuthChallengeTriggerEvent['request']['session'] = []
): DefineAuthChallengeTriggerEvent => ({
  version: 'aVersion',
  region: 'eu-south-1',
  userPoolId: 'aUserPoolId',
  triggerSource: 'DefineAuthChallenge_Authentication',
  userName: 'aUserName',
  callerContext: {
    awsSdkVersion: 'anAwsSdkVersion',
    clientId: 'aClientId',
  },
  request: {
    userAttributes: {
      sub: 'user-identity',
    },
    session,
  },
  response: {
    challengeName: '',
    failAuthentication: false,
    issueTokens: false,
  },
});

const sessionSRP_A: DefineAuthChallengeTriggerEvent['request']['session'][0] = {
  challengeName: 'SRP_A',
  challengeResult: true,
};

const sessionPASSWORD_VERIFIER: DefineAuthChallengeTriggerEvent['request']['session'][0] =
  {
    challengeName: 'PASSWORD_VERIFIER',
    challengeResult: true,
  };

const sessionCUSTOM_CHALLENGE: DefineAuthChallengeTriggerEvent['request']['session'][0] =
  {
    challengeName: 'CUSTOM_CHALLENGE',
    challengeResult: true,
  };
const sessionCUSTOM_CHALLENGE_fail = {
  ...sessionCUSTOM_CHALLENGE,
  challengeResult: false,
};

describe('Handler', () => {
  it('should fail authentication if session is empty', async () => {
    const event = makeEvent();
    const { response } = await makeHandler()(event);
    const expected = {
      ...event.response,
      failAuthentication: true,
      issueTokens: false,
    };
    expect(response).toStrictEqual(expected);
  });
  it('should move to `PASSWORD_VERIFIER` challenge after `SRP_A`', async () => {
    const session = [sessionSRP_A];
    const { response } = await makeHandler()(makeEvent(session));
    const expected = {
      challengeName: 'PASSWORD_VERIFIER',
      failAuthentication: false,
      issueTokens: false,
    };
    expect(response).toStrictEqual(expected);
  });
  it('should move to `CUSTOM_CHALLENGE` challenge after `PASSWORD_VERIFIER`', async () => {
    const session = [sessionSRP_A, sessionPASSWORD_VERIFIER];
    const { response } = await makeHandler()(makeEvent(session));
    const expected = {
      challengeName: 'CUSTOM_CHALLENGE',
      failAuthentication: false,
      issueTokens: false,
    };
    expect(response).toStrictEqual(expected);
  });
  it('should issue the token if `CUSTOM_CHALLENGE` is successful completed', async () => {
    const event = makeEvent([
      sessionSRP_A,
      sessionPASSWORD_VERIFIER,
      sessionCUSTOM_CHALLENGE,
    ]);
    const { response } = await makeHandler()(event);
    const expected = {
      ...event.response,
      failAuthentication: false,
      issueTokens: true,
    };
    expect(response).toStrictEqual(expected);
  });
  it('should fail if `CUSTOM_CHALLENGE` was failed', async () => {
    const event = makeEvent([
      sessionSRP_A,
      sessionPASSWORD_VERIFIER,
      sessionCUSTOM_CHALLENGE_fail,
    ]);
    const { response } = await makeHandler()(event);
    const expected = {
      ...event.response,
      failAuthentication: true,
      issueTokens: false,
    };
    expect(response).toStrictEqual(expected);
  });
});
