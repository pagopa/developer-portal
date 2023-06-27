import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import { getProducts } from '@/lib/api';
import { GetStaticProps, GetStaticPropsResult } from 'next';

type HomeProps = LayoutProps;

export const getStaticProps: GetStaticProps<
  HomeProps
> = (): GetStaticPropsResult<LayoutProps> => {
  return { props: { products: getProducts().concat() } };
};

const Home = ({ products }: HomeProps) => {
  return (
    <Layout products={products}>
      <>Home Page</>
    </Layout>
  );
};

export default Home;
