import * as t from 'io-ts';
import crypto from 'crypto';
import { CreateAuthChallengeTriggerEvent } from 'aws-lambda';
import {
  SES,
  SendEmailCommand,
  SendEmailCommandInput,
} from '@aws-sdk/client-ses';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';
import * as E from 'fp-ts/Either';
import { makeOtpMessageEmail } from './templates/otp-message';

export const generateVerificationCode = (): string =>
  Array.from({ length: 6 }, () => crypto.randomInt(0, 9)).join('');

export const makeSesEmailParameters = (
  to: string,
  from: string,
  subject: string,
  body: string
): SendEmailCommandInput => ({
  Destination: {
    ToAddresses: [to],
  },
  Message: {
    Body: {
      Html: {
        Data: body,
      },
    },
    Subject: {
      Data: subject,
    },
  },
  Source: from,
});

export const CreateAuthChallengeConfig = t.type({
  fromEmailAddress: t.string,
  domain: t.string,
});
type CreateAuthChallengeConfig = t.TypeOf<typeof CreateAuthChallengeConfig>;

type CreateAuthChallengeEnv = {
  readonly config: CreateAuthChallengeConfig;
  readonly generateVerificationCode: () => string;
  readonly ses: SES;
};

// FIXME: we could get this parameter from the app client configuration
// https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-authentication-flow.html
export const OTP_DURATION_MINUTES = 3;

export const makeHandler =
  (env: CreateAuthChallengeEnv) =>
  async (
    event: CreateAuthChallengeTriggerEvent
  ): Promise<CreateAuthChallengeTriggerEvent> => {
    const { session } = event.request;

    // only called once after SRP_A and PASSWORD_VERIFIER challenges. Hence
    // session.length == 2
    if (session.length === 2) {
      const { email } = event.request.userAttributes;
      const verificationCode = env.generateVerificationCode();
      const subject = `Codice di verifica PagoPA DevPortal: ${verificationCode}`;
      const sendEmailCommand = new SendEmailCommand(
        makeSesEmailParameters(
          email,
          env.config.fromEmailAddress,
          subject,
          makeOtpMessageEmail(
            verificationCode,
            env.config.domain,
            OTP_DURATION_MINUTES
          )
        )
      );

      const sendEmail = pipe(
        TE.tryCatch(() => env.ses.send(sendEmailCommand), E.toError),
        TE.bimap(
          ({ message }) => `Error when sending the email: ${message}`,
          ({ MessageId }) => MessageId
        ),
        TE.toUnion,
        T.map(() => ({
          ...event,
          response: {
            ...event.response,
            privateChallengeParameters: {
              verificationCode,
            },
          },
        }))
      );

      // eslint-disable-next-line functional/no-expression-statements
      return await sendEmail();
    } else {
      return event;
    }
  };
