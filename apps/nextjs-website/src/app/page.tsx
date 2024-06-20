import HeroSwiper from '@/components/molecules/HeroSwiper/HeroSwiper';
import RelatedLinks from '@/components/atoms/RelatedLinks/RelatedLinks';
import NewsShowcase from '@/components/organisms/NewsShowcase/NewsShowcase';
import { Metadata } from 'next';
import { makeMetadata } from '@/helpers/metadata.helpers';
import dynamic from 'next/dynamic';
import { baseUrl } from '@/config';
import { getHomepageProps } from '@/lib/cmsApi';
import BlocksRendererClient from '@/components/molecules/BlocksRendererClient/BlocksRendererClient';
import Ecosystem from '@/components/organisms/Ecosystem/Ecosystem';
import CardsGrid from '@/components/molecules/CardsGrid/CardsGrid';
import Link from 'next/link';
import { Box } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

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
  const homepage = await getHomepageProps();

  return (
    <>
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
      <Ecosystem
        title={homepage.ecosystem.title}
        items={[
          {
            title: homepage.ecosystem.productsTabName,
            content: (
              <CardsGrid
                cardVariant={'outlined'}
                cardSvg
                cards={homepage.ecosystem.products}
                containerSx={{ px: 0, pb: '22px' }}
              />
            ),
          },
          {
            title: homepage.ecosystem.solutionsTabName,
            content: (
              <>
                <CardsGrid
                  cardVariant={'outlined'}
                  cardSvg
                  cards={homepage.ecosystem.solutions}
                />
                {homepage.ecosystem.solutionsCta && (
                  <Box textAlign={'center'}>
                    <ButtonNaked
                      component={Link}
                      href={homepage.ecosystem.solutionsCta.link.href}
                      color={'primary'}
                      variant={
                        homepage.ecosystem.solutionsCta.variant || 'contained'
                      }
                      sx={{ mb: 3 }}
                      target={
                        homepage.ecosystem.solutionsCta.link.target ?? '_self'
                      }
                    >
                      {homepage.ecosystem.solutionsCta.link.text}
                    </ButtonNaked>
                  </Box>
                )}
              </>
            ),
          },
        ]}
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
