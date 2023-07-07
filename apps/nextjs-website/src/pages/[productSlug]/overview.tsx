import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
import { getOverview, getOverviewPaths, getProducts } from '@/lib/api';
import Hero from '@pagopa/pagopa-editorial-components/dist/components/Hero';
import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import { useTheme } from '@mui/material';
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

type Params = {
  productSlug: string;
};

export const getStaticPaths: GetStaticPaths<Params> = () => ({
  paths: getOverviewPaths() as string[],
  fallback: false,
});

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

export const getStaticProps: GetStaticProps<OverviewPageProps, Params> = ({
  params,
}): GetStaticPropsResult<OverviewPageProps> => {
  const props = getOverview(params?.productSlug);
  if (props) {
    return { props: { ...props, products: [...getProducts()] } };
  } else {
    return { notFound: true as const };
  }
};

const OverviewPage = ({
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
}: OverviewPageProps) => {
  const { overview } = translations;
  const { palette } = useTheme();

  return (
    <Layout
      products={products}
      product={product}
      path={path}
      bannerLinks={bannerLinks}
    >
      <Hero
        background={hero.backgroundImage}
        title={hero.title}
        subtitle={hero.subtitle}
        size='small'
        useHoverlay={false}
        altText={hero.altText}
      />
      <Feature
        items={feature.items}
        theme={palette.mode}
        title={feature.title}
        subtitle={feature.subtitle}
      />
      {startInfo && (
        <StartInfo
          title={overview.startInfo.title}
          cta={startInfo.cta}
          cards={startInfo.cards}
        />
      )}
      {product.subpaths.tutorials && tutorials && (
        <TutorialsOverview
          title={overview.tutorial.title}
          subtitle={tutorials.subtitle}
          ctaLabel={overview.tutorial.ctaLabel}
          tutorialPath={product.subpaths.tutorials}
          tutorials={[...(tutorials.list || [])]}
        />
      )}
      {product.subpaths.guides && postIntegration && (
        <PostIntegration
          title={overview.postIntegration.title}
          subtitle={postIntegration.subtitle}
          cta={
            postIntegration.cta && {
              label: postIntegration.cta.label,
              href: postIntegration.cta.href,
            }
          }
          listTitle={postIntegration.listTitle}
          cards={postIntegration.list?.map((guide) => ({
            title: guide.title,
            text: guide.description,
            href: guide.path,
          }))}
          guides={postIntegration.guides}
        />
      )}
      {relatedLinks && (
        <RelatedLinks
          title={overview.relatedLinks.title}
          links={relatedLinks.map(({ path, name }) => ({
            text: name,
            href: path,
          }))}
        />
      )}
    </Layout>
  );
};

export default OverviewPage;
