import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
import { Product } from '@/lib/types/product';
import { getOverview, getOverviewPaths } from '@/lib/api';
import Hero from '@pagopa/pagopa-editorial-components/dist/components/Hero';
import ApiViewer from '@/components/ApiViewer/ApiViewer';

type Params = {
  productSlug: string;
};

export const getStaticPaths: GetStaticPaths<Params> = () => ({
  paths: getOverviewPaths() as string[],
  fallback: false,
});

export type OverviewPageProps = {
  readonly product: Product;
  readonly hero?: {
    readonly title: string;
    readonly subtitle: string;
  };
};

export const getStaticProps: GetStaticProps<OverviewPageProps, Params> = ({
  params,
}): GetStaticPropsResult<OverviewPageProps> => {
  const props = getOverview(params?.productSlug);
  if (props) {
    return { props };
  } else {
    return { notFound: true as const };
  }
};

const OverviewPage = ({ hero }: OverviewPageProps) => (
  <>
    <Hero title={hero?.title || 'missing title'} subtitle={hero?.subtitle} />
    <ApiViewer />
  </>
);

export default OverviewPage;
