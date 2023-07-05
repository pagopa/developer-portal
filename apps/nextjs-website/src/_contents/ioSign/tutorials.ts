import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { ioSign } from './ioSign';
import { docsAssetsPath, docsPath } from '@/config';
import { Tutorial } from '@/lib/types/tutorialData';
import { parseDoc } from 'gitbook-docs/parseDoc';

export const tutorials: readonly Tutorial[] = [
  {
    title: 'Come creare e preparare il documento da firmare digitalmente',
    dateString: '2023-06-29T22:15:53.780Z',
    path: '/io-sign/tutorial/1',
    name: 'tutorial 1',
  },
  {
    title: 'Come creare il Dossier per la richiesta di firma',
    dateString: '2023-06-29T22:15:53.780Z',
    path: '/io-sign/tutorial/2',
    name: 'tutorial 2',
  },
  {
    title: 'Come effettuare l’upload dei documenti',
    dateString: '2023-06-29T22:15:53.780Z',
    path: '/io-sign/tutorial/3',
    name: 'tutorial 3',
  },
];

export const ioSignTutorials = pipe(
  [
    {
      product: ioSign,
      source: {
        pathPrefix: `${ioSign.path}/tutorial`,
        assetsPrefix: `${docsAssetsPath}/mUZRgUVe9jRK4f0tHceu`,
        dirPath: `${docsPath}/mUZRgUVe9jRK4f0tHceu`,
      },
    },
  ],
  RA.traverse(E.Applicative)(parseDoc),
  E.fold((e) => {
    // eslint-disable-next-line functional/no-expression-statements
    console.log(e);
    // eslint-disable-next-line functional/no-throw-statements
    throw e;
  }, RA.flatten),
  // This is a workaround that removes the "index" space from tutorial docs
  RA.filter(({ page: { path } }) => path !== `${ioSign.path}/tutorial`)
);
