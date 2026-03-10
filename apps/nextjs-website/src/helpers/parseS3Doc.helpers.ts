import {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import * as path from 'path';
import { Readable } from 'stream';
import Markdoc, { Node } from '@markdoc/markdoc';
import { GuideDefinition } from './makeDocs.helpers';
import { staticContentsUrl, s3DocsPath } from '@/config';
import { Product } from '@/lib/types/product';
import { downloadFileAsText, JsonMetadata } from './s3Metadata.helpers';

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
    readonly sessionToken?: string;
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
      (file) =>
        file.endsWith('.md') && file.replace('.md', '').endsWith(slugToPath)
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

export const parseS3GuidePage = async (props: {
  readonly guideProps: GuideDefinition;
  readonly guidePath: string;
  readonly guidesMetadata: readonly JsonMetadata[];
  readonly products: readonly Product[];
  readonly locale: string;
}) => {
  const { guideProps, guidePath, guidesMetadata, products, locale } = props;

  const baseGuidePath = `/${locale}/${guideProps.product.slug}/guides/${guideProps.guide.slug}`;
  const guidePageMetadata = guidesMetadata.find(
    (data) => data.path === guidePath
  );
  const versions = guideProps.versions;
  const version = guidePageMetadata?.version
    ? versions.find(({ version }) => version === guidePageMetadata.version)
    : versions.find(({ main }) => !!main);

  if (
    !version ||
    !guidePageMetadata ||
    guidePageMetadata.dirName !== version.dirName
  ) {
    // eslint-disable-next-line functional/no-expression-statements
    console.error('Missing version or guidePageMetadata for guidePath');
    // eslint-disable-next-line functional/no-expression-statements
    console.log(
      'path',
      guidePath,
      'baseGuidePath',
      baseGuidePath,
      'Missing version:',
      version,
      'or guidePageMetadata',
      guidePageMetadata,
      'guidesMetadataLength',
      guidesMetadata.length
    );
    return undefined;
  }

  const isIndex = path.parse(guidePageMetadata.contentS3Path).name === 'README';
  const assetsPrefix = `${staticContentsUrl}/${locale}/${s3DocsPath}/${guidePageMetadata.dirName}`;
  const source = {
    pathPrefix: version.main
      ? baseGuidePath
      : `${baseGuidePath}/${version.version}`,
    version,
    assetsPrefix,
    dirPath: `${locale}/${s3DocsPath}/${guidePageMetadata.dirName}`,
    spaceId: guidePageMetadata.dirName,
  };

  // Download menu and body files in parallel
  const [menu, body] = await Promise.all([
    guidePageMetadata &&
      downloadFileAsText(guidePageMetadata.menuS3Path, { cache: 'no-store' }),
    downloadFileAsText(guidePageMetadata.contentS3Path, { cache: 'no-store' }),
  ]);

  const result = {
    ...guideProps,
    guide: {
      name: guideProps.guide.name,
      path: guidePath,
    },
    version: {
      main: version.main || false,
      name: version.version,
      path: version.main
        ? baseGuidePath
        : `${baseGuidePath}/${version.version}`,
    },
    versions: versions.map(({ main = false, version }) => ({
      main,
      name: version,
      path: `${baseGuidePath}/${version}`,
    })),
    source,
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
      assetsPrefix,
      gitBookPagesWithTitle: guidesMetadata,
      spaceToPrefix: guidesMetadata.map((metadata) => ({
        spaceId: metadata.dirName,
        pathPrefix: metadata.path.split('/').slice(0, 4).join('/'),
      })),
    },
  };

  return result;
};

export const parseDoc = async <T>(
  source: DocSource<T>,
  jsonMetadata?: JsonMetadata
  // eslint-disable-next-line functional/prefer-readonly-type
): Promise<DocPage<T> | undefined> => {
  if (!jsonMetadata) {
    return undefined;
  }
  // eslint-disable-next-line functional/no-try-statements
  try {
    const menu = await downloadFileAsText(jsonMetadata.menuS3Path);
    const body = await downloadFileAsText(jsonMetadata.contentS3Path);
    const title = body && parseTitle(body);
    const filePath = jsonMetadata.contentS3Path;
    if (!menu || !body) {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error(`Menu or body not found for '${filePath}'`);
    }
    if (!title || typeof title !== 'string') {
      // eslint-disable-next-line functional/no-throw-statements
      throw new Error(`Title (h1) not found for '${filePath}'`);
    }
    const docPage: DocPage<T> = {
      ...source,
      page: {
        path: jsonMetadata.path,
        isIndex: path.parse(filePath).name === 'README',
        title,
        menu,
        body,
      },
    };
    return docPage;
  } catch (error) {
    // eslint-disable-next-line functional/no-expression-statements
    console.error(error);
    // eslint-disable-next-line functional/no-throw-statements
    throw error;
  }
};
