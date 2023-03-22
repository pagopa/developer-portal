import { Box, Stack } from '@mui/material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroIntroWithBreadcrumbs from '@/components/HeroIntroWithBreadcrumbs';
import QuickStartSteps from '@/components/QuickStartSteps';
import RelatedResources from '@/components/RelatedResources';
import { GetStaticProps } from 'next';
import { staticProductQuickStartPage } from '@/adapters/static/staticQuickStartPage';
import ProductNavBar, { ProductNavBarProps } from '@/components/ProductNavBar';
import { staticProductNavigation } from '@/adapters/static/staticProductNavigation';
import { ProductQuickStart } from '@/domain/product';

type ProductQuickstartProps = ProductQuickStart & ProductNavBarProps;

export const getStaticProps: GetStaticProps<ProductQuickstartProps> = () => ({
  props: {
    navLinks: staticProductNavigation,
    ...staticProductQuickStartPage,
  },
});

const QuickStart = (props: ProductQuickstartProps) => (
  <Box>
    <Stack>
      <Header />
      <ProductNavBar {...props} />
      <HeroIntroWithBreadcrumbs {...props} />
      <QuickStartSteps {...props} />
      <RelatedResources {...props.related} />
      <Footer />
    </Stack>
  </Box>
);

export default QuickStart;
