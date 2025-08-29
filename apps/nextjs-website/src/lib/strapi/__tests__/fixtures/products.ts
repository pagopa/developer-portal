import { StrapiProducts } from '@/lib/strapi/types/product';
import {
  strapiProduct,
  productWithAllRelations,
} from '@/lib/strapi/__tests__/factories/product';

export const strapiProducts: StrapiProducts = {
  data: [strapiProduct(), productWithAllRelations()],
};

export const strapiProductsEmpty: StrapiProducts = {
  data: [],
};

export const strapiProductsSingle: StrapiProducts = {
  data: [strapiProduct()],
};
