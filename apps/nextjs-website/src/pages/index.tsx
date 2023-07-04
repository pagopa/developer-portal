import { translations } from '@/_contents/translations';
import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import ProductsShowcase from '@/components/organisms/ProductsShowcase/ProductsShowcase';
import { getProducts } from '@/lib/api';
import { GetStaticProps, GetStaticPropsResult } from 'next';

type HomeProps = LayoutProps;

export const getStaticProps: GetStaticProps<
  HomeProps
> = (): GetStaticPropsResult<LayoutProps> => {
  return { props: { products: [...getProducts()] } };
};

const Home = ({ products }: HomeProps) => {
  const { homepage } = translations;
  return (
    <Layout products={products}>
      <ProductsShowcase
        title={homepage.productsShowcaseTitle}
        cards={products.map((product) => ({
          title: product.name,
          text: product.description,
          href: product.subpaths.overview.path,
          svgPath: product.svgPath,
        }))}
      />
    </Layout>
  );
};

export default Home;
