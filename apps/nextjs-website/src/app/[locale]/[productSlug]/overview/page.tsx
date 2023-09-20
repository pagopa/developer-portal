import { getOverview, getProductsSlugs } from '@/lib/api';
import Hero from '@pagopa/pagopa-editorial-components/dist/components/Hero';
import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import { Product } from '@/lib/types/product';
import { Tutorial } from '@/lib/types/tutorialData';
import StartInfo from '@/components/organisms/StartInfo/StartInfo';
import { translations } from '@/_contents/translations';
import RelatedLinks from '@/components/atoms/RelatedLinks/RelatedLinks';
import { Path } from '@/lib/types/path';
import TutorialsOverview from '@/components/organisms/TutorialsOverview/TutorialsOverview';
import Feature from '@/editorialComponents/Feature/Feature';
import { FeatureItem } from '@/editorialComponents/Feature/FeatureStackItem';
import { GuideCardProps } from '@/components/molecules/GuideCard/GuideCard';
import PostIntegration from '@/components/organisms/PostIntegration/PostIntegration';
import { ProductParams } from '@/lib/types/productParams';
import { useTranslations } from 'next-intl';

export async function generateStaticParams() {
  return [...getProductsSlugs('overview')].map((productSlug) => ({
    productSlug,
  }));
}

export type OverviewPageProps = {
  readonly path: string;
  readonly product: Product;
  readonly hero: {
    readonly backgroundImage: string;
    readonly altText: string;
    readonly title: string;
    readonly subtitle: string;
  };
  readonly feature: {
    readonly title: string;
    readonly subtitle: string;
    readonly items: FeatureItem[];
  };
  readonly startInfo?: {
    readonly cta?: {
      readonly text: string;
      readonly label: string;
      readonly href: string;
      readonly iconName?: string;
    };
    readonly cards: {
      readonly coomingSoon?: boolean;
      readonly title: string;
      readonly text: string;
      readonly href?: string;
      readonly iconName: string;
    }[];
  };
  readonly tutorials: {
    readonly subtitle: string;
    readonly list?: readonly Tutorial[];
  };
  readonly postIntegration?: {
    readonly subtitle: string;
    readonly listTitle?: string;
    readonly cta?: {
      readonly label: string;
      readonly href: string;
    };
    readonly guides?: GuideCardProps[];
    readonly list?: readonly {
      readonly title: string;
      readonly description: string;
      readonly path: string;
      readonly name: string;
    }[];
  };
  readonly relatedLinks?: Path[];
} & LayoutProps;

const OverviewPage = async ({ params }: ProductParams) => {
  const {
    hero,
    startInfo,
    feature,
    product,
    products,
    path,
    tutorials,
    postIntegration,
    relatedLinks,
    bannerLinks,
  } = await getOverview(params.productSlug);
  const { overview } = translations;
  const t = useTranslations('OverviewPage');

  return (
    <Layout
      products={products}
      product={product}
      path={path}
      bannerLinks={bannerLinks}
    >
      <Hero
        background={hero.backgroundImage}
        title={t(hero.title)}
        subtitle={t(hero.subtitle)}
        size='small'
        useHoverlay={false}
        altText={t(hero.altText)}
      />
      <Feature
        items={feature.items}
        title={t(feature.title)}
        subtitle={t(feature.subtitle)}
      />
      {startInfo && (
        <StartInfo
          title={t(overview.startInfo.title)}
          cta={startInfo.cta}
          cards={startInfo.cards}
        />
      )}
      {product.subpaths.tutorials && tutorials && (
        <TutorialsOverview
          title={t(overview.tutorial.title)}
          subtitle={t(tutorials.subtitle)}
          ctaLabel={t(overview.tutorial.ctaLabel)}
          tutorialPath={product.subpaths.tutorials}
          tutorials={[...(tutorials.list || [])]}
        />
      )}
      {product.subpaths.guides && postIntegration && (
        <PostIntegration
          title={t(overview.postIntegration.title)}
          subtitle={t(postIntegration.subtitle)}
          cta={
            postIntegration.cta && {
              label: t(postIntegration.cta.label),
              href: postIntegration.cta.href,
            }
          }
          listTitle={t(postIntegration.listTitle)}
          cards={postIntegration.list?.map((guide) => ({
            title: t(guide.title),
            text: t(guide.description),
            href: guide.path,
          }))}
          guides={postIntegration.guides}
        />
      )}
      {relatedLinks && (
        <RelatedLinks
          title={t(overview.relatedLinks.title)}
          links={relatedLinks.map(({ path, name }) => ({
            text: t(name),
            href: t(path),
          }))}
        />
      )}
    </Layout>
  );
};

export default OverviewPage;
