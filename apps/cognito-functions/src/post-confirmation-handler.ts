import {
  SES,
  SendEmailCommand,
  SendEmailCommandInput,
} from '@aws-sdk/client-ses';
import * as t from 'io-ts';
import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { makePostConfirmationConfirmSignUpEmail } from './templates/post-confirmation-confirm-sign-up-message';
import { EMAIL_TRANSLATIONS } from './templates/translations';
import { PostConfirmationTriggerEvent } from 'aws-lambda/trigger/cognito-user-pool-trigger/post-confirmation';
import { SUPPORTED_LOCALES } from './i18n/locales';
import { DEFAULT_LOCALE } from './i18n/locales';

const makeSesEmailParameters = (
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

export const PostConfirmationConfig = t.type({
  domain: t.string,
  fromEmailAddress: t.string,
});
type SendEmailConfig = t.TypeOf<typeof PostConfirmationConfig>;

type PostConfirmationEnv = {
  readonly config: SendEmailConfig;
  readonly ses: SES;
};

export const makeHandler =
  ({ ses, config }: PostConfirmationEnv) =>
  async (
    event: PostConfirmationTriggerEvent
  ): Promise<PostConfirmationTriggerEvent> => {
    const { email, given_name } = event.request.userAttributes;
    const localeAttribute =
      event.request.userAttributes['custom:preferred_language'];
    const locale = SUPPORTED_LOCALES.includes(localeAttribute)
      ? localeAttribute
      : DEFAULT_LOCALE;

    if (email && event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
      const subject =
        EMAIL_TRANSLATIONS.postConfirmation[
          locale as keyof typeof EMAIL_TRANSLATIONS.postConfirmation
        ]?.subject ||
        EMAIL_TRANSLATIONS.postConfirmation[DEFAULT_LOCALE].subject;

      const body = makePostConfirmationConfirmSignUpEmail(
        given_name,
        config.domain,
        locale
      );
      const sendEmail = pipe(
        makeSesEmailParameters(email, config.fromEmailAddress, subject, body),
        (sendEmailCommandInput) => new SendEmailCommand(sendEmailCommandInput),
        (sendEmailCommand) =>
          TE.tryCatch(() => ses.send(sendEmailCommand), E.toError),
        TE.bimap(
          ({ message }) => `Error when sending the email: ${message}`,
          ({ MessageId }) => MessageId
        ),
        TE.toUnion,
        T.map(() => event)
      );

      return await sendEmail();
    }
    return event;
  };
