import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { docsAssetsPath, docsPath } from '@/config';
import { ioSign } from './ioSign';
import { parseDoc } from 'gitbook-docs/parseDoc';

const manualeOperativo = {
  name: 'Manuale Operativo',
  path: `${ioSign.path}/guides/manuale-operativo`,
};

export const ioSignGuides = pipe(
  [
    {
      product: ioSign,
      guide: manualeOperativo,
      version: {
        name: 'v1.0',
        path: `${manualeOperativo.path}/v1.0`,
      },
      source: {
        pathPrefix: `${manualeOperativo.path}/v1.0`,
        assetsPrefix: `${docsAssetsPath}/AdBuOCmwur7AhLlgfCeG`,
        dirPath: `${docsPath}/AdBuOCmwur7AhLlgfCeG`,
      },
    },
  ],
  RA.traverse(E.Applicative)(parseDoc),
  E.fold((e) => {
    // eslint-disable-next-line functional/no-expression-statements
    console.log(e);
    // eslint-disable-next-line functional/no-throw-statements
    throw e;
  }, RA.flatten)
);
