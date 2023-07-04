import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
import { getOverview, getOverviewPaths, getProducts } from '@/lib/api';
import Hero from '@pagopa/pagopa-editorial-components/dist/components/Hero';
import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import { Feature } from '@pagopa/pagopa-editorial-components';
import { useTheme } from '@mui/material';
import { FeatureItem } from '@pagopa/pagopa-editorial-components/dist/components/Feature/FeatureStackItem';
import { Product } from '@/lib/types/product';
import News from '@/components/organisms/News/News';
import { Tutorial } from '@/lib/types/tutorialData';
import StartInfo from '@/components/organisms/StartInfo/StartInfo';
import { translations } from '@/_contents/translations';
import RelatedLinks from '@/components/atoms/RelatedLinks/RelatedLinks';
import { Path } from '@/lib/types/path';
import LinkCards from '@/components/organisms/LinkCards/LinkCards';

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
  readonly tutorials?: readonly Tutorial[];
  readonly postIntegration?: readonly {
    readonly title: string;
    readonly description: string;
    readonly path: string;
    readonly name: string;
  }[];
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
        showCarouselMobile={false}
        theme={palette.mode}
        title={feature.title}
      />
      {startCards && (
        <StartInfo
          title={overview.startInfo.title}
          cta={overview.startInfo.cta}
          cards={startCards}
        />
      )}
      {product.subpaths.tutorial && tutorials && (
        <News
          tutorialPath={product.subpaths.tutorial}
          tutorials={[...tutorials]}
        />
      )}
      {product.subpaths.guides && postIntegration && (
        <LinkCards
          title={overview.guide.title}
          subtitle={overview.guide.subtitle}
          ctaLabel={overview.guide.ctaLabel}
          href={overview.guide.href}
          cardsTitle={overview.guide.cardsTitle}
          cards={postIntegration.map((guide) => ({
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
