import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { pagoPa } from './pagoPa';
import { docsAssetsPath, docsPath } from '@/config';
import { Tutorial } from '@/lib/types/tutorialData';
import { parseDoc } from 'gitbook-docs/parseDoc';

export const tutorials: readonly Tutorial[] = [
  {
    title: 'Come richiedere pagamenti che contengono marca da bollo digitale',
    dateString: '2023-06-29T22:15:53.780Z',
    path: '/pago-pa/tutorial/come-richiedere-pagamenti-che-contengono-marca-da-bollo-digitale',
    name: 'Come richiedere pagamenti che contengono marca da bollo digitale',
  },
  {
    title: 'Come avviare un esercizio come Ente Creditore su pagoPA',
    dateString: '2023-06-29T22:15:53.780Z',
    path: '/pago-pa/tutorial/come-avviare-un-esercizio-come-ente-creditore-su-pagopa',
    name: 'Come avviare un esercizio come Ente Creditore su pagoPA',
  },
  {
    title: 'Come stampare un avviso di pagamento in formato PDF',
    dateString: '2023-06-29T22:15:53.780Z',
    path: '/pago-pa/tutorial/come-stampare-un-avviso-di-pagamento-in-formato-pdf',
    name: 'Come stampare un avviso di pagamento in formato PDF',
  },
];

export const appIoTutorials = pipe(
  [
    {
      product: pagoPa,
      source: {
        pathPrefix: `${pagoPa.path}/tutorial`,
        assetsPrefix: `${docsAssetsPath}/0daUnj7noyDC76EK6Bii`,
        dirPath: `${docsPath}/0daUnj7noyDC76EK6Bii`,
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
  RA.filter(({ page: { path } }) => path !== `${pagoPa.path}/tutorial`)
);
