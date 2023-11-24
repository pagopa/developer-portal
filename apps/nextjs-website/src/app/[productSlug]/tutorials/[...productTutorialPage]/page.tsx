import ProductLayout, {
  ProductLayoutProps,
} from '@/components/organisms/ProductLayout/ProductLayout';
import EContainer from '@/editorialComponents/EContainer/EContainer';
import { getTutorial, getTutorialPaths } from '@/lib/api';
import { Product } from '@/lib/types/product';
import GitBookContent from '@/components/organisms/GitBookContent/GitBookContent';
import { Box } from '@mui/material';
import { gitBookPagesWithTitle, spaceToPrefixMap } from '@/_contents/products';
import { ParseContentConfig } from 'gitbook-docs/parseContent';
import { Metadata } from 'next';
import { makeMetadata } from '@/helpers/metadata.helpers';

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
} & ProductLayoutProps;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const productSlug = params?.productSlug;
  const tutorialPath = params?.productTutorialPage?.join('/');
  const {
    page: { path, title },
  } = await getTutorial(productSlug, [tutorialPath]);

  return makeMetadata({
    title,
    url: path,
  });
}

const Page = async ({ params }: { params: Params }) => {
  const productSlug = params?.productSlug;
  const tutorialPath = params?.productTutorialPage?.join('/');

  const tutorialProps = await getTutorial(productSlug, [tutorialPath]);
  const { product, page, bannerLinks, source } = tutorialProps;
  const props: ProductTutorialPageProps = {
    ...page,
    product,
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
    <ProductLayout
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
    </ProductLayout>
  );
};

export default Page;
