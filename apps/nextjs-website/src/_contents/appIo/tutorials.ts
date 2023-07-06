import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { docsAssetsPath, docsPath } from '@/config';
import { Tutorial } from '@/lib/types/tutorialData';
import { parseDoc } from 'gitbook-docs/parseDoc';
import { appIo } from '@/_contents/appIo/appIo';
import { appIoBannerLinks } from '@/_contents/appIo/bannerLinks';

export const tutorials: readonly Tutorial[] = [
  {
    coomingSoon: true,
    title: 'Quali sono i possibili accordi di adesione all’app IO',
    dateString: '2023-06-29T22:15:53.780Z',
    path: '/app-io/tutorial/quale-accordo-di-adesione-scegliere',
    name: 'Quale accordo di adesione scegliere',
  },
  {
    title: 'Come inviare un messaggio con un avviso di pagamento',
    dateString: '2023-06-29T22:15:53.780Z',
    path: '/app-io/tutorial/come-spedire-un-avviso-di-pagamento-in-un-messaggio',
    name: 'Come spedire un avviso di pagamento in un messaggio',
  },
  {
    title: 'Come allegare documenti a un messaggio',
    dateString: '2023-06-29T22:15:53.780Z',
    path: '/app-io/tutorial/come-allegare-documenti-a-un-messaggio',
    name: 'Come allegare documenti a un messaggio',
  },
];

export const appIoTutorials = pipe(
  [
    {
      product: appIo,
      source: {
        pathPrefix: `${appIo.path}/tutorials`,
        assetsPrefix: `${docsAssetsPath}/I4tX18g9wQQvTbyNkmIT`,
        dirPath: `${docsPath}/I4tX18g9wQQvTbyNkmIT`,
      },
      bannerLinks: appIoBannerLinks,
    },
  ],
  RA.traverse(E.Applicative)(parseDoc),
  E.fold((e) => {
    // eslint-disable-next-line functional/no-expression-statements
    console.log(e);
    // eslint-disable-next-line functional/no-throw-statements
    throw e;
  }, RA.flatten),
  // This is a workaround that removes the 'index' space from tutorial docs
  RA.filter(({ page: { path } }) => path !== `${appIo.path}/tutorials`)
);
