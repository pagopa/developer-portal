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
import { getApiDataListPages } from '@/lib/api';
import { Metadata } from 'next';

type Params = {
  locale: string;
  productSlug: string;
};

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const params = await props.params;
  const apiDataListPage = await getApiDataListPages(params?.productSlug);

  if (apiDataListPage?.seo) {
    return makeMetadataFromStrapi(apiDataListPage.seo);
  }

  return makeMetadata({
    title: [apiDataListPage?.hero.title, apiDataListPage?.product.name]
      .filter(Boolean)
      .join(' | '),
    url: `${baseUrl}/${params.locale}/${apiDataListPage?.product.slug}/api`,
    locale: 'it_IT',
  });
}

const ApiDataListPage = async (props: { params: Promise<Params> }) => {
  const params = await props.params;
  const apiDataListPageProps = await getApiDataListPages(params.productSlug);

  const structuredData = generateStructuredDataScripts({
    breadcrumbsItems: [
      productToBreadcrumb(params.locale, apiDataListPageProps?.product),
      {
        name:
          apiDataListPageProps?.seo?.metaTitle ||
          apiDataListPageProps?.hero.title,
        item: breadcrumbItemByProduct(
          params.locale,
          apiDataListPageProps?.product,
          ['api']
        ),
      },
    ],
    seo: apiDataListPageProps?.seo,
  });

  if (apiDataListPageProps) {
    return (
      <ProductLayout
        product={apiDataListPageProps.product}
        path={`/${params.locale}/${apiDataListPageProps.product.slug}/api`}
        showBreadcrumbs
        structuredData={structuredData}
      >
        <ApiDataListTemplate {...apiDataListPageProps} />
      </ProductLayout>
    );
  }
};

export default ApiDataListPage;
