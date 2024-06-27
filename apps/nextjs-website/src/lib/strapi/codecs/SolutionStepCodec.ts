import * as t from 'io-ts/lib';
import { BlocksContentCodec } from './BlocksContentCodec';
import { ProductCodec } from './ProductCodec';

export const SolutionStepCodec = t.strict({
  title: t.string,
  content: BlocksContentCodec,
  products: t.strict({ data: t.array(ProductCodec) }),
});
