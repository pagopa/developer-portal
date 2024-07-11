import ProductLayout from '@/components/organisms/ProductLayout/ProductLayout';
import ApiDataListPageTemplate from '@/components/templates/ApiDataListPageTemplate/ApiDataListPageTemplate';
import { baseUrl } from '@/config';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { getApiDataListPages, getProduct } from '@/lib/api';
import { Metadata } from 'next';

type Params = {
  productSlug: string;
};

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const apiDataListPage = await getApiDataListPages(params?.productSlug);

  return makeMetadata({
    title: apiDataListPage?.hero.title,
    url: `${baseUrl}/${apiDataListPage?.product.slug}/api`,
    locale: 'it_IT',
  });
}

const ApiDataListPage = async ({ params }: { params: Params }) => {
  const ApiDataListPageProps = await getApiDataListPages(params.productSlug);
  const product = await getProduct(params.productSlug);

  if (ApiDataListPageProps && product) {
    return (
      <>
        <ProductLayout
          product={product}
          path={product.path.concat('/api')}
          showBreadcrumbs
        >
          <ApiDataListPageTemplate {...ApiDataListPageProps} />
        </ProductLayout>
      </>
    );
  }
};

export default ApiDataListPage;
