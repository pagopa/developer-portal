import { pipe } from 'fp-ts/lib/function';
import {
  ChatbotQueriesCodec,
  QueryCodec,
  QueryInput,
} from '@/lib/chatbot/queries';
import { ChatbotEnv } from '@/lib/chatbot/chatbotEnv';
import * as E from 'fp-ts/lib/Either';
import * as PR from '@/lib/strapi/PathReporter';
import * as R from 'fp-ts/lib/Reader';
import * as TE from 'fp-ts/lib/TaskEither';
import { makeError } from '../makeError';

export const postQuery = (input: QueryInput) =>
  pipe(
    R.ask<ChatbotEnv>(),
    R.map(({ config: { CHATBOT_HOST: chatbotHost }, getAuthToken, fetch }) =>
      pipe(
        // handle any promise result
        TE.tryCatch(() => getAuthToken(), E.toError),
        TE.chainTaskK(
          (authToken) => () =>
            fetch(`${chatbotHost}/queries`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify(input),
            })
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
            QueryCodec.decode(json),
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

export const getQueries = (query: string) =>
  pipe(
    R.ask<ChatbotEnv>(),
    R.map(({ config: { CHATBOT_HOST: chatbotHost }, getAuthToken, fetch }) =>
      pipe(
        // handle any promise result
        TE.tryCatch(() => getAuthToken(), E.toError),
        TE.chainTaskK(
          (authToken) => () =>
            fetch(`${chatbotHost}/queries?${query}`, {
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
        }),
        TE.chainEitherK((json) =>
          // decode the response with the given codec
          pipe(
            ChatbotQueriesCodec.decode(json),
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

export const patchFeedback = (
  badAnswer: boolean,
  sessionId: string,
  queryId: string,
  user_response_relevancy: number | null,
  user_faithfullness: number | null,
  user_comment: string
) =>
  pipe(
    R.ask<ChatbotEnv>(),
    R.map(({ config: { CHATBOT_HOST: chatbotHost }, getAuthToken, fetch }) =>
      pipe(
        // handle any promise result
        TE.tryCatch(() => getAuthToken(), E.toError),
        TE.chainTaskK(
          (authToken) => () =>
            fetch(`${chatbotHost}/sessions/${sessionId}/queries/${queryId}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify({
                badAnswer: badAnswer,
                feedback: {
                  user_response_relevancy: user_response_relevancy,
                  user_faithfullness: user_faithfullness,
                  user_comment: user_comment,
                },
              }),
            })
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
            QueryCodec.decode(json),
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
