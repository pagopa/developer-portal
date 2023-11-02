import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as PR from 'io-ts/PathReporter';
import * as customMessage from './custom-message-handler';

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
