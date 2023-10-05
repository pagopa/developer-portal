import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { getTutorial, getTutorialPaths, getProducts } from '@/lib/api';
import { Product } from '@/lib/types/product';
import GitBookContent from '@/components/organisms/GitBookContent/GitBookContent';
import { Box } from '@mui/material';
import { gitBookPagesWithTitle, spaceToPrefixMap } from '@/_contents/products';
import { ParseContentConfig } from 'gitbook-docs/parseContent';
import { Metadata } from 'next';

type Params = {
  productSlug: string;
  productTutorialPage: Array<string>;
};

export async function generateStaticParams() {
  return [...getTutorialPaths()].map(({ slug, tutorialPaths }) => ({
    productSlug: slug,
    productTutorialPage: tutorialPaths,
  }));
}

type ProductTutorialPageProps = {
  product: Product;
  path: string;
  body: string;
  bodyConfig: ParseContentConfig;
} & LayoutProps;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const productSlug = params?.productSlug;
  const tutorialPath = params?.productTutorialPage?.join('/');
  const tutorialProps = await getTutorial(productSlug, [tutorialPath]);
  const { page } = tutorialProps;

  const body = page.body;
  const lines = body.split('\n').filter((line) => line !== '');
  const title = lines[0].replace('# ', '');

  return {
    title,
    openGraph: {
      title,
      url: page.path,
    },
    twitter: {
      site: title,
      card: 'summary',
      creator: '@pagopa',
    },
  };
}

const Page = async ({ params }: { params: Params }) => {
  const productSlug = params?.productSlug;
  const tutorialPath = params?.productTutorialPage?.join('/');

  const tutorialProps = await getTutorial(productSlug, [tutorialPath]);
  const { product, page, bannerLinks, source } = tutorialProps;
  const props: ProductTutorialPageProps = {
    ...page,
    product,
    products: [...getProducts()],
    bannerLinks,
    bodyConfig: {
      isPageIndex: false,
      pagePath: page.path,
      assetsPrefix: source.assetsPrefix,
      gitBookPagesWithTitle,
      spaceToPrefix: spaceToPrefixMap,
    },
  };

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
          <GitBookContent content={props.body} config={props.bodyConfig} />
        </Box>
      </EContainer>
    </Layout>
  );
};

export default Page;
