import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductNavBar, { ProductNavBarProps } from '@/components/ProductNavBar';
import { ProductGuidePage } from '@/domain/productGuidePage';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { GetStaticPaths, GetStaticProps } from 'next';
import ProductGuideMenu from '@/components/ProductGuideMenu';
import ProductGuideContent from '@/components/ProductGuideContent';
import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { useRouter } from 'next/router';
import {
  getAllProductGuidePagePaths,
  findProductGuidePageByPath,
  nextEnv,
} from '@/adapters/nextjs/lib';
import { makeMenuItem } from '@/domain/navigator';
import { BreadcrumbsProps } from '@/components/Breadcrumbs';

export type ProductGuidePageParams = {
  productSlug: string;
  productGuidePage: Array<string>;
};

export type ProductGuidePageProps = ProductGuidePage &
  ProductNavBarProps & {
    breadcrumbs: BreadcrumbsProps['items'];
  };

export const getStaticPaths: GetStaticPaths<
  ProductGuidePageParams
> = async () => ({
  paths: await pipe(
    nextEnv,
    TE.chain(getAllProductGuidePagePaths),
    TE.getOrElse(() => T.of(Array()))
  )(),
  fallback: false,
});

export const getStaticProps: GetStaticProps<
  ProductGuidePageProps,
  ProductGuidePageParams
> = async ({ params }) =>
  pipe(
    nextEnv,
    TE.chain(
      findProductGuidePageByPath(
        `/${params?.productSlug}/${params?.productGuidePage.join('/')}`
      )
    ),
    TE.chain(TE.fromOption(() => new Error('Not Found'))),
    TE.bimap(
      () => ({ notFound: true as const }),
      (page) => ({ props: page })
    ),
    TE.toUnion
  )();

const GuidePage = (props: ProductGuidePageProps) => {
  const currentPath = useRouter().asPath;
  return (
    <Box>
      <Stack>
        <Header />
        <ProductNavBar title={props.product.name} navLinks={props.navLinks} />
        <Stack direction='row' alignItems='stretch'>
          <ProductGuideMenu
            {...{
              ...props,
              versionsMenu: pipe(props.versionsNav, RA.filterMap(makeMenuItem)),
              currentPath,
            }}
          />
          <ProductGuideContent
            breadcrumbs={props.breadcrumbs}
            markdown={props.body}
          />
        </Stack>
        <Footer />
      </Stack>
    </Box>
  );
};

export default GuidePage;
