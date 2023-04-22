import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { ProductGuidePage } from '@/domain/productGuidePage';
import { makeGitBookClient } from '../gitbook/client';
import {
  getAllProductGuidePagePaths as gitBookGetAllProductGuidePagePaths,
  getProductGuidePageBy as gitBookGetProductGuidePageBy,
} from '../gitbook/productGuidePage';

// TODO: Move me
const gitbookClient = makeGitBookClient(process.env['GITBOOK_API_KEY'] || '');
const productGuideCollection = [
  {
    product: { name: 'p0', slug: 'ps0' },
    collectionId: 'Cw40sL8INZ5p5FDkWQSD',
  },
];

export const getAllProductGuidePagePaths = (): Promise<Array<string>> =>
  pipe(
    productGuideCollection,
    gitBookGetAllProductGuidePagePaths(gitbookClient),
    TE.fold(
      () => T.of([]),
      (result) => T.of([...result])
    )
  )();

export const getProductGuidePageBy = (
  pagePath: string
): Promise<ProductGuidePage | undefined> =>
  pipe(
    gitBookGetProductGuidePageBy(gitbookClient)(productGuideCollection)(
      pagePath
    ),
    TE.getOrElseW(() => T.of(undefined))
  )();
