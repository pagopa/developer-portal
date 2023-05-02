import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Reader';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { ProductGuidePageReader } from '@/domain/productGuidePage';
import { GitBookConfig, GitBookEnv, makeGitBookEnv } from './GitBookEnv';
import { GitBookProductGuide } from './gitbookProductGuide';
import { GitBookAPI } from '@gitbook/api';
import { isSibling } from '@/domain/navigator';

const gitBookGetAllPaths = pipe(
  R.ask<GitBookEnv>(),
  R.map(({ allGitBookProductGuides }) =>
    pipe(
      allGitBookProductGuides,
      RA.chain(({ nav }) =>
        pipe(
          nav,
          RA.filterMap(({ path, kind }) =>
            kind === 'page' ? O.some(path) : O.none
          )
        )
      )
    )
  )
);

const fetchPageByPath =
  ({ path, product, space, nav }: GitBookProductGuide, pagePath: string) =>
  (client: GitBookAPI) =>
    pipe(
      TE.tryCatch(
        () =>
          client.spaces.getPageByPath(
            space.id,
            encodeURIComponent(pagePath.replaceAll(path, '')),
            { format: 'markdown' }
          ),
        E.toError
      ),
      TE.map(({ data }) => ({
        product,
        guidePath: path,
        nav,
        title: data.title,
        body: 'markdown' in data ? data.markdown : '',
      }))
    );

const makeVersionsNav = (path: string) =>
  pipe(
    R.ask<GitBookEnv>(),
    R.map(({ allGitBookProductGuides }) =>
      pipe(
        allGitBookProductGuides,
        RA.findFirst(({ path: guidePath }) => path.startsWith(guidePath)),
        O.map(({ path }) =>
          pipe(allGitBookProductGuides, RA.filter(isSibling(path)))
        ),
        O.fold(
          () => [],
          RA.map(({ path, space: { title } }) => ({
            path,
            name: { nav: title, breadcrumb: title },
          }))
        )
      )
    )
  );

const gitBookGetPageBy = (path: string) =>
  pipe(
    R.ask<GitBookEnv>(),
    R.apS('versionsNav', makeVersionsNav(path)),
    R.map(({ client, allGitBookProductGuides, versionsNav }) =>
      pipe(
        allGitBookProductGuides,
        RA.findFirst(({ path: guidePath }) => path.startsWith(guidePath)),
        O.traverse(TE.ApplicativeSeq)((guide) =>
          pipe(
            fetchPageByPath(guide, path)(client),
            TE.map((guide) => ({ ...guide, versionsNav }))
          )
        )
      )
    )
  );

/**
 * Given a GitBookConfig creates an instance of ProductGuidePageReader.
 */
export const makeProductGuidePageReader = (
  config: GitBookConfig
): TE.TaskEither<Error, ProductGuidePageReader> =>
  pipe(
    makeGitBookEnv(config),
    TE.map((gitBookEnv) => ({
      getAllPaths: () => TE.of(gitBookGetAllPaths(gitBookEnv)),
      getPageBy: (path) => gitBookGetPageBy(path)(gitBookEnv),
    }))
  );
