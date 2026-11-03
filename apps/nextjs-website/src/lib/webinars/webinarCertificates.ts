import * as t from 'io-ts';
import { PathReporter } from 'io-ts/PathReporter';
import * as RTE from 'fp-ts/ReaderTaskEither';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { BrowserEnv } from '@/browserEnv';

const CertificateResponse = t.array(
  t.type({
    webinarid: t.string,
    minutes_spent_watching: t.string,
    webinar_duration_minutes: t.string,
    watch_percentage: t.string,
    reached_80_percent_at: t.string,
    last_viewed_at: t.string,
  })
);
export type CertificateResponse = t.TypeOf<typeof CertificateResponse>;

export const listUserWebinarCertificates = () =>
  pipe(
    RTE.ask<Pick<BrowserEnv, 'videoApiBaseUrl' | 'getVideoApiToken'>>(),
    RTE.chainTaskEitherK(({ videoApiBaseUrl, getVideoApiToken }) =>
      pipe(
        getVideoApiToken(),
        TE.chain((token) =>
          TE.tryCatch(
            () =>
              fetch(`${videoApiBaseUrl}/certificate`, {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }),
            E.toError
          )
        )
      )
    ),
    RTE.chainTaskEitherK((response) =>
      response.ok
        ? TE.tryCatch(() => response.json(), E.toError)
        : TE.left(new Error(`Unexpected status: ${response.status}`))
    ),
    RTE.chainEitherK((json) =>
      pipe(
        CertificateResponse.decode(json),
        E.mapLeft(
          (errors) => new Error(PathReporter.report(E.left(errors)).join('\n'))
        )
      )
    )
  );
