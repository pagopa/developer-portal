import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
import { Product } from '@/lib/types/product';

import { getApi, getApisPaths } from '@/lib/api';

import Hero from '@pagopa/pagopa-editorial-components/dist/components/Hero';
import { ApiViewer } from '@/components/ApiViewer/ApiViewer';

type Params = {
  productSlug: string;
};

export const getStaticPaths: GetStaticPaths<Params> = () => ({
  paths: getApisPaths() as string[],
  fallback: false,
});

export type ApisPageProps = {
  readonly product: Product;
  readonly hero?: {
    readonly title: string;
    readonly subtitle: string;
  };
  readonly yaml: string;
};

export const getStaticProps: GetStaticProps<ApisPageProps, Params> = ({
  params,
}): GetStaticPropsResult<ApisPageProps> => {
  const props = getApi(params?.productSlug);
  if (props) {
    return { props };
  } else {
    return { notFound: true as const };
  }
};

const ApisPage = ({ hero, yaml }: ApisPageProps) => (
  <>
    <Hero title={hero?.title || 'missing title'} subtitle={hero?.subtitle} />
    <ApiViewer url={yaml} />
  </>
);

export default ApisPage;
