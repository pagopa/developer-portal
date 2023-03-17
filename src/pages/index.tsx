import { Box } from '@mui/material';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ComingSoon from '@/components/ComingSoon';
import BrowseIntegrations from '@/components/BrowseIntegrations';
import Highlighted from '@/components/Highlighted';
import HeroHome from '@/components/HeroHome';
import { GetStaticProps } from 'next';
import { HomePage } from '@/domain/home';
import { staticHomepage } from '@/adapters/static/staticHomepage';

export const getStaticProps: GetStaticProps<HomePage> = async () => ({
  props: staticHomepage,
});

const Home = (props: HomePage) => (
  <Box>
    <Header />
    <HeroHome {...props.hero} />
    <Highlighted {...props.highlighted} />
    <BrowseIntegrations {...props.integrations} />
    <ComingSoon {...props.comingSoon} />
    <Footer />
  </Box>
);

export default Home;
