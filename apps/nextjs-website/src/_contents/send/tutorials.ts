import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { docsAssetsPath, docsPath } from '@/config';
import { parseDoc } from 'gitbook-docs/parseDoc';
import { send } from '@/_contents/send/send';
import { sendBannerLinks } from '@/_contents/send/bannerLinks';
import { sendTutorialListsPath } from './tutorialListsPath';

export const sendTutorials = pipe(
  [
    {
      product: send,
      source: {
        pathPrefix: sendTutorialListsPath.path,
        assetsPrefix: `${docsAssetsPath}/QzrvHJmSUOaAVsgD4qWK`,
        dirPath: `${docsPath}/QzrvHJmSUOaAVsgD4qWK`,
      },
      bannerLinks: sendBannerLinks,
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
  RA.filter(({ page: { path } }) => path !== sendTutorialListsPath.path)
);
