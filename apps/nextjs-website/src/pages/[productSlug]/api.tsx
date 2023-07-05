import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
import { Product } from '@/lib/types/product';
import { getApi, getApiPaths, getProducts } from '@/lib/api';
import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import ApiSection from '@/components/molecules/ApiSection/ApiSection';

type Params = {
  productSlug: string;
};

export const getStaticPaths: GetStaticPaths<Params> = () => ({
  paths: [...getApiPaths()],
  fallback: false,
});

export type ApiPageProps = {
  readonly product: Product;
  readonly specURLs: {
    name?: string;
    url: string;
    hideTryIt?: boolean;
  }[];
} & LayoutProps;

export const getStaticProps: GetStaticProps<ApiPageProps, Params> = ({
  params,
}): GetStaticPropsResult<ApiPageProps> => {
  const props = getApi(params?.productSlug);
  if (props) {
    return { props: { ...props, products: [...getProducts()] } };
  } else {
    return { notFound: true as const };
  }
};

const ApisPage = ({
  products,
  path,
  product,
  specURLs,
  bannerLinks,
}: ApiPageProps) => (
  <Layout
    products={products}
    product={product}
    path={path}
    bannerLinks={bannerLinks}
    showBreadcrumbs={true}
  >
    <ApiSection specURLs={specURLs} product={product} />
  </Layout>
);

export default ApisPage;
