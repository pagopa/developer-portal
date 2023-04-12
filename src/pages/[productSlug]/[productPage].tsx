import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroWithBreadcrumbs from '@/components/HeroWithBreadcrumbs';
import ProductNavBar, { ProductNavBarProps } from '@/components/ProductNavBar';
import QuickStartPreview from '@/components/QuickStartPreview';
import TutorialPreview from '@/components/TutorialPreview';
import { Box, Stack } from '@mui/material';
import { GetStaticPaths, GetStaticProps } from 'next';
import { makeMenu } from '@/domain/navigator';
import { staticNav } from '@/adapters/static/staticNav';
import { pipe } from 'fp-ts/lib/function';
import {
  getProductPageBy,
  getProductPages,
} from '@/adapters/static/staticProductPage';
import { ProductPage } from '@/domain/productPage';
import HeroIntroWithBreadcrumbs from '@/components/HeroIntroWithBreadcrumbs';
import RelatedResources from '@/components/RelatedResources';
import QuickStartSteps from '@/components/QuickStartSteps';

type Params = {
  productSlug: string;
  productPage: string;
};

export const getStaticPaths: GetStaticPaths<Params> = () => ({
  paths: pipe(
    getProductPages(),
    RA.map(({ product, slug }) => ({
      params: { productSlug: product.slug, productPage: slug },
    })),
    (array) => [...array]
  ),
  fallback: false,
});

type ProductPageProps = ProductPage & ProductNavBarProps;

export const getStaticProps: GetStaticProps<ProductPageProps, Params> = (
  context
) =>
  pipe(
    O.fromNullable(context.params),
    O.chain(({ productSlug, productPage }) =>
      getProductPageBy(productSlug, productPage)
    ),
    O.foldW(
      () => ({ notFound: true }),
      (page) => ({
        props: {
          navLinks: makeMenu(staticNav, page.product),
          ...page,
        },
      })
    )
  );

const ProductPage = (props: ProductPageProps) => (
  <Box>
    <Stack>
      <Header />
      <ProductNavBar {...props} />
      {pipe(
        props.blocks,
        RA.map((block) => {
          switch (block.type) {
            case 'hero':
              return <HeroWithBreadcrumbs {...block} />;
            case 'hero-info':
              return <HeroIntroWithBreadcrumbs {...block} />;
            case 'quickstart-preview':
              return <QuickStartPreview {...block} />;
            case 'quickstart':
              return <QuickStartSteps {...block} />;
            case 'tutorial-preview':
              return <TutorialPreview {...block} />;
            case 'related-resources':
              return <RelatedResources {...block} />;
          }
        })
      )}
      <Footer />
    </Stack>
  </Box>
);

export default ProductPage;
