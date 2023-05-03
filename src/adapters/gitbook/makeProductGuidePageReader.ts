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
  (
    { path, product, space, collection }: GitBookProductGuide,
    pagePath: string
  ) =>
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
        guideSlug: collection.path || 'unknown',
        // TODO: translate to a slug
        versionSlug: space.title,
        // TODO: Rename to path
        slug: data.path,
        title: data.title,
        body: 'markdown' in data ? data.markdown : '',
      }))
    );

const gitBookGetPageBy = (path: string) =>
  pipe(
    R.ask<GitBookEnv>(),
    R.map(({ client, allGitBookProductGuides }) =>
      pipe(
        allGitBookProductGuides,
        RA.findFirst(({ path: guidePath }) => path.startsWith(guidePath)),
        O.traverse(TE.ApplicativeSeq)((guide) =>
          fetchPageByPath(guide, path)(client)
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
