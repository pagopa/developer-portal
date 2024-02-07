import * as t from 'io-ts';
import * as E from 'fp-ts/lib/Either';
import * as PR from 'io-ts/lib/PathReporter';
import { pipe } from 'fp-ts/lib/function';

const StrapiConfigCodec = t.type({
  STRAPI_ENDPOINT: t.string,
  STRAPI_API_TOKEN: t.string,
});

export type StrapiConfig = t.TypeOf<typeof StrapiConfigCodec>;

export const makeStrapiConfig = (
  env: Record<string, undefined | string>
): E.Either<string, StrapiConfig> =>
  pipe(
    StrapiConfigCodec.decode(env),
    E.mapLeft((errors) => PR.failure(errors).join('\n'))
  );
