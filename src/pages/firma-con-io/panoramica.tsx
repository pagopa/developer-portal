import Breadcrumbs from '@/components/Breadcrumbs';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductSubHeader from '@/components/ProductSubHeader';
import QuickStartPreview from '@/components/QuickStartPreview';
import TutorialPreview from '@/components/TutorialPreview';
import { Box, Stack } from '@mui/material';

const pages = ([
  {
    title: "Panoramica",
    href: "/firma-con-io/panoramica",
  },
  {
    title: "Quick Start",
    href: "/firma-con-io/quick-start",
  }
])

const ProductOverview = () => (
  <Box>
    <Stack>
      <Header />
       <ProductSubHeader title={'Firma con IO'} pages={pages} />
        <Hero />
        <QuickStartPreview />
        <TutorialPreview />
      <Footer />
    </Stack>
  </Box>
);

export default ProductOverview;
