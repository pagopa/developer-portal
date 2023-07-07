import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { docsAssetsPath, docsPath } from '@/config';
import { Product } from '@/lib/types/product';
import { parseDoc } from 'gitbook-docs/parseDoc';
import { BannerLinkProps } from '@pagopa/pagopa-editorial-components/dist/components/BannerLink';

export type GuideDefinition = {
  readonly product: Product;
  readonly guide: {
    readonly name: string;
    readonly slug: string;
  };
  readonly versions: ReadonlyArray<{
    readonly version: string;
    readonly dirName: string;
  }>;
  readonly bannerLinks: readonly BannerLinkProps[];
};

export const makeGuide = ({
  product,
  guide,
  versions,
  bannerLinks,
}: GuideDefinition) => {
  const guidePath = `${product.path}/guides/${guide.slug}`;
  return pipe(
    versions,
    RA.map(({ version, dirName }) => ({
      product: product,
      guide: {
        name: guide.name,
        path: guidePath,
      },
      version: {
        name: version,
        path: `${guidePath}/${version}`,
      },
      versions: versions.map(({ version }) => ({
        name: version,
        path: `${guidePath}/${version}`,
      })),
      source: {
        pathPrefix: `${guidePath}/${version}`,
        assetsPrefix: `${docsAssetsPath}/${dirName}`,
        dirPath: `${docsPath}/${dirName}`,
      },
      bannerLinks: bannerLinks,
    })),
    // parse docs files
    RA.traverse(E.Applicative)(parseDoc),
    E.fold((e) => {
      // eslint-disable-next-line functional/no-expression-statements
      console.log(e);
      // eslint-disable-next-line functional/no-throw-statements
      throw e;
    }, RA.flatten)
  );
};
