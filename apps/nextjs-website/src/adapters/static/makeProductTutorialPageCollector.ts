import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { ProductTutorialPageCollector } from '@/domain/productTutorialPage';
import { ioSignPageLinks, ioSignTutorialPage } from './products/ioSignPages';

export const makeProductTutorialPageCollector =
  (): ProductTutorialPageCollector => ({
    getAllPaths: () => TE.of([ioSignPageLinks.tutorialHowCreatePdf]),
    getPageBy: (path) => TE.of(O.some(ioSignTutorialPage)),
  });
