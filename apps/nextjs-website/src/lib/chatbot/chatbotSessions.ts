import { pipe } from 'fp-ts/lib/function';
import { RemoteSessionsResponseCodec } from '@/lib/chatbot/queries';
import { ChatbotEnv } from '@/lib/chatbot/chatbotEnv';
import * as E from 'fp-ts/lib/Either';
import * as PR from '@/lib/strapi/PathReporter';
import * as R from 'fp-ts/lib/Reader';
import * as TE from 'fp-ts/lib/TaskEither';
import qs from 'qs';
import { makeError } from '../makeError';

export const getSessions = (page: number, pageSize: number) =>
  pipe(
    R.ask<ChatbotEnv>(),
    R.map(({ config: { CHATBOT_HOST: chatbotHost }, getAuthToken, fetch }) =>
      pipe(
        // handle any promise result
        TE.tryCatch(() => getAuthToken(), E.toError),
        TE.chainTaskK(
          (authToken) => () =>
            fetch(
              `${chatbotHost}/sessions?${qs.stringify({
                page: page,
                pageSize: pageSize,
              })}`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${authToken}`,
                },
              }
            )
        ),
        TE.chain((response) => {
          if (response.status === 200) {
            return TE.tryCatch(() => response.json(), E.toError);
          } else {
            return TE.left(makeError(response));
          }
        }),
        TE.chainEitherK((json) =>
          // decode the response with the given codec
          pipe(
            RemoteSessionsResponseCodec.decode(json),
            E.mapLeft((errors) => new Error(PR.failure(errors).join('\n')))
          )
        ),
        TE.fold(
          // eslint-disable-next-line functional/no-promise-reject
          (errors) => () => Promise.reject(errors),
          (result) => () => Promise.resolve(result)
        )
      )()
    )
  );

export const deleteSession = (sessionId: string) =>
  pipe(
    R.ask<ChatbotEnv>(),
    R.map(({ config: { CHATBOT_HOST: chatbotHost }, getAuthToken, fetch }) =>
      pipe(
        // handle any promise result
        TE.tryCatch(() => getAuthToken(), E.toError),
        TE.chainTaskK(
          (authToken) => () =>
            fetch(`${chatbotHost}/sessions/${sessionId}`, {
              method: 'DELETE',
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
        }),
        TE.fold(
          // eslint-disable-next-line functional/no-promise-reject
          (errors) => () => Promise.reject(errors),
          (result) => () => Promise.resolve(result)
        )
      )()
    )
  );
