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
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import { websiteWithContext } from '@/helpers/structuredData.helpers';
import { Media } from '@/lib/strapi/codecs/MediaCodec';
import { CardsGridProps } from '@/components/molecules/CardsGrid/CardsGrid';
import { CtaSlideProps } from '@/components/atoms/CtaSlide/CtaSlide';
import { Webinar } from '@/lib/types/webinar';
import { SEO } from '@/lib/types/seo';

type NewsShowcaseItemProps = {
  readonly comingSoon?: boolean;
  readonly title: string;
  readonly publishedAt?: Date;
  readonly link: {
    readonly text: string;
    readonly url: string;
    readonly target?: '_self' | '_blank' | '_parent' | '_top';
  };
  readonly image?: Media;
};

type NewsShowcaseProps = {
  readonly title: string;
  readonly items: readonly NewsShowcaseItemProps[];
};

type EcosystemSolutionsCtaProps = {
  readonly variant?: 'text' | 'contained' | 'outlined';
  readonly link: {
    readonly href: string;
    readonly text: string;
    readonly target?: '_self' | '_blank' | '_parent' | '_top';
  };
};

type EcosystemProps = {
  readonly title: string;
  readonly productsTabName: string;
  readonly products: CardsGridProps['cards'];
  readonly solutionsTabName: string;
  readonly solutions?: CardsGridProps['cards'];
  readonly solutionsCta?: EcosystemSolutionsCtaProps;
};

type ComingSoonDocumentationProps = {
  readonly title: string;
  readonly links: readonly {
    readonly text: string;
    readonly href: string;
  }[];
};

export type HomepageProps = {
  readonly hero: readonly CtaSlideProps[];
  readonly newsShowcase: NewsShowcaseProps;
  readonly ecosystem: EcosystemProps;
  readonly webinars: readonly Webinar[];
  readonly comingsoonDocumentation: ComingSoonDocumentationProps;
  readonly seo?: SEO;
};

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
  const homepage: HomepageProps = await getHomepageProps();

  const structuredData = generateStructuredDataScripts({
    seo: homepage.seo,
    things: [websiteWithContext],
  });

  return (
    <>
      {structuredData}
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
    </>
  );
};

export default Home;
