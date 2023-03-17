import { Box, Button } from '@mui/material';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ComingSoon from '@/components/ComingSoon';
import BrowseIntegrations from '@/components/BrowseIntegrations';
import Highlighted, { HighlightedElement } from '@/components/Highlighted';
import HeroHome from '@/components/HeroHome';
import FlagIcon from '@mui/icons-material/Flag';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const highlightedElements: ReadonlyArray<HighlightedElement> = [
  {
    icon: <FlagIcon color='primary' />,
    preTitle: 'QUICK START',
    title: 'Prepara i documenti per la firma',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
    href: '#',
    findMore: (
      <Button size='small' endIcon={<ArrowForwardIcon />}>
        Scopri di più
      </Button>
    ),
  },
  {
    icon: <VideoLibraryIcon color='primary' />,
    preTitle: 'TUTORIAL',
    title: 'Firma con IO in 3 minuti',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
    href: '#',
    findMore: (
      <Button size='small' endIcon={<ArrowForwardIcon />}>
        Scopri di più
      </Button>
    ),
  },
];

const Home = () => (
  <Box>
    <Header />
    <HeroHome
      title={{ plainWord: 'PagoPA', boldWord: 'DevPortal' }}
      subtitle='Tutto ciò che serve per integrarsi con l’ecosistema di servizi PagoPA'
      image='https://images.pexels.com/photos/5053835/pexels-photo-5053835.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    />
    <Highlighted title='In evidenza' elements={highlightedElements} />
    <BrowseIntegrations />
    <ComingSoon />
    <Footer />
  </Box>
);

export default Home;
