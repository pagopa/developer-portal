import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as PR from 'io-ts/lib/PathReporter';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';

const BuildConfigCodec = t.type({
  FETCH_FROM_STRAPI: t.string.pipe(tt.BooleanFromString),
});

export type BuildConfig = t.TypeOf<typeof BuildConfigCodec>;

export const makeBuildConfig = (
  env: Record<string, undefined | string>
): E.Either<string, BuildConfig> =>
  pipe(
    BuildConfigCodec.decode(env),
    E.mapLeft((errors) => PR.failure(errors).join('\n'))
  );
