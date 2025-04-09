import {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import * as path from 'path';
import { Readable } from 'stream';
import Markdoc, { Node } from '@markdoc/markdoc';
import { GuideDefinition } from './makeDocs.helpers';
import {
  bucketName,
  credentials,
  docsS3AssetsPath,
  region,
  s3DocsPath,
} from '@/config';
import { Product } from '@/lib/types/product';
import { JsonMetadata } from './s3Metadata.helpers';

export type DocSource<T> = T & {
  readonly source: {
    readonly pathPrefix: string;
    readonly version?: string;
    readonly assetsPrefix: string;
    readonly dirPath: string;
    readonly spaceId: string;
  };
};

export type DocPage<T> = T & {
  readonly page: {
    readonly path: string;
    readonly title: string;
    readonly menu: string;
    readonly body: string;
    readonly isIndex: boolean;
  };
};

const parseText = ({ type, attributes }: Node): string | null =>
  type === 'text' && typeof attributes.content === 'string'
    ? attributes.content
    : null;

export const parseTitle = (markdown: string): string | null => {
  const nodes = Array.from(Markdoc.parse(markdown).walk());
  const headingNode = nodes.find(
    ({ type, attributes }) => type === 'heading' && attributes.level === 1
  );

  if (!headingNode) {
    return null;
  }

  const textNodes = Array.from(headingNode.walk())
    .map(parseText)
    .filter((text): text is string => text !== null);

  return textNodes.join('');
};

export type PageTitlePath = Pick<DocPage<unknown>['page'], 'title' | 'path'>;

export type ParseDocS3Env = {
  readonly readFile: (key: string) => Promise<string>;
  // eslint-disable-next-line functional/prefer-readonly-type
  readonly readDir: (prefix: string) => Promise<string[]>;
};

export const makeParseS3DocsEnv = (
  bucketName: string,
  region?: string,
  credentials?: {
    readonly accessKeyId: string;
    readonly secretAccessKey: string;
  }
): ParseDocS3Env => {
  const s3 =
    !!region && !!credentials
      ? new S3Client({ region, credentials })
      : new S3Client();
  return {
    readFile: async (key) => {
      // eslint-disable-next-line functional/no-expression-statements
      const params = { Bucket: bucketName, Key: key };
      const data = await s3.send(new GetObjectCommand(params));
      const stream = data.Body as Readable;
      return streamToString(stream);
    },
    readDir: async (prefix: string) => {
      const params = { Bucket: bucketName, Prefix: prefix };
      const data = await s3.send(new ListObjectsV2Command(params));
      return (
        data.Contents?.filter(
          (item) => item.Key && !item.Key.includes('.gitbook/assets/')
        ).map((item) => item.Key || '') || []
      );
    },
  };
};

const streamToString = (stream: Readable): Promise<string> => {
  // eslint-disable-next-line functional/prefer-readonly-type
  const chunks: Uint8Array[] = [];
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line functional/no-expression-statements, functional/immutable-data
    stream.on('data', (chunk) => chunks.push(chunk));
    // eslint-disable-next-line functional/no-expression-statements
    stream.on('error', reject);
    // eslint-disable-next-line functional/no-expression-statements
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });
};

const transformPath = (
  path: string,
  dirPath: string,
  pathPrefix: string
): string => {
  const t = path
    .replace(dirPath, `${pathPrefix}`)
    .replace('/README.md', '')
    .replace(' ', '')
    .replace('.md', '');
  return t;
};

export const parseS3Doc = async <T>(
  env: ParseDocS3Env,
  source: DocSource<T>,
  paths: readonly string[]
  // eslint-disable-next-line functional/prefer-readonly-type
): Promise<DocPage<T>[]> => {
  // eslint-disable-next-line functional/no-try-statements
  try {
    const dirPath = source.source.dirPath;
    const menuPath = [dirPath, 'SUMMARY.md'].join('/');
    const menu = await env.readFile(menuPath);
    const files = await env.readDir(dirPath);
    // eslint-disable-next-line functional/no-let
    let slugToPath = [
      dirPath,
      ...paths.filter((path) => path !== source.source.version).slice(1),
    ].join('/');
    // eslint-disable-next-line functional/no-expression-statements
    slugToPath = slugToPath !== dirPath ? slugToPath : `${dirPath}/README`;
    const filePath = files.find(
      (file) => file.includes(slugToPath) && file.endsWith('.md')
    );

    if (!filePath) {
      // eslint-disable-next-line functional/no-expression-statements
      console.log(`File not found for '${filePath}'`);
      return [];
    }
    const body = await env.readFile(filePath);
    const title = parseTitle(body);
    if (!title || typeof title !== 'string') {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error(`Title (h1) not found for '${filePath}'`);
    }
    const docPage: DocPage<T> = {
      ...source,
      page: {
        path: transformPath(
          filePath,
          source.source.dirPath,
          source.source.pathPrefix
        ),
        isIndex: path.parse(filePath).name === 'README',
        title,
        menu,
        body,
      },
    };
    return [docPage];
  } catch (error) {
    // eslint-disable-next-line functional/no-expression-statements
    console.error(error);
    // eslint-disable-next-line functional/no-throw-statements
    throw error;
  }
};

export const parseS3DocPage = async (props: {
  readonly guideProps: GuideDefinition;
  readonly guidePath: string;
  readonly guidePaths: ReadonlyArray<string>;
  readonly guidesMetadata: readonly JsonMetadata[];
  readonly products: readonly Product[];
}) => {
  const { guideProps, guidePath, guidePaths, guidesMetadata, products } = props;
  const parseS3Doc = makeParseS3DocsEnv(bucketName, region, credentials);
  const baseGuidePath = `/${guideProps.product.slug}/guides/${guideProps.guide.slug}`;
  const guidePageMetadata = guidesMetadata.find(
    (data) => data.path === guidePath
  );
  const versions = guideProps.versions;
  const version = versions.find(
    ({ version, main }) =>
      guidePaths.some((path) => path === version) || main === true
  );
  if (
    !version ||
    !guidePageMetadata ||
    guidePageMetadata.dirName !== version.dirName
  ) {
    // eslint-disable-next-line functional/no-expression-statements
    console.error(
      'path',
      guidePath,
      'Missing version:',
      version,
      'or guidePageMetadata',
      guidePageMetadata
    );
    return undefined;
  }
  const isIndex = path.parse(guidePageMetadata.contentS3Path).name === 'README';
  const source = {
    pathPrefix: `${baseGuidePath}/${version.version}`,
    version,
    assetsPrefix: `${docsS3AssetsPath}/${guidePageMetadata.dirName}`,
    dirPath: `${s3DocsPath}/${guidePageMetadata.dirName}`,
    spaceId: guidePageMetadata.dirName,
  };
  const menu =
    guidePageMetadata.manuS3Path &&
    (await parseS3Doc.readFile(guidePageMetadata.manuS3Path));
  const body = await parseS3Doc.readFile(guidePageMetadata.contentS3Path);
  return {
    seo: guideProps.seo,
    product: guideProps.product,
    guide: {
      name: guideProps.guide.name,
      path: guidePath,
    },
    version: {
      main: version.main || false,
      name: version.version,
      path: `${baseGuidePath}/${version.version}`,
    },
    versions: versions.map(({ main = false, version }) => ({
      main,
      name: version,
      path: `${baseGuidePath}/${version}`,
    })),
    source,
    bannerLinks: guideProps.bannerLinks,
    page: {
      path: guidePath,
      isIndex,
      title: guidePageMetadata.title || '',
      menu: menu || '',
      body: body || '',
    },
    products: products,
    bodyConfig: {
      isPageIndex: isIndex,
      pagePath: guidePath,
      assetsPrefix: `${docsS3AssetsPath}/${guidePageMetadata.dirName}`,
      gitBookPagesWithTitle: guidesMetadata,
      spaceToPrefix: guidesMetadata.map((metadata) => ({
        spaceId: metadata.dirName,
        // take the first 4 parts of the path
        pathPrefix: metadata.path.split('/').slice(0, 4).join('/'),
      })),
    },
  };
};
