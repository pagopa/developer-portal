import * as t from 'io-ts';
import { pipe } from 'fp-ts/lib/function';
import * as R from 'fp-ts/lib/Reader';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import * as PR from 'io-ts/lib/PathReporter';

// This type represents the environment of strapi. It contains
// configuration as well as other dependencies required by strapi. In
// other words contains all runtime configuration and global functions that may
// be mockable
export type StrapiEnv = {
  readonly strapiEndpoint: string;
  readonly strapiApiToken: string;
  readonly fetchFun: typeof fetch;
};

export const fetchFromStrapi = <A, O, I>(
  path: string,
  populate: '*' | string,
  codec: t.Type<A, O, I>
) =>
  pipe(
    R.ask<StrapiEnv>(),
    R.map(({ strapiEndpoint, strapiApiToken, fetchFun }) =>
      pipe(
        // handle any promise result
        TE.tryCatch(
          () =>
            fetchFun(`${strapiEndpoint}/api/${path}/?populate=${populate}`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${strapiApiToken}`,
              },
            }),
          E.toError
        ),
        // handle any error on json function
        TE.chain((response) => TE.tryCatch(() => response.json(), E.toError)),
        TE.chainEitherK((json) =>
          // decode the response with the given codec
          pipe(
            codec.decode(json),
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
