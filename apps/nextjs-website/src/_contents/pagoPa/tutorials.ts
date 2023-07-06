import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { pagoPa } from './pagoPa';
import { docsAssetsPath, docsPath } from '@/config';
import { parseDoc } from 'gitbook-docs/parseDoc';
import { pagoPaBannerLinks } from '@/_contents/pagoPa/bannerLinks';

export const pagoPaTutorials = pipe(
  [
    {
      product: pagoPa,
      source: {
        pathPrefix: `${pagoPa.path}/tutorials`,
        assetsPrefix: `${docsAssetsPath}/0daUnj7noyDC76EK6Bii`,
        dirPath: `${docsPath}/0daUnj7noyDC76EK6Bii`,
      },
      bannerLinks: pagoPaBannerLinks,
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
  RA.filter(({ page: { path } }) => path !== `${pagoPa.path}/tutorials`)
);
