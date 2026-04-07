import {
  fetchProducts,
  fetchProductSinglePagesReader,
  fetchProductSlugsReader,
} from './fetcher';
import { mapProductsProps } from './mapper';
import { Product } from './types';

export const ProductRepository = {
  /**
   * Returns all products (ordered by name) pre-transformed and ready for UI
   * @param locale The locale used to get the product collection.
   * @returns An array of products with all their fields, sorted by name.
   */
  getAll: async (locale: string): Promise<ReadonlyArray<Product>> => {
    const strapiProducts = await fetchProducts(locale);
    const products = mapProductsProps(locale, strapiProducts);
    return [...products].sort((productA, productB) =>
      productA.name.localeCompare(productB.name)
    );
  },
  /**
   * Fetches all products but only selects 'slug', 'isVisible', and 'updatedAt' fields.
   * This is the first step in the sitemap generation: getting the list of all products.
   * @param locale The locale used to get the product collection.
   * @returns An array of products with only 'slug', 'isVisible', and 'updatedAt' fields.
   */
  getProductSlugs: async (locale: string) => fetchProductSlugsReader(locale),
  /**
   * Fetches the specific Single Pages associated with a Product (Overview, QuickStart, etc.).
   * This allows us to check existence and get 'updatedAt' for these pages for a specific product.
   * @param locale The locale used to get the product collection.
   * @param productSlug The slug of the product to fetch single pages for.
   * @returns An array of single pages associated with the specified product.
   */
  getProductSinglePages: async (locale: string, productSlug: string) =>
    fetchProductSinglePagesReader(locale, productSlug),
};
