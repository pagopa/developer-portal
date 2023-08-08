import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
import { Product } from '@/lib/types/product';
import { getApi, getApiPaths, getProducts } from '@/lib/api';
import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import ApiSection from '@/components/molecules/ApiSection/ApiSection';

type Params = {
  productSlug: string;
};

export const getStaticPaths: GetStaticPaths<Params> = () => ({
  paths: [...getApiPaths(), '/send/api/schemas/PreLoadResponse'],
  fallback: false,
});

export type ApiPageProps = {
  readonly product: Product;
  readonly soapDocumentation?: {
    title: string;
    url: string;
    buttonLabel: string;
    icon: string;
  };
  readonly specURLs: {
    name?: string;
    url: string;
    hideTryIt?: boolean;
  }[];
} & LayoutProps;

export const getStaticProps: GetStaticProps<any, Params> = ({
  params,
}): GetStaticPropsResult<any> => {
  const props = getApi(params?.productSlug);
  if (props) {
    return { props: { ...props, products: [...getProducts()] } };
  } else {
    return {} as any;
  }
};

const ApisPage = ({
  products,
  path,
  product,
  specURLs,
  bannerLinks,
  soapDocumentation,
}: ApiPageProps) => (
  <Layout
    products={products ?? []}
    product={product}
    path={path}
    bannerLinks={bannerLinks}
    showBreadcrumbs={false}
  >
    <ApiSection
      specURLs={specURLs}
      product={product}
      soapDocumentation={soapDocumentation}
    />
  </Layout>
);

export default ApisPage;
