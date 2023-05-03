import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductNavBar, { ProductNavBarProps } from '@/components/ProductNavBar';
import { ProductGuidePage } from '@/domain/productGuidePage';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { GetStaticPaths, GetStaticProps } from 'next';
import ProductGuideMenu from '@/components/ProductGuideMenu';
import ProductGuideContent from '@/components/ProductGuideContent';
import { staticNav } from '@/adapters/static/staticNav';
import { makeMenu, makeMenuItem } from '@/domain/navigator';
import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as TE from 'fp-ts/lib/TaskEither';
import { makeAppEnv } from '@/AppEnv';
import { useRouter } from 'next/router';
import { makeAppConfig } from '@/AppConfig';

// TODO: Find a way to load the appEnv only once and
// somehow provides it to the entire application
const appEnv = pipe(
  TE.fromEither(makeAppConfig(process.env)),
  TE.chain(makeAppEnv)
);

type ProductGuidePageParams = {
  productSlug: string;
  productGuidePage: Array<string>;
};
type ProductGuidePageProps = ProductGuidePage & ProductNavBarProps;

export const getStaticPaths: GetStaticPaths<
  ProductGuidePageParams
> = async () => ({
  paths: await pipe(
    appEnv,
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
    TE.apS('appEnv', appEnv),
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
          ...page,
        },
      })
    ),
    TE.toUnion
  )();

const GuidePage = (props: ProductGuidePageProps) => {
  const currentPath = useRouter().asPath;
  return (
    <Box>
      <Stack>
        <Header />
        <ProductNavBar {...props} />
        <Stack direction='row' alignItems='stretch'>
          <Box px={{ minWidth: 360 }}>
            <ProductGuideMenu
              {...{
                ...props,
                versionsMenu: pipe(
                  props.versionsNav,
                  RA.filterMap(makeMenuItem)
                ),
                selected: currentPath,
              }}
            />
          </Box>
          <ProductGuideContent markdown={props.body} />
        </Stack>
        <Footer />
      </Stack>
    </Box>
  );
};

export default GuidePage;
