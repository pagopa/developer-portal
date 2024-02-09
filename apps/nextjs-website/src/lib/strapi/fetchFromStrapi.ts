import * as t from 'io-ts';
import { pipe } from 'fp-ts/lib/function';
import * as R from 'fp-ts/lib/Reader';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import * as PR from 'io-ts/lib/PathReporter';
import { StrapiEnv } from '@/lib/strapi/StapiEnv';

// Function to invoke in order to retrieve data from Strapi.
export const fetchFromStrapi = <A, O, I>(
  path: string,
  populate: '*' | string,
  codec: t.Type<A, O, I>
) =>
  pipe(
    R.ask<StrapiEnv>(),
    R.map(
      ({
        config: {
          STRAPI_ENDPOINT: strapiEndpoint,
          STRAPI_API_TOKEN: strapiApiToken,
        },
        fetchFun,
      }) =>
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

const makeError = ({ status, statusText }: Response) => {
  return new Error(`${status} - ${statusText}`);
};
