import { Box, Stack } from '@mui/material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroIntroWithBreadcrumbs from '@/components/HeroIntroWithBreadcrumbs';
import QuickStartSteps from '@/components/QuickStartSteps';
import RelatedResources from '@/components/RelatedResources';
import { GetStaticProps } from 'next';
import ProductNavBar, { ProductNavBarProps } from '@/components/ProductNavBar';
import { ProductQuickStart } from '@/domain/product';
import { makeMenu } from '@/domain/navigator';
import { staticNav } from '@/adapters/static/staticNav';
import { ioSignQuickStartPage } from '@/adapters/static/staticProduct';

type ProductQuickstartProps = ProductQuickStart & ProductNavBarProps;

export const getStaticProps: GetStaticProps<ProductQuickstartProps> = () => ({
  props: {
    navLinks: makeMenu(staticNav, ioSignQuickStartPage.product),
    ...ioSignQuickStartPage,
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
