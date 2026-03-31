import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as R from 'fp-ts/lib/Reader';
import * as TE from 'fp-ts/lib/TaskEither';
import { makeErrorByMessage } from '@/lib/makeError';
import { Auth } from 'aws-amplify';

export type WebinarHeartbeatEnv = {
  readonly config: {
    readonly url: string;
  };
  readonly getSessionInfo: () => Promise<{
    readonly username: string;
    readonly token: string;
  }>;
  readonly fetch: typeof fetch;
};

export type WebinarHeartbeatParams = {
  readonly webinarSlug: string;
  readonly isLive: boolean;
  readonly action: string;
};

export const makeWebinarHeartbeatEnv = (url: string): WebinarHeartbeatEnv => ({
  config: {
    url: url,
  },
  getSessionInfo: async () =>
    Auth.currentSession().then((session) => ({
      username: session.getIdToken().payload['cognito:username'],
      token: session.getIdToken().getJwtToken(),
    })),
  fetch: fetch,
});

export const makeWebinarHeartbeatEnvConfig = (
  url?: string
): E.Either<string, WebinarHeartbeatEnv> =>
  url
    ? E.right(makeWebinarHeartbeatEnv(url))
    : E.left('Missing env var NEXT_PUBLIC_WEBINAR_HEARTBEAT_URL');

export const postWebinarHeartbeat = (params: WebinarHeartbeatParams) =>
  pipe(
    R.ask<WebinarHeartbeatEnv>(),
    R.map(({ config: { url: webinarHeartbeatUrl }, getSessionInfo, fetch }) =>
      pipe(
        // handle any promise result
        TE.tryCatch(() => getSessionInfo(), E.toError),
        TE.chain((sessionInfo) =>
          TE.tryCatch(
            () =>
              fetch(`${webinarHeartbeatUrl}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${sessionInfo.token}`,
                },
                body: JSON.stringify({
                  userId: sessionInfo.username,
                  webinarId: params.webinarSlug,
                  isLive: params.isLive,
                  action: params.action,
                }),
              }),
            E.toError
          )
        ),
        TE.chain((response) => {
          const acceptedStatusCode = 200;
          if (response.status === acceptedStatusCode) {
            return TE.tryCatch(() => response.json(), E.toError);
          } else {
            return TE.left(
              makeErrorByMessage(`${response.status} != ${acceptedStatusCode}`)
            );
          }
        }),
        TE.map((json) => json as unknown),
        TE.fold(
          // eslint-disable-next-line functional/no-promise-reject
          (errors) => () => Promise.reject(errors),
          (result) => () => Promise.resolve(result)
        )
      )()
    )
  );
