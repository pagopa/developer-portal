import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductNavBar, { ProductNavBarProps } from '@/components/ProductNavBar';
import { ProductGuidePage } from '@/domain/productGuidePage';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { GetStaticPaths, GetStaticProps } from 'next';
import ProductGuideNav from '@/components/ProductGuideNav';
import ProductGuideContent from '@/components/ProductGuideContent';
import {
  getAllProductGuidePagePaths,
  getProductGuidePageBy,
} from '@/adapters/nextjs/productGuidePage';
import { staticNav } from '@/adapters/static/staticNav';
import { makeMenu } from '@/domain/navigator';

type ProductGuidePageParams = {
  productSlug: string;
  productGuidePage: Array<string>;
};
type ProductGuidePageProps = ProductGuidePage & ProductNavBarProps;

export const getStaticPaths: GetStaticPaths<
  ProductGuidePageParams
> = async () => ({
  paths: await getAllProductGuidePagePaths(),
  fallback: false,
});

export const getStaticProps: GetStaticProps<
  ProductGuidePageProps,
  ProductGuidePageParams
> = async ({ params }) => {
  const path = params
    ? `/${params.productSlug}/${params.productGuidePage.join('/')}`
    : undefined;

  const page = path ? await getProductGuidePageBy(path) : undefined;

  if (path && page) {
    // const menu = await getProductGuideMenuBy(path);
    return {
      props: {
        navLinks: makeMenu(staticNav, page.product),
        // makeVersionMenu(productSlug, guideSlug)
        // guideNavLinks: makeGuideMenu(productSlug, guideSlug, versionSlug)
        ...page,
      },
    };
  } else {
    return { notFound: true };
  }
};

const GuidePage = (props: ProductGuidePageProps) => (
  <Box>
    <Stack>
      <Header />
      <ProductNavBar {...props} />
      <Stack direction='row' alignItems='stretch'>
        <ProductGuideNav />
        <ProductGuideContent markdown={props.body} />
      </Stack>
      <Footer />
    </Stack>
  </Box>
);

export default GuidePage;
