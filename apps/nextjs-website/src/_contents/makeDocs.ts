import { docsAssetsPath, docsPath } from '@/config';
import { Product } from '@/lib/types/product';
import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/lib/ReadonlyArray';

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
};

export const makeGuide = ({ product, guide, versions }: GuideDefinition) => {
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
      source: {
        pathPrefix: `${guidePath}/${version}`,
        assetsPrefix: `${docsAssetsPath}/${dirName}`,
        dirPath: `${docsPath}/${dirName}`,
      },
    }))
  );
};
