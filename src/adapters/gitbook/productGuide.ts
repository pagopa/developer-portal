import { GetAllProductGuide } from '@/domain/productGuide';
import { Product } from '@/domain/productPage';
import { GitBookAPI, Space } from '@gitbook/api';
import { pipe } from 'fp-ts/lib/function';
import * as Apply from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';

type ProductGuideCollection = {
  product: Product;
  collectionId: string;
};

const getProductGuideCollection = (client: GitBookAPI, collectionId: string) =>
  // fetch collection detail, including its children spaces
  Apply.sequenceS(TE.ApplicativeSeq)({
    collection: TE.tryCatch(
      () => client.collections.getCollectionById(collectionId),
      E.toError
    ),
    spaces: TE.tryCatch(
      () => client.collections.listSpacesInCollectionById(collectionId),
      E.toError
    ),
  });

const getProductGuideVersion = (client: GitBookAPI) => (space: Space) =>
  pipe(
    TE.tryCatch(() => client.spaces.getCurrentRevision(space.id), E.toError),
    TE.map(({ data }) => ({
      title: space.title,
      slug: space.title,
      pages: data.pages,
    }))
  );

const getProductGuide =
  (client: GitBookAPI) =>
  ({ product, collectionId }: ProductGuideCollection) =>
    pipe(
      // fetch collection detail, including its children spaces
      getProductGuideCollection(client, collectionId),
      // fetch all the pages of all the spaces
      TE.chain(({ collection, spaces }) =>
        pipe(
          spaces.data.items,
          TE.traverseArray(getProductGuideVersion(client)),
          TE.map((versions) => ({
            product,
            title: collection.data.title,
            // TODO: as fallback transform the title to a slug
            slug: collection.data.path || '',
            versions,
          }))
        )
      )
    );

export const getAllProductGuide = (
  client: GitBookAPI,
  productGuideCollections: ReadonlyArray<ProductGuideCollection>
): GetAllProductGuide =>
  pipe(productGuideCollections, TE.traverseArray(getProductGuide(client)));
