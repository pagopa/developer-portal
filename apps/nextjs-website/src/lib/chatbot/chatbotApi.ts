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
import { Auth } from 'aws-amplify';
import * as t from 'io-ts/lib';

export const postQuery = (input: QueryInput) =>
  pipe(
    R.ask<ChatbotEnv>(),
    R.map(({ config: { CHATBOT_HOST: chatbotHost }, fetch }) =>
      pipe(
        // handle any promise result
        TE.tryCatch(() => Auth.currentSession(), E.toError),
        TE.chainTaskK(
          (session) => () =>
            fetch(`${chatbotHost}/api/queries`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${session
                  .getAccessToken()
                  .getJwtToken()}`,
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

const makeError = ({ status, statusText }: Response) => {
  return new Error(`${status} - ${statusText}`);
};

export const getQueries = (populate: string) =>
  pipe(
    R.ask<ChatbotEnv>(),
    R.map(({ config: { CHATBOT_HOST: chatbotHost }, fetch }) =>
      pipe(
        // handle any promise result
        TE.tryCatch(() => Auth.currentSession(), E.toError),
        TE.chainTaskK(
          (session) => () =>
            fetch(`${chatbotHost}/api/queries?${populate}`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${session
                  .getAccessToken()
                  .getJwtToken()}`,
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

export const getCurrentSession = () =>
  pipe(
    R.ask<ChatbotEnv>(),
    R.map(({ config: { CHATBOT_HOST: chatbotHost }, fetch }) =>
      pipe(
        // handle any promise result
        TE.tryCatch(() => Auth.currentSession(), E.toError),
        TE.chainTaskK(
          (session) => () =>
            fetch(`${chatbotHost}/api/session`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${session
                  .getAccessToken()
                  .getJwtToken()}`,
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
            t.string.decode(json),
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
