import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
import { getOverview, getOverviewPaths, getProducts } from '@/lib/api';
import Hero from '@pagopa/pagopa-editorial-components/dist/components/Hero';
import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import { Product } from '@/lib/types/product';

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

const OverviewPage = ({ hero, product, products, path }: OverviewPageProps) => {
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
    </Layout>
  );
};

export default OverviewPage;
