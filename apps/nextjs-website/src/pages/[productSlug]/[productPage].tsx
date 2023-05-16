import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/Task';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import Footer from 'ui/components/Footer';
import Header from 'ui/components/Header';
import HeroWithBreadcrumbs from 'ui/components/HeroWithBreadcrumbs';
import ProductNavBar, { ProductNavBarProps } from 'ui/components/ProductNavBar';
import QuickStartPreview from 'ui/components/QuickStartPreview';
import TutorialPreview from 'ui/components/TutorialPreview';
import { Box, Stack } from '@mui/material';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ProductPage } from 'core/domain/productPage';
import HeroIntroWithBreadcrumbs from 'ui/components/HeroIntroWithBreadcrumbs';
import RelatedResources from 'ui/components/RelatedResources';
import QuickStartSteps from 'ui/components/QuickStartSteps';
import {
  findProductPageByPath,
  getAllProductPagePaths,
  nextEnv,
} from '@/lib/api';
import { BreadcrumbsProps } from 'ui/components/Breadcrumbs';
import GuideCollection from 'ui/components/GuideCollection';

type Params = {
  productSlug: string;
  productPage: string;
};

export const getStaticPaths: GetStaticPaths<Params> = async () => ({
  paths: await pipe(
    nextEnv,
    TE.chain(getAllProductPagePaths),
    TE.getOrElseW(() => T.of([]))
  )(),
  fallback: false,
});

type ProductPageProps = ProductPage &
  ProductNavBarProps & {
    breadcrumbs: BreadcrumbsProps['items'];
  };

export const getStaticProps: GetStaticProps<ProductPageProps, Params> = async ({
  params,
}) =>
  pipe(
    nextEnv,
    TE.chain(
      findProductPageByPath(`/${params?.productSlug}/${params?.productPage}`)
    ),
    TE.chain(TE.fromOption(() => new Error('Not Found'))),
    TE.bimap(
      () => ({ notFound: true as const }),
      (page) => ({ props: page })
    ),
    TE.toUnion
  )();

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
              return (
                <HeroWithBreadcrumbs
                  {...{ ...block, breadcrumbs: { items: props.breadcrumbs } }}
                />
              );
            case 'hero-info':
              return (
                <HeroIntroWithBreadcrumbs
                  {...{ ...block, breadcrumbs: { items: props.breadcrumbs } }}
                />
              );
            case 'quickstart-preview':
              return <QuickStartPreview {...block} />;
            case 'quickstart':
              return <QuickStartSteps {...block} />;
            case 'tutorial-preview':
              return <TutorialPreview {...block} />;
            case 'related-resources':
              return <RelatedResources {...block} />;
            case 'guide-collection':
              return <GuideCollection {...block} />;
          }
        })
      )}
      <Footer />
    </Stack>
  </Box>
);

export default ProductPage;
