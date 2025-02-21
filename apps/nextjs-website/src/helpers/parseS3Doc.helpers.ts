import {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import * as path from 'path';
import { Readable } from 'stream';

export type DocSource<T> = T & {
  readonly source: {
    readonly pathPrefix: string;
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
  source: DocSource<T>
  // eslint-disable-next-line functional/prefer-readonly-type
): Promise<DocPage<T>[]> => {
  // eslint-disable-next-line functional/no-try-statements
  try {
    const dirPath = source.source.dirPath;
    const menuPath = [dirPath, 'SUMMARY.md'].join('/');
    const menu = await env.readFile(menuPath);
    const files = await env.readDir(dirPath);

    // eslint-disable-next-line functional/prefer-readonly-type
    const docPages: DocPage<T>[] = [];
    // eslint-disable-next-line functional/no-loop-statements
    for (const abs of files) {
      if (abs !== menuPath && abs.endsWith('.md')) {
        const body = await env.readFile(abs);
        const paths = abs;
        // eslint-disable-next-line functional/immutable-data
        const title = paths.split('/').pop(); // TODO: should parse title from markdown
        if (!title || typeof title !== 'string') {
          // eslint-disable-next-line functional/no-throw-statements
          throw new Error(`Title (h1) not found for '${abs}'`);
        }
        // eslint-disable-next-line functional/no-expression-statements, functional/immutable-data
        docPages.push({
          ...source,
          page: {
            path: transformPath(
              abs,
              source.source.dirPath,
              source.source.pathPrefix
            ),
            isIndex: path.parse(abs).name === 'README',
            title,
            menu,
            body,
          },
        });
      }
    }
    return docPages;
  } catch (error) {
    // eslint-disable-next-line functional/no-expression-statements
    console.error(error);
    // eslint-disable-next-line functional/no-throw-statements
    throw error;
  }
};
