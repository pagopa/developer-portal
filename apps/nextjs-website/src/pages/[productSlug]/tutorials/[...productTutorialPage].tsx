import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import EContainer from '@pagopa/pagopa-editorial-components/dist/components/EContainer';
import { getTutorial, getTutorialPaths, getProducts } from '@/lib/api';
import { Product } from '@/lib/types/product';
import GitBookContent from '@/components/organisms/GitBookContent/GitBookContent';
import { GetStaticPaths, GetStaticProps } from 'next/types';
import { Box } from '@mui/material';
import { gitBookPagesWithTitle, spaceToPrefix } from '@/_contents/products';
import { ParseContentConfig } from 'gitbook-docs/parseContent';

type Params = {
  productSlug: string;
  productTutorialPage: Array<string>;
};

export const getStaticPaths: GetStaticPaths<Params> = () => {
  return {
    paths: [...getTutorialPaths()],
    fallback: false,
  };
};

type ProductTutorialPageProps = {
  product: Product;
  // path: string;
  body: string;
  parseContentConfig: ParseContentConfig;
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
      products: [...getProducts()],
      bannerLinks: props.bannerLinks,
      parseContentConfig: {
        isPageIndex: props.page.isIndex,
        pagePath: props.page.path,
        assetsPrefix: props.source.assetsPrefix,
        gitBookPagesWithTitle,
        spaceToPrefix,
      },
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
        <Box sx={{ padding: '56px 0' }}>
          <GitBookContent
            content={props.body}
            parseContentConfig={props.parseContentConfig}
          />
        </Box>
      </EContainer>
    </Layout>
  );
};

export default Page;
