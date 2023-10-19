import { translations } from '@/_contents/translations';
import SiteLabel from '@/components/atoms/SiteLabel/SiteLabel';
import HeroSwiper from '@/components/molecules/HeroSwiper/HeroSwiper';
import RelatedLinks from '@/components/atoms/RelatedLinks/RelatedLinks';
import News from '@/components/organisms/News/News';
import ProductsShowcase from '@/components/organisms/ProductsShowcase/ProductsShowcase';
import { getHomepage, getProducts } from '@/lib/api';

const Home = async () => {
  const products = await getProducts();
  const homepageApi = await getHomepage();
  const { homepage, header } = translations;

  return (
    <>
      <HeroSwiper
        cards={homepageApi.cards.map((itemProp, index) => ({
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
        title={homepageApi.comingsoonDocumentation.title}
        links={[...homepageApi.comingsoonDocumentation.links]}
      />
    </>
  );
};

export default Home;
