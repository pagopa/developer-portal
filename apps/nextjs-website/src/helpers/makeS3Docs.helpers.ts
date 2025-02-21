import {
  bucketName,
  credentials,
  docsS3AssetsPath,
  region,
  s3DocsPath,
} from '@/config';
import { Product } from '@/lib/types/product';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { SolutionTemplateProps } from '@/components/templates/SolutionTemplate/SolutionTemplate';
import { SEO } from '@/lib/types/seo';
import { ReleaseNotePageProps } from '@/app/[productSlug]/[...releaseNoteSubPathSlugs]/page';
import {
  DocPage,
  DocSource,
  makeParseS3DocsEnv,
  parseS3Doc,
} from './parseS3Doc.helpers';

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

const env = makeParseS3DocsEnv(bucketName, region, credentials);

const parseDocOrThrow = async <T>(
  docs: readonly DocSource<T>[]
): Promise<readonly DocPage<T>[]> => {
  const parsedDocs = docs.map(async (doc) => {
    return await parseS3Doc(env, doc);
  });
  return await Promise.all(parsedDocs).then((results) => results.flat());
};

export const makeTutorials = async ({
  product,
  dirName,
  bannerLinks,
}: TutorialsDefinition) => {
  const docs = [
    {
      product: product,
      source: {
        pathPrefix: `/${product.slug}/tutorials`,
        assetsPrefix: `${docsS3AssetsPath}/${dirName}`,
        dirPath: `${s3DocsPath}/${dirName}`,
        spaceId: dirName,
      },
      bannerLinks: bannerLinks,
      relatedLinks: {
        links: [],
      },
    },
  ];

  // eslint-disable-next-line functional/prefer-readonly-type
  const parsedDocs = await parseDocOrThrow(docs);
  return parsedDocs.filter(
    ({ page: { path } }) => path !== `/${product.slug}/tutorials`
  );
};

export const makeGuide = ({
  product,
  guide,
  versions,
  bannerLinks,
}: GuideDefinition) => {
  const guidePath = `/${product.slug}/guides/${guide.slug}`;
  const docs = versions.flatMap(({ main = false, version, dirName }) => {
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
        assetsPrefix: `${docsS3AssetsPath}/${dirName}`,
        dirPath: `${s3DocsPath}/${dirName}`,
        spaceId: dirName,
      },
      bannerLinks: bannerLinks,
    };
    return main
      ? [item, { ...item, source: { ...item.source, pathPrefix: guidePath } }]
      : [item];
  });
  return parseDocOrThrow(docs);
};

export const makeSolution = (solution: SolutionTemplateProps) => {
  const docs = [
    {
      solution,
      source: {
        pathPrefix: `/solutions/${solution.slug}/details`,
        assetsPrefix: `${docsS3AssetsPath}/${solution.dirName}`,
        dirPath: `${s3DocsPath}/${solution.dirName}`,
        spaceId: solution.dirName,
      },
    },
  ];

  return parseDocOrThrow(docs);
};

export const makeReleaseNote = (releaseNote: ReleaseNotePageProps) => {
  const docs = [
    {
      ...releaseNote,
      source: {
        pathPrefix: `/${releaseNote.product.slug}/release-note`,
        assetsPrefix: `${docsS3AssetsPath}/${releaseNote.dirName}`,
        dirPath: `${s3DocsPath}/${releaseNote.dirName}`,
        spaceId: releaseNote.dirName,
      },
    },
  ];

  return parseDocOrThrow(docs);
};
