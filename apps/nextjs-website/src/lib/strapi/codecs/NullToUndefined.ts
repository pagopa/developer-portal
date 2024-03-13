import * as t from 'io-ts/lib';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';

/**
 * This type is used to convert null to undefined when decoding.
 * This is useful becuase Strapi returns null for missing fields, so we want to convert those to undefined to be more consistent with the rest of our codebase.
 *
 * @example
 * const codec = t.union([NullToUndefined, t.string]);
 * const result = codec.decode(null);
 * // result will be Right(undefined)
 */
export const NullToUndefined = new t.Type<undefined, null, unknown>(
  // name: a unique name for this codec
  'NullToUndefined',
  // is: a custom type guard
  t.undefined.is,
  // validate: succeeds if a value of type I can be decoded to a value of type A
  (u, c) =>
    pipe(
      t.null.validate(u, c),
      E.map(() => undefined)
    ),
  // encode: converts a value of type A to a value of type O
  () => null
);
