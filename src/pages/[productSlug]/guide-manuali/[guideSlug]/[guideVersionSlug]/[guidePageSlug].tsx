import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  getProductGuidePageBy,
  getProductGuidePages,
} from '@/adapters/static/staticProductGuidePage';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductNavBar, { ProductNavBarProps } from '@/components/ProductNavBar';
import { ProductGuidePage } from '@/domain/productGuidePage';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { pipe } from 'fp-ts/lib/function';
import { GetStaticPaths, GetStaticProps } from 'next';
import { makeMenu } from '@/domain/navigator';
import { staticNav } from '@/adapters/static/staticNav';

type Params = {
  productSlug: string;
  guideSlug: string;
  guideVersionSlug: string;
  guidePageSlug: string;
};

export const getStaticPaths: GetStaticPaths<Params> = () => ({
  paths: pipe(
    getProductGuidePages(),
    RA.map(({ product, guideSlug, versionSlug, slug }) => ({
      params: {
        productSlug: product.slug,
        guideSlug,
        guideVersionSlug: versionSlug,
        guidePageSlug: slug,
      },
    })),
    (array) => [...array]
  ),
  fallback: false,
});

type ProductGuidePageProps = ProductGuidePage & ProductNavBarProps;

export const getStaticProps: GetStaticProps<ProductGuidePageProps, Params> = (
  context
) =>
  pipe(
    O.fromNullable(context.params),
    O.chain(({ productSlug, guideSlug, guideVersionSlug, guidePageSlug }) =>
      getProductGuidePageBy(
        productSlug,
        guideSlug,
        guideVersionSlug,
        guidePageSlug
      )
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

const GuidePage = (props: ProductGuidePageProps) => (
  <Box>
    <Stack>
      <Header />
      <ProductNavBar {...props} />
      <></>
      <Footer />
    </Stack>
  </Box>
);

export default GuidePage;
