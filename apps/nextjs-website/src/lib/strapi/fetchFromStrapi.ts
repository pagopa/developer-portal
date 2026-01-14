import { pipe } from 'fp-ts/lib/function';
import * as R from 'fp-ts/lib/Reader';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { StrapiEnv } from '@/lib/strapi/StrapiEnv';
import { makeError } from '../makeError';

export const fetchFromStrapi = <T>(path: string, populate: string) =>
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
              fetchFun(`${strapiEndpoint}/api/${path}/?${populate}`, {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${strapiApiToken}`,
                  'Strapi-Response-Format': 'v4',
                },
                cache: 'no-store',
              }),
            E.toError
          ),
          TE.chain((response) => {
            if (response.status === 200) {
              return TE.tryCatch(() => response.json(), E.toError);
            } else {
              // eslint-disable-next-line functional/no-expression-statements
              console.log(`${strapiEndpoint}/api/${path}/?${populate}`);
              return TE.left(makeError(response));
            }
          }),
          TE.map(nullsToUndefined),
          TE.map((json) => json as T),
          TE.fold(
            // eslint-disable-next-line functional/no-promise-reject
            (errors) => () => Promise.reject(errors),
            (result) => () => Promise.resolve(result)
          )
        )()
    )
  );

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function nullsToUndefined(obj: any): any {
  if (obj === null) return undefined;
  if (Array.isArray(obj)) {
    return obj.map(nullsToUndefined);
  }
  if (typeof obj === 'object' && obj !== undefined) {
    return Object.entries(obj)
      .map(([key, value]) => [key, nullsToUndefined(value)] as const)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
  }
  return obj;
}
