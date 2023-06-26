import { Product } from '@/lib/types/product';
import Hero from '@pagopa/pagopa-editorial-components/dist/components/Hero';
import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
import { getGuides, getGuidesPaths } from '@/lib/api';

type Params = {
  productSlug: string;
};

export const getStaticPaths: GetStaticPaths<Params> = () => ({
  paths: getGuidesPaths() as string[],
  fallback: false,
});

export type GuidesPageProps = {
  readonly product: Product;
  readonly hero?: {
    readonly title: string;
    readonly subtitle: string;
  };
};

export const getStaticProps: GetStaticProps<GuidesPageProps, Params> = ({
  params,
}): GetStaticPropsResult<GuidesPageProps> => {
  const props = getGuides(params?.productSlug);
  if (props) {
    return { props };
  } else {
    return { notFound: true as const };
  }
};

const GuidesPage = ({ hero }: GuidesPageProps) => (
  <>
    <Hero title={hero?.title || 'missing title'} subtitle={hero?.subtitle} />
  </>
);

export default GuidesPage;
