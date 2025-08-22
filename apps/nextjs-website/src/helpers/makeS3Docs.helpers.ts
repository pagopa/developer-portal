import {
  bucketName,
  credentials,
  staticContentsUrl,
  region,
  s3DocsPath,
} from '@/config';
import { Product } from '@/lib/types/product';
import { BannerLinkProps } from '@/components/atoms/BannerLink/BannerLink';
import { SEO } from '@/lib/types/seo';
import {
  DocPage,
  DocSource,
  makeParseS3DocsEnv,
  parseDoc,
  parseS3Doc,
} from './parseS3Doc.helpers';
import { SolutionTemplateProps } from '@/components/templates/SolutionTemplate/SolutionTemplate';
import { ReleaseNotePageProps } from '@/app/[locale]/[productSlug]/[...releaseNoteSubPathSlugs]/page';
import { JsonMetadata } from './s3Metadata.helpers';

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
  docs: readonly DocSource<T>[],
  paths: readonly string[]
): Promise<readonly DocPage<T>[]> => {
  const parsedDocs = docs.map(async (doc) => {
    return await parseS3Doc(env, doc, paths);
  });
  return await Promise.all(parsedDocs).then((results) => results.flat());
};

export const makeTutorials = async (props: {
  readonly tutorial: {
    readonly product: Product;
    readonly dirName: string;
    readonly bannerLinks: readonly BannerLinkProps[];
  };
  readonly tutorialPaths: readonly string[];
}) => {
  const { product, dirName, bannerLinks } = props.tutorial;
  const docs = [
    {
      product: product,
      source: {
        pathPrefix: `/${product.slug}/tutorials`,
        assetsPrefix: `${staticContentsUrl}/${s3DocsPath}/${dirName}`,
        dirPath: `${s3DocsPath}/${dirName}`,
        spaceId: dirName,
      },
      bannerLinks: bannerLinks,
      relatedLinks: {
        links: [],
      },
    },
  ];

  const parsedDocs = await parseDocOrThrow(docs, props.tutorialPaths);
  return parsedDocs.filter(
    ({ page: { path } }) => path !== `/${product.slug}/tutorials`
  );
};

export const makeGuide = (props: {
  readonly guideDefinition: GuideDefinition;
  readonly guidePaths: readonly string[];
}) => {
  const {
    guidePaths,
    guideDefinition: { product, guide, versions, bannerLinks },
  } = props;
  const guidePath = `/${product.slug}/guides/${guide.slug}`;
  const docs = versions
    .filter(
      ({ version, main }) =>
        guidePaths.some((path) => path === version) || main === true
    )
    .flatMap(({ main = false, version, dirName }) => {
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
          version,
          assetsPrefix: `${staticContentsUrl}/${s3DocsPath}/${dirName}`,
          dirPath: `${s3DocsPath}/${dirName}`,
          spaceId: dirName,
        },
        bannerLinks: bannerLinks,
      };
      return main
        ? [item, { ...item, source: { ...item.source, pathPrefix: guidePath } }]
        : [item];
    });

  return parseDocOrThrow(docs, guidePaths);
};

export const makeSolution = (
  solution: SolutionTemplateProps,
  jsonMetadata?: JsonMetadata
) => {
  const doc = {
    ...solution,
    source: {
      pathPrefix: `/solutions/${solution.slug}/details`,
      assetsPrefix: `${staticContentsUrl}/${s3DocsPath}/${solution.dirName}`,
      dirPath: `${s3DocsPath}/${solution.dirName}`,
      spaceId: solution.dirName,
    },
  };

  return parseDoc(doc, jsonMetadata);
};

export const makeReleaseNote = (
  releaseNote: ReleaseNotePageProps,
  jsonMetadata?: JsonMetadata
) => {
  const doc = {
    ...releaseNote,
    source: {
      pathPrefix: `/${releaseNote.product.slug}/release-note`,
      assetsPrefix: `${staticContentsUrl}/${s3DocsPath}/${releaseNote.dirName}`,
      dirPath: `${s3DocsPath}/${releaseNote.dirName}`,
      spaceId: releaseNote.dirName,
    },
  };

  return parseDoc(doc, jsonMetadata);
};
