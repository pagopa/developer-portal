import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
import { getOverview, getOverviewPaths, getProducts } from '@/lib/api';
import Hero from '@pagopa/pagopa-editorial-components/dist/components/Hero';
import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';

type Params = {
  productSlug: string;
};

export const getStaticPaths: GetStaticPaths<Params> = () => ({
  paths: getOverviewPaths() as string[],
  fallback: false,
});

export type OverviewPageProps = {
  readonly hero: {
    readonly title: string;
    readonly subtitle: string;
  };
} & LayoutProps;

export const getStaticProps: GetStaticProps<OverviewPageProps, Params> = ({
  params,
}): GetStaticPropsResult<OverviewPageProps> => {
  const props = getOverview(params?.productSlug);
  if (props) {
    return { props: { ...props, products: getProducts().concat() } };
  } else {
    return { notFound: true as const };
  }
};

const OverviewPage = ({ hero, product, products, slug }: OverviewPageProps) => {
  return (
    <Layout products={products} product={product} slug={slug}>
      <Hero title={hero.title} subtitle={hero.subtitle} />
    </Layout>
  );
};

export default OverviewPage;
