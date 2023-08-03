import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import EContainer from '@pagopa/pagopa-editorial-components/dist/components/EContainer';
import Box from '@mui/material/Box';
import { getTutorial, getTutorialPaths, getProducts } from '@/lib/api';
import { Product } from '@/lib/types/product';
import GitBookContent from '@/components/organisms/GitBookContent/GitBookContent';
import { GetStaticPaths, GetStaticProps } from 'next/types';

type Params = {
  productSlug: string;
  productTutorialPage: Array<string>;
};

export const getStaticPaths: GetStaticPaths<Params> = () => {
  return {
    paths: getTutorialPaths() as string[],
    fallback: false,
  };
};

type ProductTutorialPageProps = {
  product: Product;
  path: string;
  pathPrefix: string;
  assetsPrefix: string;
  body: string;
} & LayoutProps;

export const getStaticProps: GetStaticProps<
  ProductTutorialPageProps,
  Params
> = ({ params }) => {
  const productSlug = params?.productSlug;
  const tutorialPath = params?.productTutorialPage.join('/');
  const path = `/${productSlug}/tutorials/${tutorialPath}`;
  const props = getTutorial(path);
  if (props) {
    const page = {
      ...props.page,
      product: props.product,
      pathPrefix: props.source.pathPrefix,
      assetsPrefix: props.source.assetsPrefix,
      products: getProducts().concat(),
      bannerLinks: props.bannerLinks,
    };
    return { props: page };
  } else {
    return { notFound: true as const };
  }
};

const Page = (props: ProductTutorialPageProps) => {
  return (
    <Layout
      products={props.products}
      product={props.product}
      path={props.path}
      bannerLinks={props.bannerLinks}
      showBreadcrumbs={false}
    >
      <EContainer>
        <Box>
          <GitBookContent
            assetsPrefix={props.assetsPrefix}
            pagePath={props.path}
            isPageIndex={false}
            content={props.body}
          />
        </Box>
      </EContainer>
    </Layout>
  );
};

export default Page;
