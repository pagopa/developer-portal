import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { docsAssetsPath, docsPath } from '@/config';
import { parseDoc } from 'gitbook-docs/parseDoc';
import { appIo } from '@/_contents/appIo/appIo';

export const appIoTutorials = pipe(
  [
    {
      product: appIo,
      source: {
        pathPrefix: `${appIo.path}/tutorials`,
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
  // This is a workaround that removes the 'index' space from tutorial docs
  RA.filter(({ page: { path } }) => path !== `${appIo.path}/tutorials`)
);
