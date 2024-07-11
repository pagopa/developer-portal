import { getApisDataPages, getProduct, getProductsSlugs } from '@/lib/api';
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
  const ApisDataPageProps = await getApisDataPages(params.apiDataSlug);

  return makeMetadata({
    title: ApisDataPageProps?.specURLsName,
    description: ApisDataPageProps?.product?.description,
    url: ApisDataPageProps?.path,
    parent: resolvedParent,
  });
};

const ApisPage = async ({ params }: ApiParams) => {
  const ApisDataPageProps = await getApisDataPages(params.apiDataSlug);
  const product = await getProduct(params.productSlug);
  if (ApisDataPageProps && product) {
    const bannerLink = productsBannerLinks[products.indexOf(product)];
    return (
      <ProductLayout
        product={product}
        path={product.path.concat('/api')}
        bannerLinks={bannerLink || ApisDataPageProps.bannerLinks}
        showBreadcrumbs
      >
        <ApiSection
          apiSlug={params.apiDataSlug}
          specURLs={ApisDataPageProps.specURLs}
          product={product}
          specURLsName={ApisDataPageProps.specURLsName}
        />
      </ProductLayout>
    );
  }
};

export default ApisPage;
