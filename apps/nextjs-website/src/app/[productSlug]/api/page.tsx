import ProductLayout from '@/components/organisms/ProductLayout/ProductLayout';
import ApiDataListTemplate from '@/components/templates/ApiDataListTemplate/ApiDataListTemplate';
import { baseUrl } from '@/config';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import {
  breadcrumbItemByProduct,
  productToBreadcrumb,
} from '@/helpers/structuredData.helpers';
import {
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import { getApiDataListPages, getProducts } from '@/lib/api';
import { Metadata } from 'next';
import { cache } from 'react';

type Params = {
  productSlug: string;
};

// Set revalidation time to 1 hour
export const revalidate = 3600;

// Cache the API data list pages fetching
const getCachedApiDataListPages = cache(async (productSlug: string) => {
  const apiDataListPages = await getApiDataListPages(productSlug);
  return apiDataListPages;
});

// Cache the products fetching for static params
const getCachedProducts = cache(async () => {
  const products = await getProducts();
  return products;
});

export async function generateStaticParams() {
  const products = await getCachedProducts();
  return products.map((product) => ({
    productSlug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  // Use the cached version for metadata generation
  const apiDataListPage = await getCachedApiDataListPages(params?.productSlug);

  if (apiDataListPage?.seo) {
    return makeMetadataFromStrapi(apiDataListPage.seo);
  }

  return makeMetadata({
    title: apiDataListPage?.hero.title,
    url: `${baseUrl}/${apiDataListPage?.product.slug}/api`,
    locale: 'it_IT',
  });
}

const ApiDataListPage = async ({ params }: { params: Params }) => {
  // Use the cached version in the page component
  const apiDataListPageProps = await getCachedApiDataListPages(
    params.productSlug
  );

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      productToBreadcrumb(apiDataListPageProps?.product),
      {
        name:
          apiDataListPageProps?.seo?.metaTitle ||
          apiDataListPageProps?.hero.title,
        item: breadcrumbItemByProduct(apiDataListPageProps?.product, ['api']),
      },
    ],
    seo: apiDataListPageProps?.seo,
  });

  if (apiDataListPageProps) {
    return (
      <ProductLayout
        product={apiDataListPageProps.product}
        path={`/${apiDataListPageProps.product.slug}/api`}
        showBreadcrumbs
        structuredData={structuredData}
      >
        <ApiDataListTemplate {...apiDataListPageProps} />
      </ProductLayout>
    );
  }
};

export default ApiDataListPage;
