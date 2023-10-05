import { translations } from '@/_contents/translations';
import SiteLabel from '@/components/atoms/SiteLabel/SiteLabel';
import HeroSwiper from '@/components/molecules/HeroSwiper/HeroSwiper';
import RelatedLinks from '@/components/atoms/RelatedLinks/RelatedLinks';
import Layout from '@/components/organisms/Layout/Layout';
import News from '@/components/organisms/News/News';
import ProductsShowcase from '@/components/organisms/ProductsShowcase/ProductsShowcase';
import { getProducts } from '@/lib/api';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { homepage, shared } = translations;

  return {
    title: shared.siteTitle,
    description: homepage.productsShowcaseTitle,
    openGraph: {
      title: shared.siteTitle,
      description: homepage.productsShowcaseTitle,
      url: '/',
    },
    twitter: {
      card: 'summary_large_image',
      site: shared.siteTitle,
    },
  };
}

const Home = () => {
  const products = [...getProducts()];
  const { homepage, header } = translations;

  return (
    <Layout products={products}>
      <HeroSwiper
        cards={homepage.heroItems.map((itemProp, index) => ({
          ...itemProp,
          child:
            index === 0 ? (
              <SiteLabel title={header.title} boldTitle={header.boldTitle} />
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
