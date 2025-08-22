import * as t from 'io-ts';
import { pipe } from 'fp-ts/lib/function';
import * as R from 'fp-ts/lib/Reader';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import * as PR from './PathReporter';
import { StrapiEnv } from '@/lib/strapi/StrapiEnv';
import { makeError } from '../makeError';

// Function to invoke in order to retrieve data from Strapi.
export const fetchFromStrapi = <A, O, I>(
  path: string,
  populate: string,
  codec: t.Type<A, O, I>,
  locale?: string
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
          TE.tryCatch(() => {
            const url = `${strapiEndpoint}/api/${path}/?${populate}${
              locale ? `&locale=${locale}` : ''
            }`;
            return fetchFun(url, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${strapiApiToken}`,
              },
              cache: 'no-store',
            });
          }, E.toError),
          TE.chain((response) => {
            if (response.status === 200) {
              return TE.tryCatch(() => response.json(), E.toError);
            } else if (response.status === 404 && locale && locale !== 'it') {
              // Fallback: retry with default locale if content not found for requested locale
              // eslint-disable-next-line functional/no-expression-statements
              console.warn(
                `Content not found for locale '${locale}', falling back to default locale 'it' for ${path}`
              );
              const fallbackUrl = `${strapiEndpoint}/api/${path}/?${populate}&locale=it`;
              return pipe(
                TE.tryCatch(
                  () =>
                    fetchFun(fallbackUrl, {
                      method: 'GET',
                      headers: {
                        Authorization: `Bearer ${strapiApiToken}`,
                      },
                      cache: 'no-store',
                    }),
                  E.toError
                ),
                TE.chain((fallbackResponse) => {
                  if (fallbackResponse.status === 200) {
                    return TE.tryCatch(
                      () => fallbackResponse.json(),
                      E.toError
                    );
                  } else {
                    return TE.left(makeError(fallbackResponse));
                  }
                })
              );
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
