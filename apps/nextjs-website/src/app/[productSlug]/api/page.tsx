import { getApi, getProductsSlugs } from '@/lib/api';
import ProductLayout, {
  ProductLayoutProps,
} from '@/components/organisms/ProductLayout/ProductLayout';
import { ProductParams } from '@/lib/types/productParams';
import { Product } from '@/lib/types/product';
import ApiSection from '@/components/molecules/ApiSection/ApiSection';
import { Metadata, ResolvingMetadata } from 'next';
import {
  getPreviousTitle,
  getTwitterMetadata,
} from '@/helpers/metadata.helpers';

export async function generateStaticParams() {
  return getProductsSlugs('api').map((productSlug) => ({
    productSlug,
  }));
}

export type ApiPageProps = {
  readonly product: Product;
  readonly soapDocumentation?: {
    title: string;
    url: string;
    buttonLabel: string;
    icon: string;
  };
  readonly specURLsName?: string;
  readonly specURLs: {
    name?: string;
    url: string;
    hideTryIt?: boolean;
  }[];
} & ProductLayoutProps;

export const generateMetadata = async (
  { params }: ProductParams,
  parent: ResolvingMetadata
): Promise<Metadata> => {
  const resolvedParent = await parent;
  const previousTitle = getPreviousTitle(resolvedParent);
  const { product } = await getApi(params.productSlug);
  const title = `${previousTitle} - ${product.name}`;

  return {
    title,
    openGraph: {
      title,
      description: product.description,
      url: product.path,
    },
    twitter: getTwitterMetadata(title),
  };
};

const ApisPage = async ({ params }: ProductParams) => {
  const {
    path,
    product,
    specURLs,
    bannerLinks,
    soapDocumentation,
    specURLsName,
  } = await getApi(params.productSlug);

  return (
    <ProductLayout
      product={product}
      path={path}
      bannerLinks={bannerLinks}
      showBreadcrumbs={false}
    >
      <ApiSection
        specURLs={specURLs}
        product={product}
        specURLsName={specURLsName}
        soapDocumentation={soapDocumentation}
      />
    </ProductLayout>
  );
};

export default ApisPage;
