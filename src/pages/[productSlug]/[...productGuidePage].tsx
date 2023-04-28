import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductNavBar, { ProductNavBarProps } from '@/components/ProductNavBar';
import { ProductGuidePage } from '@/domain/productGuidePage';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { GetStaticPaths, GetStaticProps } from 'next';
import ProductGuideNav from '@/components/ProductGuideNav';
import ProductGuideContent from '@/components/ProductGuideContent';
import { staticNav } from '@/adapters/static/staticNav';
import { makeMenu } from '@/domain/navigator';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { makeAppEnv } from '@/AppEnv';

type ProductGuidePageParams = {
  productSlug: string;
  productGuidePage: Array<string>;
};
type ProductGuidePageProps = ProductGuidePage & ProductNavBarProps;

export const getStaticPaths: GetStaticPaths<
  ProductGuidePageParams
> = async () => ({
  paths: await pipe(
    makeAppEnv(process.env),
    TE.chain(({ productGuidePageReader }) =>
      productGuidePageReader.getAllPaths()
    ),
    TE.bimap(
      () => [],
      (result) => [...result]
    ),
    TE.toUnion
  )(),
  fallback: false,
});

export const getStaticProps: GetStaticProps<
  ProductGuidePageProps,
  ProductGuidePageParams
> = async ({ params }) =>
  pipe(
    TE.Do,
    TE.apS('params', TE.fromNullable(new Error('params is undefined'))(params)),
    TE.apS('appEnv', makeAppEnv(process.env)),
    TE.chain(({ appEnv, params: { productSlug, productGuidePage } }) =>
      appEnv.productGuidePageReader.getPageBy(
        `/${productSlug}/${productGuidePage.join('/')}`
      )
    ),
    TE.chain(TE.fromOption(() => new Error('Not Found'))),
    TE.bimap(
      () => ({ notFound: true as const }),
      (page) => ({
        props: {
          navLinks: makeMenu(staticNav, page.product),
          // makeVersionMenu(productSlug, guideSlug)
          // guideNavLinks: makeGuideMenu(productSlug, guideSlug, versionSlug)
          ...page,
        },
      })
    ),
    TE.toUnion
  )();

const GuidePage = (props: ProductGuidePageProps) => (
  <Box>
    <Stack>
      <Header />
      <ProductNavBar {...props} />
      <Stack direction='row' alignItems='stretch'>
        <ProductGuideNav
          {...{ ...props, versions: '0', items: [] }}
        />
        <ProductGuideContent markdown={props.body} />
      </Stack>
      <Footer />
    </Stack>
  </Box>
);

export default GuidePage;
