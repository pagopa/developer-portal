import HeroSwiper from '@/components/molecules/HeroSwiper/HeroSwiper';
import RelatedLinks from '@/components/atoms/RelatedLinks/RelatedLinks';
import NewsShowcase from '@/components/organisms/NewsShowcase/NewsShowcase';
import ProductsShowcase from '@/components/organisms/ProductsShowcase/ProductsShowcase';
import { Metadata } from 'next';
import { makeMetadata } from '@/helpers/metadata.helpers';
import { getVisibleInHomeWebinars } from '@/lib/api';
import dynamic from 'next/dynamic';
import { baseUrl } from '@/config';
import { getHomepageProps } from '@/lib/cmsApi';
import BlocksRendererClient from '@/components/molecules/BlocksRendererClient/BlocksRendererClient';

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
  const webinars = await getVisibleInHomeWebinars();

  const homepage = await getHomepageProps();

  return (
    <>
      <NotSsrWebinarHeaderBanner webinars={webinars} />

      <HeroSwiper
        cards={homepage.hero.map((itemProp, index) => ({
          ...itemProp,
          child: itemProp.subhead && (
            <BlocksRendererClient
              key={index}
              content={itemProp.subhead}
              color={itemProp.subheadColor}
            />
          ),
        }))}
      />
      <NewsShowcase
        marginTop={5}
        title={homepage.newsShowcase.title}
        items={[...homepage.newsShowcase.items]}
      />
      <ProductsShowcase
        title={homepage.productsShowcase.title}
        cards={homepage.productsShowcase.products.map((product) => ({
          title: product.name,
          text: product.description || '',
          href: `/${product.slug}/overview`,
          logoUrl: product.logo.url,
        }))}
      />
      <NotSsrWebinarsSection webinars={[...homepage.webinars]} />
      <RelatedLinks
        title={homepage.comingsoonDocumentation.title}
        links={[...homepage.comingsoonDocumentation.links]}
      />
    </>
  );
};

export default Home;
