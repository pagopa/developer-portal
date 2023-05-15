import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/Task';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroWithBreadcrumbs from '@/components/HeroWithBreadcrumbs';
import ProductNavBar, { ProductNavBarProps } from '@/components/ProductNavBar';
import QuickStartPreview from '@/components/QuickStartPreview';
import TutorialPreview from '@/components/TutorialPreview';
import { Box, Stack } from '@mui/material';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ProductPage } from '@/domain/productPage';
import HeroIntroWithBreadcrumbs from '@/components/HeroIntroWithBreadcrumbs';
import RelatedResources from '@/components/RelatedResources';
import QuickStartSteps from '@/components/QuickStartSteps';
import {
  findProductPageByPath,
  getAllProductPagePaths,
  nextEnv,
} from '@/adapters/nextjs/lib';
import { BreadcrumbsProps } from '@/components/Breadcrumbs';
import GuideCategoryPreview from '@/components/GuideCategoryPreview';

type Params = {
  productSlug: string;
  productPage: string;
};

export const getStaticPaths: GetStaticPaths<Params> = async () => ({
  paths: await pipe(
    nextEnv,
    TE.chain(getAllProductPagePaths),
    TE.getOrElse(() => T.of(Array()))
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
              return <GuideCategoryPreview {...block} />;
          }
        })
      )}
      <Footer />
    </Stack>
  </Box>
);

export default ProductPage;
