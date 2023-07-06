import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { ioSign } from './ioSign';
import { parseDoc } from 'gitbook-docs/parseDoc';
import { makeGuide } from '../makeDocs';

const manualeOperativo = makeGuide({
  product: ioSign,
  guide: {
    name: 'Manuale Operativo',
    slug: 'manuale-operativo',
  },
  versions: [
    {
      version: 'v1.0',
      dirName: 'AdBuOCmwur7AhLlgfCeG',
    },
  ],
});

export const ioSignGuides = pipe(
  manualeOperativo,
  RA.traverse(E.Applicative)(parseDoc),
  E.fold((e) => {
    // eslint-disable-next-line functional/no-expression-statements
    console.log(e);
    // eslint-disable-next-line functional/no-throw-statements
    throw e;
  }, RA.flatten)
);
