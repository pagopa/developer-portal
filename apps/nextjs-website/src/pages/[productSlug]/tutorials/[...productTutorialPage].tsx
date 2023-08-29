import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import EContainer from '@pagopa/pagopa-editorial-components/dist/components/EContainer';
import { getTutorial, getTutorialPaths, getProducts } from '@/lib/api';
import { Product } from '@/lib/types/product';
import GitBookContent from '@/components/organisms/GitBookContent/GitBookContent';
import { GetStaticPaths, GetStaticProps } from 'next/types';
import { Box } from '@mui/material';
import { DocPage } from 'gitbook-docs/parseDoc';
import { gitBookContents } from '@/_contents/products';

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
  path: string;
  pathPrefix: string;
  assetsPrefix: string;
  body: string;
  gitBookPages: ReadonlyArray<Pick<DocPage<unknown>, 'page'>>;
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
      products: [...getProducts()],
      bannerLinks: props.bannerLinks,
      gitBookPages: gitBookContents,
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
            gitBookPages={props.gitBookPages}
          />
        </Box>
      </EContainer>
    </Layout>
  );
};

export default Page;
