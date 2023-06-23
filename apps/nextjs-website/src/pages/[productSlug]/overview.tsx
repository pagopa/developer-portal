import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
import { Product } from '@/lib/types/product';
import { getOverview, getOverviewPaths } from '@/lib/api';

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
  <div>overviewPage - {hero?.title}</div>
);

export default OverviewPage;
