import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { ProductTutorialPageCollector } from 'core/domain/productTutorialPage';
import { ioSignPageLinks, ioSignTutorialPage } from './products/ioSignPages';

export const makeProductTutorialPageCollector =
  (): ProductTutorialPageCollector => ({
    getAllPaths: () => TE.of([ioSignPageLinks.tutorialHowCreatePdf]),
    getPageBy: () => TE.of(O.some(ioSignTutorialPage)),
  });
