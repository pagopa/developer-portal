import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as fs from 'fs';
import * as path from 'path';
import { parseTitle } from './parseTitle';

export type DocSource<T> = T & {
  readonly source: {
    readonly pathPrefix: string;
    readonly dirPath: string;
  };
};

export type DocPage<T> = T & {
  readonly page: {
    readonly path: string;
    readonly title: string;
    readonly menu: string;
    readonly body: string;
    // tracks if the page is index or is not
    // in other words if it was a README.md file
    readonly isIndex: boolean;
  };
};

export type PageTitlePath = Pick<DocPage<unknown>['page'], 'title' | 'path'>;

export type ParseDocEnv = {
  readonly readFile: typeof fs.readFileSync;
  readonly readDir: typeof fs.readdirSync;
  readonly readStat: typeof fs.statSync;
};

export const makeParseDocsEnv = (): ParseDocEnv => ({
  readFile: fs.readFileSync,
  readDir: fs.readdirSync,
  readStat: fs.statSync,
});

const transformPath = (
  path: string,
  dirPath: string,
  pathPrefix: string
): string =>
  path
    .replace(dirPath, `${pathPrefix}`)
    .replace('/README.md', '')
    // remove spaces because in some systems (e.g. NextJS)
    // they cause errors when used in paths
    .replace(' ', '')
    .replace('.md', '');

export const parseDoc = <T>(
  source: DocSource<T>,
  env: ParseDocEnv = makeParseDocsEnv()
): E.Either<Error, ReadonlyArray<DocPage<T>>> =>
  pipe(
    E.Do,
    E.apS('dirPath', E.of(source.source.dirPath)),
    E.bind('menuPath', ({ dirPath }) =>
      E.of(path.resolve(dirPath, 'SUMMARY.md'))
    ),
    E.bind('menu', ({ menuPath }) =>
      E.tryCatch(() => env.readFile(menuPath, 'utf-8'), E.toError)
    ),
    E.bind('files', ({ dirPath }) =>
      E.tryCatch(() => getSubTreeFiles([dirPath])(env), E.toError)
    ),
    E.chain(({ files, menu, menuPath }) =>
      pipe(
        files,
        // exclude the menu file (a.k.a. SUMMARY.md)
        RA.filter((abs) => abs !== menuPath),
        // include only markdown files
        RA.filter((abs) => abs.endsWith('.md')),
        RA.traverse(E.Applicative)((abs) =>
          pipe(
            E.Do,
            E.bind('body', () =>
              E.tryCatch(() => env.readFile(abs, 'utf-8'), E.toError)
            ),
            E.bind('title', ({ body }) =>
              pipe(
                parseTitle(body),
                E.fromOption(
                  () => new Error(`Title (h1) not found for '${abs}'`)
                )
              )
            ),
            E.map(({ title, body }) => ({
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
            }))
          )
        )
      )
    )
  );

const getSubTreeFiles =
  (acc: ReadonlyArray<string>, result: ReadonlyArray<string> = []) =>
  (env: ParseDocEnv): ReadonlyArray<string> => {
    if (acc.length === 0) {
      return result;
    } else {
      const [head, ...rest] = acc;
      if (env.readStat(head).isDirectory()) {
        const children = pipe(
          env.readDir(head),
          RA.map((name) => path.join(head, name))
        );
        return getSubTreeFiles([...rest, ...children], result)(env);
      } else {
        return getSubTreeFiles(rest, [...result, head])(env);
      }
    }
  };
