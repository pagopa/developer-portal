import { CreateAuthChallengeTriggerEvent } from 'aws-lambda';
import {
  generateVerificationCode,
  makeHandler,
} from '../create-auth-challenge-handler';
import { SES } from '@aws-sdk/client-ses';
import { mock } from 'jest-mock-extended';
import { makeOtpMessageEmail } from '../templates/otp-message';

const event: CreateAuthChallengeTriggerEvent = {
  version: 'aVersion',
  region: 'eu-south-1',
  userPoolId: 'aUserPoolId',
  triggerSource: 'CreateAuthChallenge_Authentication',
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
    challengeName: '',
    session: [
      { challengeName: 'SRP_A', challengeResult: true },
      { challengeName: 'PASSWORD_VERIFIER', challengeResult: true },
    ],
  },
  response: {
    publicChallengeParameters: {},
    privateChallengeParameters: {},
    challengeMetadata: '',
  },
};

const makeTestEnv = () => {
  const sesMock = mock<SES>();
  const verificationCode = '0123';
  const env = {
    config: {
      fromEmailAddress: 'from@email.com',
      domain: 'adomain.com',
    },
    generateVerificationCode: () => verificationCode,
    ses: sesMock,
  };
  return { env, sesMock, verificationCode };
};

describe('Handler', () => {
  it('should generate a verificationCode and send it via email', async () => {
    const { env, sesMock, verificationCode } = makeTestEnv();
    const { response } = await makeHandler(env)(event);

    sesMock.send.mockImplementationOnce(() =>
      Promise.resolve({
        MessageId: 'aMessageId',
      })
    );

    const expected = {
      ...event.response,
      privateChallengeParameters: {
        verificationCode,
      },
    };

    expect(response).toStrictEqual(expected);
    expect(sesMock.send).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          Source: env.config.fromEmailAddress,
          Destination: {
            ToAddresses: [event.request.userAttributes.email],
          },
          Message: {
            Body: {
              Html: {
                Data: makeOtpMessageEmail(verificationCode, env.config.domain),
              },
            },
            Subject: {
              Data: 'Ecco il tuo OTP per la login',
            },
          },
        },
      })
    );
  });
});

describe('generateVerificationCode', () => {
  it('generate 6 digit code', () => {
    const actual = generateVerificationCode();
    const codeFormatRegExp = new RegExp(/^\d{6}$/);
    expect(codeFormatRegExp.test(actual)).toBeTruthy();
  });

  it('generate different values', () => {
    const code0 = generateVerificationCode();
    const code1 = generateVerificationCode();

    expect(code0).not.toEqual(code1);
  });
});
