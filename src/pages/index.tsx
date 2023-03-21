import { Box } from '@mui/material';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ComingSoon from '@/components/ComingSoon';
import BrowseIntegrations from '@/components/BrowseIntegrations';
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
    <BrowseIntegrations {...props.integration} />
    <ComingSoon {...props.comingSoon} />
    <Footer />
  </Box>
);

export default Home;
