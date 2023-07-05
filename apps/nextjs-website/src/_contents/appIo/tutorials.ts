import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { appIO } from './appIO';
import { docsAssetsPath, docsPath } from '@/config';
import { Tutorial } from '@/lib/types/tutorialData';
import { parseDoc } from 'gitbook-docs/parseDoc';

export const tutorials: readonly Tutorial[] = [
  {
    title: 'Quali sono i possibili accordi di adesione all’app IO',
    dateString: '2023-06-29T22:15:53.780Z',
    path: '/app-io/tutorial/quale-accordo-di-adesione-scegliere',
    name: 'tutorial 1',
  },
  {
    title: 'Come inviare un messaggio con un avviso di pagamento',
    dateString: '2023-06-29T22:15:53.780Z',
    // TODO: Fix this link
    path: '/app-io/tutorial',
    name: 'tutorial 2',
  },
  {
    title: 'Come allegare documenti a un messaggio',
    dateString: '2023-06-29T22:15:53.780Z',
    path: '/app-io/tutorial/come-allegare-documenti-a-un-messaggio',
    name: 'tutorial 3',
  },
];

export const appIoTutorials = pipe(
  [
    {
      product: appIO,
      source: {
        pathPrefix: `${appIO.path}/tutorial`,
        assetsPrefix: `${docsAssetsPath}/I4tX18g9wQQvTbyNkmIT`,
        dirPath: `${docsPath}/I4tX18g9wQQvTbyNkmIT`,
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
  RA.filter(({ page: { path } }) => path !== `${appIO.path}/tutorial`)
);
