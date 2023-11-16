import { translations } from '@/_contents/translations';
import SiteLabel from '@/components/atoms/SiteLabel/SiteLabel';
import HeroSwiper from '@/components/molecules/HeroSwiper/HeroSwiper';
import RelatedLinks from '@/components/atoms/RelatedLinks/RelatedLinks';
import News from '@/components/organisms/News/News';
import ProductsShowcase from '@/components/organisms/ProductsShowcase/ProductsShowcase';
import { getNextWebinars, getProducts } from '@/lib/api';
import WebinarsSection from '@/components/organisms/WebinarsSection/WebinarsSection';
import dynamic from 'next/dynamic';

const NotSsrWebinarHeaderBanner = dynamic(
  () => import('@/components/atoms/WebinarHeaderBanner/WebinarHeaderBanner'),
  { ssr: false }
);

const Home = async () => {
  const products = await getProducts();
  const nextWebinars = await getNextWebinars();
  const { homepage, header } = translations;

  return (
    <>
      {nextWebinars.length !== 0 && nextWebinars[0].endDateTime && (
        <NotSsrWebinarHeaderBanner
          slug={nextWebinars[0].slug}
          text={nextWebinars[0].title}
          endDateTime={nextWebinars[0].endDateTime}
        />
      )}

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
      {nextWebinars.length !== 0 && (
        <WebinarsSection
          title={homepage.webinarsSection.title}
          description={homepage.webinarsSection.description}
          webinars={[...nextWebinars]}
        />
      )}
      <RelatedLinks
        title={homepage.comingsoonDocumentation.title}
        links={homepage.comingsoonDocumentation.links}
      />
    </>
  );
};

export default Home;
