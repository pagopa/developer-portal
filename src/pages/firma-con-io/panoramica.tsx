import { staticProductOverviewPage } from '@/adapters/static/staticProductOverviewPage';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroWithBreadcrumbs from '@/components/HeroWithBreadcrumbs';
import ProductNavBar, { ProductNavBarProps } from '@/components/ProductNavBar';
import QuickStartPreview from '@/components/QuickStartPreview';
import TutorialPreview from '@/components/TutorialPreview';
import { ProductOverview } from '@/domain/product';
import { Box, Stack } from '@mui/material';
import { GetStaticProps } from 'next';
import { makeMenu } from '@/domain/navigator';
import { staticNav } from '@/adapters/static/staticNav';

type ProductOverviewProps = ProductOverview & ProductNavBarProps;

export const getStaticProps: GetStaticProps<ProductOverviewProps> = () => ({
  props: {
    title: staticProductOverviewPage.product.name,
    navLinks: makeMenu(staticNav, staticProductOverviewPage.product),
    ...staticProductOverviewPage,
  },
});

const ProductOverview = (props: ProductOverviewProps) => (
  <Box>
    <Stack>
      <Header />
      <ProductNavBar {...props} />
      <HeroWithBreadcrumbs {...props.hero} />
      <QuickStartPreview {...props.quickStart} />
      <TutorialPreview {...props.tutorial} />
      <Footer />
    </Stack>
  </Box>
);

export default ProductOverview;
