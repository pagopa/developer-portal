import { staticNav } from '@/adapters/static/staticNav';
import { ioSignTutorialPage } from '@/adapters/static/staticProduct';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroIntroWithBreadcrumbs from '@/components/HeroIntroWithBreadcrumbs';
import ProductNavBar, { ProductNavBarProps } from '@/components/ProductNavBar';
import RelatedResources from '@/components/RelatedResources';
import TutorialPreview from '@/components/TutorialPreview';
import { makeMenu } from '@/domain/navigator';
import { ProductTutorial } from '@/domain/product';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { GetStaticProps } from 'next';

type ProductTutorialProps = ProductTutorial & ProductNavBarProps;

export const getStaticProps: GetStaticProps<ProductTutorialProps> = () => ({
  props: {
    navLinks: makeMenu(staticNav, ioSignTutorialPage.product),
    ...ioSignTutorialPage,
  },
});

const ProductTutorial = (props: ProductTutorialProps) => (
  <Box>
    <Stack>
      <Header />
      <ProductNavBar {...props} />
      <HeroIntroWithBreadcrumbs {...props} />
      <TutorialPreview {...props.tutorial} />
      <RelatedResources {...props.related} />
      <Footer />
    </Stack>
  </Box>
);

export default ProductTutorial;
