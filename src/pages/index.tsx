import { Box, Container, Stack } from '@mui/material';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const Home = () => {
  // This is just an example. Here we are rendering a list of collections, using MUI-Italia components.
  // Data are fetched from GitBook, using GitBook API.
  return (
    <Box>
      <Stack>
        <Header />
        <Container maxWidth='lg'>asd</Container>
        <Footer />
      </Stack>
    </Box>
  );
};

export default Home;
