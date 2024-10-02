import { products } from '@/_contents/products';
import {
  Products,
  Product as ApiProduct,
  BaseProduct,
} from '../codecs/ProductCodec';
import { Product } from '../../types/product';

export function mergeProductWithStaticContent(
  attributes: Partial<ApiProduct['attributes']> & BaseProduct['attributes']
): Product {
  const staticProduct =
    products.find((product) => product.slug === attributes.slug) || products[0];
  return {
    ...staticProduct,
    ...attributes,
    logo: attributes.logo?.data.attributes || staticProduct.logo,
    bannerLinks: [
      ...(attributes.bannerLinks?.map((item) => ({
        ...item,
        icon: item.icon?.data.attributes,
      })) || []),
    ],
    api_data_list_page: attributes.api_data_list_page,
    tutorial_list_page: attributes.tutorial_list_page,
    guide_list_page: attributes.guide_list_page,
    overview: attributes.overview,
    quickstart_guide: attributes.quickstart_guide,
  };
}

export function makeProductsProps(
  products: Products,
  staticProducts: ReadonlyArray<Product>
): ReadonlyArray<Product> {
  const productsSlugs = new Set(
    products.data.map(({ attributes }) => attributes.slug)
  );
  const filteredStaticProducts = staticProducts.filter(
    ({ slug }) => !productsSlugs.has(slug)
  );

  return [
    ...filteredStaticProducts,
    ...products.data.map(({ attributes }) => {
      return mergeProductWithStaticContent(attributes);
    }),
  ];
}
