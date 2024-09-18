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
import { getApiDataListPages, getProduct, getProductsSlugs } from '@/lib/api';
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
  const product = await getProduct(params.productSlug);

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      productToBreadcrumb(product),
      {
        name: apiDataListPageProps?.seo?.metaTitle,
        item: breadcrumbItemByProduct(product, ['api']),
      },
    ],
    seo: apiDataListPageProps?.seo,
  });

  if (apiDataListPageProps && product) {
    return (
      <>
        {structuredData}
        <ProductLayout
          product={product}
          path={product.path.concat('/api')}
          showBreadcrumbs
        >
          <ApiDataListTemplate {...apiDataListPageProps} />
        </ProductLayout>
      </>
    );
  }
};

export default ApiDataListPage;
