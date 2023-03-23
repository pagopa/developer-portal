import { Box, Stack } from '@mui/material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroIntroWithBreadcrumbs from '@/components/HeroIntroWithBreadcrumbs';
import QuickStartSteps from '@/components/QuickStartSteps';
import RelatedResources from '@/components/RelatedResources';
import { GetStaticProps } from 'next';
import { staticProductQuickStartPage } from '@/adapters/static/staticQuickStartPage';
import ProductNavBar, { ProductNavBarProps } from '@/components/ProductNavBar';
import { ProductQuickStart } from '@/domain/product';
import { makeMenu } from '@/domain/navigator';
import { staticNav } from '@/adapters/static/staticNav';

type ProductQuickstartProps = ProductQuickStart & ProductNavBarProps;

export const getStaticProps: GetStaticProps<ProductQuickstartProps> = () => ({
  props: {
    navLinks: makeMenu(staticNav, staticProductQuickStartPage.product),
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
