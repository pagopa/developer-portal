import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import EContainer from '@pagopa/pagopa-editorial-components/dist/components/EContainer';
import { getTutorial, getTutorialPaths } from '@/lib/api';
import { Product } from '@/lib/types/product';
import GitBookContent from '@/components/organisms/GitBookContent/GitBookContent';
import { Box } from '@mui/material';

type TutorialParams = {
  params: {
    productSlug: string;
    productTutorialPage: Array<string>;
  };
};

export async function generateStaticParams() {
  return [...getTutorialPaths()].map(({ slug, guidePaths }) => ({
    prductSlug: slug,
    productTutorialPage: guidePaths,
  }));
}

type ProductTutorialPageProps = {
  product: Product;
  path: string;
  pathPrefix: string;
  assetsPrefix: string;
  body: string;
} & LayoutProps;

const Page = async ({ params }: TutorialParams) => {
  const props: ProductTutorialPageProps = await getTutorial(
    params.productSlug,
    params.productTutorialPage
  );

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
