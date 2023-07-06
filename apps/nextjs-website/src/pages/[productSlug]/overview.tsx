import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
import { getOverview, getOverviewPaths, getProducts } from '@/lib/api';
import Hero from '@pagopa/pagopa-editorial-components/dist/components/Hero';
import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
// import { Feature } from '@pagopa/pagopa-editorial-components';
import { useTheme } from '@mui/material';
// import { FeatureItem } from '@pagopa/pagopa-editorial-components/dist/components/Feature/FeatureStackItem';
import { Product } from '@/lib/types/product';
import { Tutorial } from '@/lib/types/tutorialData';
import StartInfo from '@/components/organisms/StartInfo/StartInfo';
import { translations } from '@/_contents/translations';
import RelatedLinks from '@/components/atoms/RelatedLinks/RelatedLinks';
import { Path } from '@/lib/types/path';
import LinkCards from '@/components/organisms/LinkCards/LinkCards';
import TutorialsOverview from '@/components/organisms/TutorialsOverview/TutorialsOverview';
import Feature from '@/editorialComponents/Feature/Feature';
import { FeatureItem } from '@/editorialComponents/Feature/FeatureStackItem';

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
  readonly startCards?: {
    readonly title: string;
    readonly text: string;
    readonly href: string;
    readonly iconName: string;
  }[];
  readonly tutorial: {
    readonly subtitle: string;
    readonly list?: readonly Tutorial[];
  };
  readonly postIntegration?: {
    readonly subtitle: string;
    readonly cardsTitle: string;
    readonly list: readonly {
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
  startCards,
  feature,
  product,
  products,
  path,
  tutorial,
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
      {startCards && (
        <StartInfo
          title={overview.startInfo.title}
          cta={overview.startInfo.cta}
          cards={startCards}
        />
      )}
      {product.subpaths.tutorial && tutorial && (
        <TutorialsOverview
          title={overview.tutorial.title}
          subtitle={tutorial.subtitle}
          ctaLabel={overview.tutorial.ctaLabel}
          tutorialPath={product.subpaths.tutorial}
          tutorials={[...(tutorial.list || [])]}
        />
      )}
      {product.subpaths.guides && postIntegration && (
        <LinkCards
          title={overview.postIntegration.title}
          subtitle={postIntegration.subtitle}
          cta={{
            label: overview.postIntegration.ctaLabel,
            href: overview.postIntegration.href,
          }}
          cardsTitle={postIntegration.cardsTitle}
          cards={postIntegration.list?.map((guide) => ({
            title: guide.title,
            text: guide.description,
            href: guide.path,
          }))}
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
