import SiteLabel from '@/components/atoms/SiteLabel/SiteLabel';
import HeroSwiper from '@/components/molecules/HeroSwiper/HeroSwiper';
import RelatedLinks from '@/components/atoms/RelatedLinks/RelatedLinks';
import News from '@/components/organisms/News/News';
import ProductsShowcase from '@/components/organisms/ProductsShowcase/ProductsShowcase';
import { Metadata } from 'next';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { getHomepage, getProducts, getVisibleInHomeWebinars } from '@/lib/api';
import * as cms from '@/lib/cmsApi';
import dynamic from 'next/dynamic';
import { baseUrl } from '@/config';

export async function generateMetadata(): Promise<Metadata> {
  return makeMetadata({
    title: 'PagoPA DevPortal',
    description: 'Il portale per gli sviluppatori di PagoPA',
    url: baseUrl,
    locale: 'it_IT',
  });
}

const NotSsrWebinarHeaderBanner = dynamic(
  () => import('@/components/atoms/WebinarHeaderBanner/WebinarHeaderBanner'),
  { ssr: false }
);

const NotSsrWebinarsSection = dynamic(
  () => import('@/components/organisms/WebinarsSection/WebinarsSection'),
  { ssr: false }
);

const Home = async () => {
  const products = await getProducts();
  const webinars = await getVisibleInHomeWebinars();
  const homepageProps = await cms.getHomepage();

  if (!homepageProps) {
    // eslint-disable-next-line functional/no-throw-statements
    throw new Error('Data is required but not provided.');
  }

  return (
    <>
      <NotSsrWebinarHeaderBanner webinars={webinars} />

      <HeroSwiper
        cards={[...homepageProps.hero.cards].map((itemProp, index) => ({
          ...itemProp,
          child:
            index === 0 ? (
              <SiteLabel
                title={homepageProps.hero.siteTitle}
                boldTitle={homepageProps.hero.boldTitle}
              />
            ) : undefined,
        }))}
      />
      <News
        marginTop={5}
        title={homepageProps.news.title}
        cards={[...homepageProps.news.cards]}
      />
      <ProductsShowcase
        title={homepageProps.productsShowcaseTitle}
        cards={products.map((product) => ({
          title: product.name,
          text: product.description,
          href: product.subpaths.overview.path,
          svgPath: product.svgPath,
        }))}
      />
      <NotSsrWebinarsSection webinars={[...webinars]} />
      <RelatedLinks
        title={homepageProps.comingsoonDocumentation.title}
        links={[...homepageProps.comingsoonDocumentation.links]}
      />
    </>
  );
};

export default Home;
