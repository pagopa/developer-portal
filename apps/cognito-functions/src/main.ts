import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as PR from 'io-ts/PathReporter';
import * as customMessage from './custom-message-handler';
import { SES } from '@aws-sdk/client-ses';
import * as sendEmail from './post-confirmation-confirm-sign-up-handler';

export const customMessageHandler = pipe(
  { domain: process.env.DOMAIN },
  customMessage.CustomMessageEnv.decode,
  E.fold((errors) => {
    // eslint-disable-next-line functional/no-expression-statements
    console.log(PR.failure(errors).join('\n'));
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error();
  }, customMessage.makeHandler)
);

export const sensEmailHandler = pipe(
  { fromEmailAddress: process.env.FROM_EMAIL_ADDRESS },
  sendEmail.PostConfirmationConfig.decode,
  E.fold(
    (errors) => {
      // eslint-disable-next-line functional/no-expression-statements
      console.log(PR.failure(errors).join('\n'));
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error();
    },
    (config) =>
      sendEmail.makeHandler({
        ses: new SES(),
        config,
      })
  )
);
