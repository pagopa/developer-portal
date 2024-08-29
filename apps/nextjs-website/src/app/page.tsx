import HeroSwiper from '@/components/molecules/HeroSwiper/HeroSwiper';
import RelatedLinks from '@/components/atoms/RelatedLinks/RelatedLinks';
import NewsShowcase from '@/components/organisms/NewsShowcase/NewsShowcase';
import { Metadata } from 'next';
import {
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import dynamic from 'next/dynamic';
import { baseUrl } from '@/config';
import { getHomepageProps } from '@/lib/cmsApi';
import BlocksRendererClient from '@/components/molecules/BlocksRendererClient/BlocksRendererClient';
import Ecosystem from '@/components/organisms/Ecosystem/Ecosystem';
import ContentWrapper from '@/components/atoms/ContentWrapper/ContentWrapper';

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepageProps();

  return homepage.seo
    ? makeMetadataFromStrapi(homepage.seo)
    : makeMetadata({
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
  const homepage = await getHomepageProps();

  return (
    <ContentWrapper>
      <NotSsrWebinarHeaderBanner webinars={[...homepage.webinars]} />

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
      <Ecosystem {...homepage.ecosystem} />
      <NotSsrWebinarsSection webinars={[...homepage.webinars]} />
      <RelatedLinks
        title={homepage.comingsoonDocumentation.title}
        links={[...homepage.comingsoonDocumentation.links]}
      />
    </ContentWrapper>
  );
};

export default Home;
