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
    readonly altText?: string;
    readonly title: string;
    readonly subtitle: string;
  };
  readonly feature: {
    readonly title: string;
    readonly subtitle: string;
    readonly items: FeatureItem[];
  };
  readonly tutorials?: readonly Tutorial[];
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
  feature,
  product,
  products,
  path,
  tutorials,
}: OverviewPageProps) => {
  const { palette } = useTheme();

  return (
    <Layout products={products} product={product} path={path}>
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
      {product.subpaths.tutorial && tutorials && (
        <News
          tutorialPath={product.subpaths.tutorial}
          tutorials={[...tutorials]}
        />
      )}
    </Layout>
  );
};

export default OverviewPage;
