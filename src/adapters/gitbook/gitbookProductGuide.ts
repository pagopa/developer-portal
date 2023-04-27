import { flow, pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import * as RTE from 'fp-ts/lib/ReaderTaskEither';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as E from 'fp-ts/lib/Either';
import { ProductGuideNav } from '@/domain/productGuideNavigator';
import { Product } from '@/domain/productPage';
import { Collection, GitBookAPI, Revision, Space } from '@gitbook/api';
import { makeProductGuideNav } from './makeProductGuideNav';

export type GitBookProductCollection = {
  product: Product;
  collectionId: string;
};

export type GitBookProductGuide = {
  path: string;
  product: Product;
  collection: Collection;
  space: Space;
  revision: Revision;
  nav: ProductGuideNav;
};

const makeGitBookProductGuide = (
  guide: Omit<GitBookProductGuide, 'nav' | 'path'>
): GitBookProductGuide => {
  const { product, collection, space, revision } = guide;
  const path = `/${product.slug}/guide-manuali/${collection.path ?? 'unknown'}/${
    space.title
  }`;
  const nav = pipe(
    revision.pages,
    RA.map((page) => ({ parentPath: path, ...page })),
    (pages) => makeProductGuideNav(pages, [])
  );
  return { path, product, collection, space, revision, nav };
};

const fetchCollectionById = (collectionId: string) => (client: GitBookAPI) =>
  pipe(
    TE.tryCatch(
      () => client.collections.getCollectionById(collectionId),
      E.toError
    ),
    TE.map(({ data }) => data)
  );

const fetchCollectionSpaceListById =
  (collectionId: string) => (client: GitBookAPI) =>
    pipe(
      TE.tryCatch(
        () => client.collections.listSpacesInCollectionById(collectionId),
        E.toError
      ),
      TE.map(({ data: { items } }) => items)
    );

const fetchCurrentRevisionBySpace = (space: Space) => (client: GitBookAPI) =>
  pipe(
    TE.tryCatch(() => client.spaces.getCurrentRevision(space.id), E.toError),
    TE.map(({ data }) => ({ space, revision: data }))
  );

const fetchGitBookProductGuide = ({
  product,
  collectionId,
}: GitBookProductCollection) =>
  pipe(
    RTE.Do,
    RTE.apS('collection', fetchCollectionById(collectionId)),
    RTE.apS('spaces', fetchCollectionSpaceListById(collectionId)),
    RTE.chain(({ collection, spaces }) =>
      pipe(
        spaces,
        RTE.traverseArray(fetchCurrentRevisionBySpace),
        RTE.map(
          RA.map(({ space, revision }) =>
            makeGitBookProductGuide({ product, collection, space, revision })
          )
        )
      )
    )
  );

export const fetchAllGitBookProductGuide = flow(
  RTE.traverseArray(fetchGitBookProductGuide),
  RTE.map(RA.flatten)
);
