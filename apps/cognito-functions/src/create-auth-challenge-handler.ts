import * as t from 'io-ts';
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

export const emailTemplate = (verificationCode: string) => `
Il tuo codice di verifica per la login è <strong>${verificationCode}</strong>
`;

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
});
type CreateAuthChallengeConfig = t.TypeOf<typeof CreateAuthChallengeConfig>;

type CreateAuthChallengeEnv = {
  readonly config: CreateAuthChallengeConfig;
  readonly generateVerificationCode: () => string;
  readonly ses: SES;
};

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
      const verificationCode = env.generateVerificationCode(); // env.crypto.randomBytes(3).toString('hex');
      const subject = 'Ecco il tuo OTP per la login';
      const sendEmailCommand = new SendEmailCommand(
        makeSesEmailParameters(
          email,
          env.config.fromEmailAddress,
          subject,
          emailTemplate(verificationCode)
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
