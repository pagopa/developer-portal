import { translations } from '@/_contents/translations';
import SiteLabel from '@/components/atoms/SiteLabel/SiteLabel';
import HeroSwiper from '@/components/molecules/HeroSwiper/HeroSwiper';
import RelatedLinks from '@/components/atoms/RelatedLinks/RelatedLinks';
import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import News from '@/components/organisms/News/News';
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
      <News
        marginTop={5}
        title={homepage.news.title}
        cards={homepage.news.list}
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
      <RelatedLinks
        title={homepage.comingsoonDocumentation.title}
        links={homepage.comingsoonDocumentation.links}
      />
    </Layout>
  );
};

export default Home;
