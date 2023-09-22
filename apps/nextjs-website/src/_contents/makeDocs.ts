import { flow, pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { docsAssetsPath, docsPath } from '@/config';
import { Product } from '@/lib/types/product';
import { parseDoc } from 'gitbook-docs/parseDoc';
import { BannerLinkProps } from '@/editorialComponents/BannerLink';

export type TutorialsDefinition = {
  readonly product: Product;
  readonly dirName: string;
  readonly bannerLinks: readonly BannerLinkProps[];
};

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

const parseDocOrThrow = flow(
  RA.traverse(E.Applicative)(parseDoc),
  E.fold((e) => {
    // eslint-disable-next-line functional/no-expression-statements
    console.log(e);
    // eslint-disable-next-line functional/no-throw-statements
    throw e;
  }, RA.flatten)
);

export const makeTutorials = ({
  product,
  dirName,
  bannerLinks,
}: TutorialsDefinition) =>
  pipe(
    [
      {
        product: product,
        source: {
          pathPrefix: `${product.path}/tutorial`,
          assetsPrefix: `${docsAssetsPath}/${dirName}`,
          dirPath: `${docsPath}/${dirName}`,
          spaceId: dirName,
        },
        bannerLinks: bannerLinks,
      },
    ],
    parseDocOrThrow,
    // This is a workaround that removes the 'index' space from tutorial docs
    RA.filter(({ page: { path } }) => path !== `${product.path}/tutorial`)
  );

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
        spaceId: dirName,
      },
      bannerLinks: bannerLinks,
    })),
    // parse docs files
    parseDocOrThrow
  );
};
