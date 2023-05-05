import * as O from 'fp-ts/Option';
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
import { makeMenu } from '@/domain/navigator';
import { staticNav } from '@/adapters/static/staticNav';
import { pipe } from 'fp-ts/lib/function';
import { ProductPage } from '@/domain/productPage';
import HeroIntroWithBreadcrumbs from '@/components/HeroIntroWithBreadcrumbs';
import RelatedResources from '@/components/RelatedResources';
import QuickStartSteps from '@/components/QuickStartSteps';
import { makeAppConfig } from '@/AppConfig';
import { makeAppEnv } from '@/AppEnv';

// TODO: Find a way to load the appEnv only once and
// somehow provides it to the entire application
const appEnv = pipe(
  TE.fromEither(makeAppConfig(process.env)),
  TE.chain(makeAppEnv)
);

type Params = {
  productSlug: string;
  productPage: string;
};

export const getStaticPaths: GetStaticPaths<Params> = async () => ({
  paths: await pipe(
    appEnv,
    TE.chain(({ productPageReader }) => productPageReader.getAllPaths()),
    TE.bimap(
      () => [],
      (result) => [...result]
    ),
    TE.toUnion
  )(),
  fallback: false,
});

type ProductPageProps = ProductPage & ProductNavBarProps;

export const getStaticProps: GetStaticProps<ProductPageProps, Params> = async ({
  params,
}) =>
  pipe(
    TE.Do,
    TE.apS('params', TE.fromNullable(new Error('params is undefined'))(params)),
    TE.apS('appEnv', appEnv),
    TE.chain(({ appEnv, params: { productSlug, productPage } }) =>
      appEnv.productPageReader.getPageBy(`/${productSlug}/${productPage}`)
    ),
    TE.chain(TE.fromOption(() => new Error('Not Found'))),
    TE.bimap(
      () => ({ notFound: true as const }),
      (page) => ({
        props: {
          navLinks: makeMenu(staticNav, page.product),
          ...page,
        },
      })
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
