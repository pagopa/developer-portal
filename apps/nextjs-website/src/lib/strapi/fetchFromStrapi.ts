import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { StrapiEnv } from '@/lib/strapi/StrapiEnv';
import { makeError } from '@/lib/makeError';

export const fetchFromStrapi =
  <T>(path: string, populate: string) =>
  (locale: string, strapiEnv: StrapiEnv) =>
    pipe(
      TE.tryCatch(
        () =>
          strapiEnv.fetchFun(
            `${strapiEnv.config.STRAPI_ENDPOINT}/api/${path}/?locale=${locale}&${populate}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${strapiEnv.config.STRAPI_API_TOKEN}`,
              },
              cache: 'no-store',
            }
          ),
        E.toError
      ),
      TE.chain((response) => {
        if (response.status === 200) {
          return TE.tryCatch(() => response.json(), E.toError);
        } else {
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
    )();

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
