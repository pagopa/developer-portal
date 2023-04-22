import { pipe } from 'fp-ts/lib/function';
import * as Apply from 'fp-ts/lib/Apply';
import * as TE from 'fp-ts/lib/TaskEither';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as O from 'fp-ts/lib/Option';
import * as E from 'fp-ts/lib/Either';
import { Product } from '@/domain/productPage';
import {
  Collection,
  GitBookAPI,
  Revision,
  RevisionPage,
  Space,
} from '@gitbook/api';
import {
  ProductGuideNav,
  ProductGuideNavItem,
} from '@/domain/productGuideNavigator';
import { ProductGuidePage } from '@/domain/productGuidePage';

type ProductGuideCollection = {
  product: Product;
  collectionId: string;
};

// Represent a hole guide section of a product
type GitBookProductGuide = {
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
  const path = `/${product.slug}/guide-manual/${collection.path ?? 'unknown'}/${
    space.title
  }`;
  const nav = pipe(
    revision.pages,
    RA.map((page) => ({ parentPath: path, ...page })),
    (pages) => makeProductGuideNav(pages, [])
  );
  return { path, product, collection, space, revision, nav };
};

type GitBookProductGuideItem = { parentPath: string } & RevisionPage;

const makeProductGuideNavItem = (
  item: GitBookProductGuideItem
): ProductGuideNavItem => ({
  name: { nav: item.title, breadcrumb: item.title },
  path:
    item.kind === 'link' ? item.parentPath : `${item.parentPath}/${item.slug}`,
  ...(item.kind === 'link'
    ? { kind: 'link', href: item.href ?? '' }
    : { kind: item.kind === 'sheet' ? 'page' : item.kind }),
});

const makeProductGuideNav = (
  unprocessed: ReadonlyArray<GitBookProductGuideItem>,
  result: ProductGuideNav
): ProductGuideNav => {
  if (unprocessed.length > 0) {
    const [page, ...rest] = unprocessed;
    const navItem = makeProductGuideNavItem(page);
    const children = pipe(
      page.kind === 'link' ? [] : page.pages,
      RA.map((child) => ({ parentPath: navItem.path, ...child }))
    );
    return makeProductGuideNav([...children, ...rest], [navItem, ...result]);
  } else {
    return result;
  }
};

export const fetchGitBookProductGuideList =
  (client: GitBookAPI) =>
  (
    productGuideCollection: ProductGuideCollection
  ): TE.TaskEither<Error, ReadonlyArray<GitBookProductGuide>> =>
    pipe(
      Apply.sequenceS(TE.ApplicativeSeq)({
        // fetch collection detail
        collection: TE.tryCatch(
          () =>
            client.collections.getCollectionById(
              productGuideCollection.collectionId
            ),
          E.toError
        ),
        // fetch all children spaces
        spaces: TE.tryCatch(
          () =>
            client.collections.listSpacesInCollectionById(
              productGuideCollection.collectionId
            ),
          E.toError
        ),
      }),
      TE.chain(({ collection, spaces }) =>
        pipe(
          spaces.data.items,
          // for each space fetch the revision
          TE.traverseArray((space) =>
            pipe(
              TE.tryCatch(
                () => client.spaces.getCurrentRevision(space.id),
                E.toError
              ),
              TE.map((revision) =>
                makeGitBookProductGuide({
                  product: productGuideCollection.product,
                  collection: collection.data,
                  space,
                  revision: revision.data,
                })
              )
            )
          )
        )
      )
    );

export const getAllProductGuidePagePaths =
  (client: GitBookAPI) =>
  (
    productGuideCollection: ReadonlyArray<ProductGuideCollection>
  ): TE.TaskEither<Error, ReadonlyArray<string>> =>
    pipe(
      productGuideCollection,
      TE.traverseArray(fetchGitBookProductGuideList(client)),
      TE.map(RA.flatten),
      TE.map(
        RA.chain(({ nav }) =>
          pipe(
            nav,
            RA.filterMap(({ path, kind }) =>
              kind === 'page' ? O.some(path) : O.none
            )
          )
        )
      )
    );

export const getProductGuidePageBy =
  (client: GitBookAPI) =>
  (productGuideCollection: ReadonlyArray<ProductGuideCollection>) =>
  (pagePath: string): TE.TaskEither<Error, ProductGuidePage> =>
    pipe(
      productGuideCollection,
      TE.traverseArray(fetchGitBookProductGuideList(client)),
      TE.map(RA.flatten),
      TE.chain((db) =>
        pipe(
          db,
          RA.findFirst(({ path }) => pagePath.startsWith(path)),
          O.map(({ path, product, collection, space }) =>
            pipe(
              TE.tryCatch(
                () =>
                  client.spaces.getPageByPath(
                    space.id,
                    encodeURIComponent(pagePath.replaceAll(path, '')),
                    {
                      format: 'markdown',
                    }
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
            )
          ),
          O.getOrElse(() => TE.left(new Error()))
        )
      )
    );
