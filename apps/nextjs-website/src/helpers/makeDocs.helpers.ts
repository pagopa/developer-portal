import { flow, pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { docsAssetsPath, docsPath } from '@/config';
import { Product } from '@/lib/types/product';
import { parseDoc } from 'gitbook-docs/parseDoc';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { SolutionTemplateProps } from '@/components/templates/SolutionTemplate/SolutionTemplate';
import { SEO } from '@/lib/types/seo';
import { ReleaseNotePageProps } from '@/app/[locale]/[productSlug]/[...releaseNoteSubPathSlugs]/page';

export type TutorialsDefinition = {
  readonly product: Product;
  readonly dirName: string;
  readonly bannerLinks: readonly BannerLinkProps[];
};

export type GuideDefinition = {
  readonly product: Product;
  readonly guide: {
    readonly name: string;
    readonly slug?: string;
    readonly path?: string;
  };
  readonly versions: ReadonlyArray<{
    readonly main?: boolean;
    readonly version: string;
    readonly dirName: string;
  }>;
  readonly bannerLinks: readonly BannerLinkProps[];
  readonly seo?: SEO;
  readonly source?: {
    readonly pathPrefix: string;
    readonly assetsPrefix: string;
    readonly dirPath: string;
    readonly spaceId: string;
  };
};

const parseDocOrThrow = flow(
  RA.traverse(E.Applicative)(parseDoc),
  E.fold((e) => {
    // eslint-disable-next-line functional/no-throw-statements
    throw e;
  }, RA.flatten)
);

export const makeTutorials = ({
  product,
  dirName,
  bannerLinks,
}: TutorialsDefinition) => {
  return pipe(
    [
      {
        product: product,
        source: {
          pathPrefix: `/${product.slug}/tutorials`,
          assetsPrefix: `${docsAssetsPath}/${dirName}`,
          dirPath: `${docsPath}/${dirName}`,
          spaceId: dirName,
        },
        bannerLinks: bannerLinks,
        relatedLinks: {
          links: [],
        },
      },
    ],
    parseDocOrThrow,
    // This is a workaround that removes the 'index' space from tutorial docs
    RA.filter(({ page: { path } }) => path !== `/${product.slug}/tutorials`)
  );
};

export const makeGuide = ({
  product,
  guide,
  versions,
  bannerLinks,
}: GuideDefinition) => {
  const guidePath = `/${product.slug}/guides/${guide.slug}`;
  return pipe(
    versions,
    RA.map(({ main = false, version, dirName }) => {
      const item = {
        product: product,
        guide: {
          name: guide.name,
          path: guidePath,
        },
        version: {
          main,
          name: version,
          path: `${guidePath}/${version}`,
        },
        versions: versions.map(({ main = false, version }) => ({
          main,
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
      };
      // We need to generate two items for the main version of the guide
      // One with the name version and one without version in the path
      return main
        ? [item, { ...item, source: { ...item.source, pathPrefix: guidePath } }]
        : [item];
    }),
    RA.flatten,
    // parse docs files
    parseDocOrThrow
  );
};

export const makeSolution = (solution: SolutionTemplateProps) => {
  return pipe(
    [
      {
        solution,
        source: {
          pathPrefix: `/solutions/${solution.slug}/details`,
          assetsPrefix: `${docsAssetsPath}/${solution.dirName}`,
          dirPath: `${docsPath}/${solution.dirName}`,
          spaceId: solution.dirName,
        },
      },
    ],
    parseDocOrThrow
  );
};

export const makeReleaseNote = (releaseNote: ReleaseNotePageProps) => {
  return pipe(
    [
      {
        ...releaseNote,
        source: {
          pathPrefix: `/${releaseNote.product.slug}/release-note`,
          assetsPrefix: `${docsAssetsPath}/${releaseNote.dirName}`,
          dirPath: `${docsPath}/${releaseNote.dirName}`,
          spaceId: releaseNote.dirName,
        },
      },
    ],
    parseDocOrThrow
  );
};
