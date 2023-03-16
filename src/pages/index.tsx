import { Box } from '@mui/material';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ComingSoon from '@/components/ComingSoon';
import BrowseIntegrations from '@/components/BrowseIntegrations';
import Highlighted from '@/components/Highlighted';
import HeroHome from '@/components/HeroHome';

const Home = () => (
  <Box>
    <Header />
    <HeroHome />
    <Highlighted />
    <BrowseIntegrations />
    <ComingSoon />
    <Footer />
  </Box>
);

export default Home;
