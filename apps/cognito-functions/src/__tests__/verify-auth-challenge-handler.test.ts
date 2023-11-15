import { VerifyAuthChallengeResponseTriggerEvent } from 'aws-lambda';
import { makeHandler } from '../verify-auth-challenge-handler';

const event: VerifyAuthChallengeResponseTriggerEvent = {
  version: 'aVersion',
  region: 'eu-south-1',
  userPoolId: 'aUserPoolId',
  triggerSource: 'VerifyAuthChallengeResponse_Authentication',
  userName: 'aUserName',
  callerContext: {
    awsSdkVersion: 'anAwsSdkVersion',
    clientId: 'aClientId',
  },
  request: {
    userAttributes: {
      sub: 'user-identity',
      email: 'user-email@email.com',
    },
    privateChallengeParameters: {
      verificationCode: '0123',
    },
    challengeAnswer: '0123',
  },
  response: {
    answerCorrect: false,
  },
};

describe('Handler', () => {
  it('should check the answer and returns the result', async () => {
    const { response: response0 } = await makeHandler()(event);
    const { response: response1 } = await makeHandler()({
      ...event,
      request: { ...event.request, challengeAnswer: '3210' },
    });

    expect(response0).toStrictEqual({ answerCorrect: true });
    expect(response1).toStrictEqual({ answerCorrect: false });
  });
});
