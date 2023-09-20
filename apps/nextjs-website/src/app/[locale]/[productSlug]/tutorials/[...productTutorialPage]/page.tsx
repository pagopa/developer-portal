import Layout, { LayoutProps } from '@/components/organisms/Layout/Layout';
import EContainer from '@pagopa/pagopa-editorial-components/dist/components/EContainer';
import { getTutorial, getTutorialPaths, getProducts } from '@/lib/api';
import { Product } from '@/lib/types/product';
import GitBookContent from '@/components/organisms/GitBookContent/GitBookContent';
import { Box } from '@mui/material';
import { gitBookPagesWithTitle, spaceToPrefixMap } from '@/_contents/products';
import { ParseContentConfig } from 'gitbook-docs/parseContent';
import { useTranslations } from 'next-intl';

type Params = {
  productSlug: string;
  productTutorialPage: Array<string>;
};

export async function generateStaticParams() {
  return [...getTutorialPaths()].map(({ slug, guidePaths }) => ({
    productSlug: slug,
    productTutorialPage: guidePaths,
  }));
}

type ProductTutorialPageProps = {
  product: Product;
  path: string;
  body: string;
  bodyConfig: ParseContentConfig;
} & LayoutProps;

const Page = async ({ params }: { params: Params }) => {
  const t = useTranslations('TutorialPage');
  const productSlug = params?.productSlug;
  const tutorialPath = params?.productTutorialPage?.join('/');

  // This exit guard is necessary to avoid loading this page for favicon.svg caused by GitBookContent component
  if (/\.(svg|png|jpg|pdf)$/.test(tutorialPath)) {
    return null;
  }
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
          <GitBookContent content={t(props.body)} config={props.bodyConfig} />
        </Box>
      </EContainer>
    </Layout>
  );
};

export default Page;
