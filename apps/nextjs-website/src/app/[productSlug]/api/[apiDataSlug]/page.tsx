import { getApiData, getApiDataParams, getProduct } from '@/lib/api';
import ProductLayout, {
  ProductLayoutProps,
} from '@/components/organisms/ProductLayout/ProductLayout';
import { Product } from '@/lib/types/product';
import ApiSection from '@/components/molecules/ApiSection/ApiSection';
import { Metadata, ResolvingMetadata } from 'next';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { ApiDataParams } from '@/lib/types/apiDataParams';
import PageNotFound from '@/app/not-found';

export type ApiPageProps = {
  readonly product?: Product;
  readonly apiDataSlug: string;
  readonly specURLsName?: string;
  readonly specURLs: {
    name?: string;
    url: string;
    hideTryIt?: boolean;
  }[];
} & ProductLayoutProps;

export async function generateStaticParams() {
  return getApiDataParams();
}

export const generateMetadata = async (
  { params }: ApiDataParams,
  parent: ResolvingMetadata
): Promise<Metadata> => {
  const resolvedParent = await parent;
  const ApiDataProps = await getApiData(params.apiDataSlug);

  return makeMetadata({
    title: ApiDataProps?.specURLsName,
    description: ApiDataProps?.product?.description,
    url: ApiDataProps?.path,
    parent: resolvedParent,
  });
};

const ApiDataPage = async ({ params }: ApiDataParams) => {
  const apiDataProps = await getApiData(params.apiDataSlug);
  const product = await getProduct(params.productSlug);
  if (apiDataProps && product) {
    return (
      <ProductLayout
        product={product}
        path={product.path.concat('/api')}
        bannerLinks={product.bannerLinks || apiDataProps.bannerLinks}
        showBreadcrumbs
      >
        <ApiSection
          apiSlug={params.apiDataSlug}
          specURLs={apiDataProps.specURLs}
          product={product}
          specURLsName={apiDataProps.specURLsName}
        />
      </ProductLayout>
    );
  }
  return <PageNotFound />;
};

export default ApiDataPage;
