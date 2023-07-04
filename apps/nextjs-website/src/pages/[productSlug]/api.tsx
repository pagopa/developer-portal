import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
import { Product } from '@/lib/types/product';
import { getApi, getApiPaths, getProducts } from '@/lib/api';
import { ApiViewer } from '@/components/atoms/ApiViewer/ApiViewer';
import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';

type Params = {
  productSlug: string;
};

export const getStaticPaths: GetStaticPaths<Params> = () => ({
  paths: [...getApiPaths()],
  fallback: false,
});

export type ApiPageProps = {
  readonly product: Product;
  readonly specURL: string;
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
  specURL,
  bannerLinks,
}: ApiPageProps) => (
  <Layout
    products={products}
    product={product}
    path={path}
    bannerLinks={bannerLinks}
  >
    <ApiViewer specURL={specURL} product={product} />
  </Layout>
);

export default ApisPage;
