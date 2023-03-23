import { Box } from '@mui/material';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ComingSoon from '@/components/ComingSoon';
import ProductPreview from '@/components/ProductPreview';
import Highlighted from '@/components/Highlighted';
import HeroHome from '@/components/HeroHome';
import { GetStaticProps } from 'next';
import { staticHomepage } from '@/adapters/static/staticHomepage';
import { Homepage } from '@/domain/homepage';

export const getStaticProps: GetStaticProps<Homepage> = async () => ({
  props: staticHomepage,
});

const Home = (props: Homepage) => (
  <Box>
    <Header />
    <HeroHome {...props.hero} />
    <Highlighted {...props.highlighted} />
    <ProductPreview {...props.productPreview} />
    <ComingSoon {...props.comingSoon} />
    <Footer />
  </Box>
);

export default Home;
