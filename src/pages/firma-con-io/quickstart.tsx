import { Box, Stack } from '@mui/material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductSubHeader from '@/components/ProductSubHeader';
import { ProductQuickStartPage } from '@/domain/productQuickStartPage';
import Intro from '@/components/Intro';
import QuickStartSteps from '@/components/QuickStartSteps';
import RelatedResources from '@/components/RelatedResources';
import { GetStaticProps } from 'next';
import { staticProductQuickStartPage } from '@/adapters/static/staticQuickStartPage';

export const getStaticProps: GetStaticProps<ProductQuickStartPage> = () => ({
  props: staticProductQuickStartPage, // Change the static element
});

const QuickStart = (props: ProductQuickStartPage) => (
  <Box>
    <Stack>
      <Header />
      <ProductSubHeader {...props} />
      <Intro {...props.intro} />
      <QuickStartSteps {...props} />
      <RelatedResources {...props.related} />
      <Footer />
    </Stack>
  </Box>
);

export default QuickStart;
