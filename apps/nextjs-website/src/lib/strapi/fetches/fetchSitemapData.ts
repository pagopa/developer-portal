import { fetchFromStrapi } from '@/lib/strapi/fetchFromStrapi';
import * as qs from 'qs';
import { StrapiProducts } from '@/lib/strapi/types/product';
import { StrapiTutorials } from '@/lib/strapi/types/tutorial';
import { StrapiApiDataList } from '@/lib/strapi/types/apiDataList';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import { makeBuildConfig } from '@/BuildConfig';
import { makeBuildEnv } from '@/BuildEnv';
import { secrets } from '@/config';

// --------------------------------------------------------------------------------
// Environment Initialization
// --------------------------------------------------------------------------------
// Initialize the Build Environment to provide configuration and fetch functions
// to the Strapi readers.
const buildEnv = pipe(
  makeBuildConfig(Object.keys(secrets).length > 0 ? secrets : process.env),
  E.map(makeBuildEnv),
  E.getOrElseW((errors) => {
    // eslint-disable-next-line functional/no-throw-statements
    throw errors;
  })
);

// --------------------------------------------------------------------------------
// Internal Fetchers (Readers)
// --------------------------------------------------------------------------------

const fetchProductSlugsReader = fetchFromStrapi<StrapiProducts>(
  'products',
  qs.stringify({
    fields: ['slug', 'isVisible', 'updatedAt'],
    pagination: {
      limit: -1, // Fetch all records
    },
    filters: {
      isVisible: {
        $eq: true, // Only fetch visible products
      },
    },
  })
);

const fetchProductSinglePagesReader = (productSlug: string) =>
  fetchFromStrapi<StrapiProducts>(
    'products',
    qs.stringify({
      filters: {
        slug: {
          $eq: productSlug,
        },
      },
      fields: ['slug'],
      populate: {
        overview: { fields: ['updatedAt'] },
        quickstart_guide: { fields: ['updatedAt'] },
        tutorial_list_page: { fields: ['updatedAt'] },
        guide_list_page: { fields: ['updatedAt'] },
        release_note: { fields: ['updatedAt'] },
        api_data_list_page: { fields: ['updatedAt'] },
        use_case_list_page: { fields: ['updatedAt'] },
      },
      pagination: {
        limit: 1,
      },
    })
  );

const makeCollectionFetcher = <T>(
  contentType: string,
  productSlug: string,
  queryParams: Record<string, unknown>
) =>
  fetchFromStrapi<T>(
    contentType,
    qs.stringify({
      filters: {
        product: {
          slug: {
            $eq: productSlug,
          },
        },
      },
      pagination: {
        limit: -1,
      },
      ...queryParams,
    })
  );

const fetchProductTutorialsReader = (productSlug: string) =>
  makeCollectionFetcher<StrapiTutorials>('tutorials', productSlug, {
    fields: ['slug', 'updatedAt'],
  });

const fetchProductApiDataReader = (productSlug: string) =>
  makeCollectionFetcher<StrapiApiDataList>('apis-data', productSlug, {
    fields: ['updatedAt'],
    populate: {
      apiRestDetail: { fields: ['slug'] },
      apiSoapDetail: { fields: ['slug'] },
    },
  });

// --------------------------------------------------------------------------------
// Exported Async Fetchers
// --------------------------------------------------------------------------------

// Optimized fetcher for Product Slugs.
// Fetches all products but only selects 'slug', 'isVisible', and 'updatedAt' fields.
// This is the first step in the sitemap generation: getting the list of all products.
export const fetchProductSlugs = async () => fetchProductSlugsReader(buildEnv);

// Fetches the specific Single Pages associated with a Product (Overview, QuickStart, etc.).
// This allows us to check existence and get 'updatedAt' for these pages for a specific product.
export const fetchProductSinglePages = async (productSlug: string) =>
  fetchProductSinglePagesReader(productSlug)(buildEnv);

// Fetches Tutorials for a specific product.
// Only retrieves 'slug' and 'updatedAt' to build the sitemap URL.
export const fetchProductTutorials = async (productSlug: string) =>
  fetchProductTutorialsReader(productSlug)(buildEnv);

// Fetches API Data entries for a specific product.
// We need 'updatedAt' and the slug from either 'apiRestDetail' or 'apiSoapDetail'.
export const fetchProductApiData = async (productSlug: string) =>
  fetchProductApiDataReader(productSlug)(buildEnv);
