import { staticProductOverviewPage } from '@/adapters/static/staticProductOverviewPage';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductSubHeader from '@/components/ProductSubHeader';
import QuickStartPreview from '@/components/QuickStartPreview';
import TutorialPreview from '@/components/TutorialPreview';
import { ProductOverviewPage } from '@/domain/productOverviewPage';
import { Box, Stack } from '@mui/material';
import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps<ProductOverviewPage> = () => ({
  props: staticProductOverviewPage,
});

const ProductOverview = (props: ProductOverviewPage) => (
  <Box>
    <Stack>
      <Header />
      <ProductSubHeader {...props} />
      <Hero {...props.hero} />
      <QuickStartPreview {...props.quickStart} />
      <TutorialPreview {...props.tutorial} />
      <Footer />
    </Stack>
  </Box>
);

export default ProductOverview;
