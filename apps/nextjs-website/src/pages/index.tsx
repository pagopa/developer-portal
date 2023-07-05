import { translations } from '@/_contents/translations';
import SiteLabel from '@/components/atoms/SiteLabel/SiteLabel';
import HeroSwiper from '@/components/molecules/HeroSwiper/HeroSwiper';
import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import ProductsShowcase from '@/components/organisms/ProductsShowcase/ProductsShowcase';
import { getProducts } from '@/lib/api';
import { useTheme } from '@mui/material';
import { GetStaticProps, GetStaticPropsResult } from 'next';

type HomeProps = LayoutProps;

export const getStaticProps: GetStaticProps<
  HomeProps
> = (): GetStaticPropsResult<LayoutProps> => {
  return { props: { products: [...getProducts()] } };
};

const Home = ({ products }: HomeProps) => {
  const { palette } = useTheme();
  const { homepage, header } = translations;

  return (
    <Layout products={products}>
      <HeroSwiper
        cards={homepage.heroItems.map((itemProp, index) => ({
          ...itemProp,
          child:
            index === 0 ? (
              <SiteLabel
                title={header.title}
                boldTitle={header.boldTitle}
                color={palette.primary.contrastText}
              />
            ) : undefined,
        }))}
      />
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
