import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { ioSign } from './ioSign';
import { docsAssetsPath, docsPath } from '@/config';
import { parseDoc } from 'gitbook-docs/parseDoc';
import { ioSignBannerLinks } from '@/_contents/ioSign/bannerLinks';

export const ioSignTutorials = pipe(
  [
    {
      product: ioSign,
      source: {
        pathPrefix: `${ioSign.path}/tutorials`,
        assetsPrefix: `${docsAssetsPath}/mUZRgUVe9jRK4f0tHceu`,
        dirPath: `${docsPath}/mUZRgUVe9jRK4f0tHceu`,
      },
      bannerLinks: ioSignBannerLinks,
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
  RA.filter(({ page: { path } }) => path !== `${ioSign.path}/tutorials`)
);
