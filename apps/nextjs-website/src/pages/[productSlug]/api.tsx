import { GetStaticPaths, GetStaticProps, GetStaticPropsResult } from 'next';
import { Product } from '@/lib/types/product';
import { getApi, getApiPaths } from '@/lib/api';
import { ApiViewer } from '@/components/atoms/ApiViewer/ApiViewer';

type Params = {
  productSlug: string;
};

export const getStaticPaths: GetStaticPaths<Params> = () => ({
  paths: [...getApiPaths()],
  fallback: false,
});

export type ApiPageProps = {
  readonly product: Product;
  readonly specURL: string;
};

export const getStaticProps: GetStaticProps<ApiPageProps, Params> = ({
  params,
}): GetStaticPropsResult<ApiPageProps> => {
  const props = getApi(params?.productSlug);
  if (props) {
    return { props };
  } else {
    return { notFound: true as const };
  }
};

const ApisPage = ({ specURL }: ApiPageProps) => (
  <>
    <ApiViewer specURL={specURL} />
  </>
);

export default ApisPage;
