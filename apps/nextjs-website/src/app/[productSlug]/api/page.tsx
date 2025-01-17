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
import { getApiDataListPages, getProductsSlugs } from '@/lib/api';
import { Metadata } from 'next';

type Params = {
  productSlug: string;
};

export async function generateStaticParams() {
  return getProductsSlugs('api').map((productSlug) => ({
    productSlug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const apiDataListPage = await getApiDataListPages(params?.productSlug);

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
  const apiDataListPageProps = await getApiDataListPages(params.productSlug);

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
        path={apiDataListPageProps.product.path.concat('/api')}
        showBreadcrumbs
        structuredData={structuredData}
      >
        <ApiDataListTemplate {...apiDataListPageProps} />
      </ProductLayout>
    );
  }
};

export default ApiDataListPage;
