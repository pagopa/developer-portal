import { getApiData, getProduct, getProductsSlugs } from '@/lib/api';
import ProductLayout, {
  ProductLayoutProps,
} from '@/components/organisms/ProductLayout/ProductLayout';
import { Product } from '@/lib/types/product';
import ApiSection from '@/components/molecules/ApiSection/ApiSection';
import { Metadata, ResolvingMetadata } from 'next';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { ApiParams } from '@/lib/types/apiParams';
import { products, productsBannerLinks } from '@/_contents/products';

export async function generateStaticParams() {
  return getProductsSlugs('api').map((productSlug) => ({
    productSlug,
  }));
}

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

export const generateMetadata = async (
  { params }: ApiParams,
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

const ApisPage = async ({ params }: ApiParams) => {
  const ApiDataProps = await getApiData(params.apiDataSlug);
  const product = await getProduct(params.productSlug);
  if (ApiDataProps && product) {
    const bannerLink = productsBannerLinks[products.indexOf(product)];
    return (
      <ProductLayout
        product={product}
        path={product.path.concat('/api')}
        bannerLinks={bannerLink || ApiDataProps.bannerLinks}
        showBreadcrumbs
      >
        <ApiSection
          apiSlug={params.apiDataSlug}
          specURLs={ApiDataProps.specURLs}
          product={product}
          specURLsName={ApiDataProps.specURLsName}
        />
      </ProductLayout>
    );
  }
};

export default ApisPage;
