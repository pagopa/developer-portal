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
    <HeroHome
      title={{ plainWord: 'PagoPA', boldWord: 'DevPortal' }}
      subtitle='Tutto ciò che serve per integrarsi con l’ecosistema di servizi PagoPA'
      image='https://images.pexels.com/photos/5053835/pexels-photo-5053835.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    />
    <Highlighted />
    <BrowseIntegrations />
    <ComingSoon />
    <Footer />
  </Box>
);

export default Home;
