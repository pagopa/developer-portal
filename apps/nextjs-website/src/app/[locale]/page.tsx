import HeroSwiper from '@/components/molecules/HeroSwiper/HeroSwiper';
import RelatedLinks from '@/components/atoms/RelatedLinks/RelatedLinks';
import NewsShowcase, {
  NewsShowcaseProps,
} from '@/components/organisms/NewsShowcase/NewsShowcase';
import { Metadata } from 'next';
import {
  makeMetadata,
  makeMetadataFromStrapi,
} from '@/helpers/metadata.helpers';
import { baseUrl } from '@/config';
import { getHomepageProps } from '@/lib/cmsApi';

export const dynamic = 'force-dynamic';

import BlocksRendererClient from '@/components/molecules/BlocksRendererClient/BlocksRendererClient';
import Ecosystem from '@/components/organisms/Ecosystem/Ecosystem';
import ContentWrapper from '@/components/atoms/ContentWrapper/ContentWrapper';
import { generateStructuredDataScripts } from '@/helpers/generateStructuredDataScripts.helpers';
import { websiteWithContext } from '@/helpers/structuredData.helpers';
import { CardsGridProps } from '@/components/molecules/CardsGrid/CardsGrid';
import { CtaSlideProps } from '@/components/atoms/CtaSlide/CtaSlide';
import { Webinar } from '@/lib/types/webinar';
import { SEO } from '@/lib/types/seo';
import WebinarHeaderBanner from '@/components/atoms/WebinarHeaderBanner/WebinarHeaderBanner';
import WebinarsSection from '@/components/organisms/WebinarsSection/WebinarsSection';

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
  readonly title?: string;
  readonly links: readonly {
    readonly text: string;
    readonly href: string;
  }[];
};

export type HomepageProps = {
  readonly hero: readonly CtaSlideProps[];
  readonly newsShowcase?: NewsShowcaseProps;
  readonly ecosystem?: EcosystemProps;
  readonly webinars: readonly Webinar[];
  readonly comingsoonDocumentation: ComingSoonDocumentationProps;
  readonly seo?: SEO;
  readonly updatedAt: string;
};

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const homepage = await getHomepageProps();

  return homepage.seo
    ? makeMetadataFromStrapi(homepage.seo)
    : makeMetadata({
        title: 'PagoPA DevPortal',
        description: 'Il portale per gli sviluppatori di PagoPA',
        url: `${baseUrl}/${params.locale}`,
        locale: 'it_IT',
      });
}

const Home = async () => {
  const {
    webinars,
    hero,
    newsShowcase,
    ecosystem,
    comingsoonDocumentation,
    seo,
  }: HomepageProps = await getHomepageProps();

  const structuredData = generateStructuredDataScripts({
    seo: seo,
    things: [websiteWithContext],
  });

  return (
    <>
      {structuredData}
      <ContentWrapper>
        <WebinarHeaderBanner webinars={[...webinars]} />

        <HeroSwiper
          cards={hero.map((itemProp, index) => ({
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
        {newsShowcase && (
          <NewsShowcase
            marginTop={5}
            title={newsShowcase.title}
            items={[...newsShowcase.items]}
          />
        )}
        {ecosystem && <Ecosystem {...ecosystem} />}
        <WebinarsSection webinars={[...webinars]} />
        <RelatedLinks
          title={comingsoonDocumentation.title}
          links={[...comingsoonDocumentation.links]}
        />
      </ContentWrapper>
    </>
  );
};

export default Home;
