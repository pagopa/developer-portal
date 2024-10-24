import { pipe } from 'fp-ts/lib/function';
import { ChatbotEnv } from '@/lib/chatbot/chatbotEnv';
import * as E from 'fp-ts/lib/Either';
import * as R from 'fp-ts/lib/Reader';
import * as TE from 'fp-ts/lib/TaskEither';
import { makeError } from './chatbotSessions';

export const getHealthz = () =>
  pipe(
    R.ask<ChatbotEnv>(),
    R.map(({ config: { CHATBOT_HOST: chatbotHost }, getAuthToken, fetch }) =>
      pipe(
        // handle any promise result
        TE.tryCatch(() => getAuthToken(), E.toError),
        TE.chainTaskK(
          (authToken) => () =>
            fetch(`${chatbotHost}/healthz`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
              },
            })
        ),
        TE.chain((response) => {
          if (response.status === 200) {
            return TE.tryCatch(() => response.json(), E.toError);
          } else {
            return TE.left(makeError(response));
          }
        })
      )()
    )
  );
