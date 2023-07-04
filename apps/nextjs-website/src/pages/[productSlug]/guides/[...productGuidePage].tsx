import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import EContainer from '@pagopa/pagopa-editorial-components/dist/components/EContainer';
import { getGuidePaths, getGuide, getProducts } from '@/lib/api';
import { Product } from '@/lib/types/product';
import { renderGitBookMarkdown } from '@/markdoc';
import Stack from '@mui/material/Stack';
import { GetStaticPaths, GetStaticProps } from 'next/types';

type Params = {
  productSlug: string;
  productGuidePage: Array<string>;
};

export const getStaticPaths: GetStaticPaths<Params> = () => {
  return {
    paths: getGuidePaths() as string[],
    fallback: false,
  };
};

type ProductGuidePageProps = {
  product: Product;
  path: string;
  pathPrefix: string;
  assetsPrefix: string;
  menu: string;
  body: string;
} & LayoutProps;

export const getStaticProps: GetStaticProps<ProductGuidePageProps, Params> = ({
  params,
}) => {
  const productSlug = params?.productSlug;
  const guidePath = params?.productGuidePage.join('/');
  const path = `/${productSlug}/guides/${guidePath}`;
  const props = getGuide(path);
  if (props) {
    const page = {
      ...props.page,
      product: props.product,
      pathPrefix: props.source.pathPrefix,
      assetsPrefix: props.source.assetsPrefix,
      products: getProducts().concat(),
    };
    return { props: page };
  } else {
    return { notFound: true as const };
  }
};

const Page = (props: ProductGuidePageProps) => (
  <Layout products={props.products} product={props.product} path={props.path}>
    <EContainer>
      <Stack direction='row'>
        {renderGitBookMarkdown(
          props.menu,
          props.pathPrefix,
          props.assetsPrefix
        )}
        {renderGitBookMarkdown(
          props.body,
          props.pathPrefix,
          props.assetsPrefix
        )}
      </Stack>
    </EContainer>
  </Layout>
);

export default Page;
