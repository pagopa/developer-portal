import { staticNav } from '@/adapters/static/staticNav';
import { ioSignTutorial } from '@/adapters/static/staticProduct';
import Breadcrumbs from '@/components/Breadcrumbs';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import MuiMarkdown from '@/components/MuiMarkdown';
import { makeBreadcrumbs } from '@/domain/navigator';
import { ProductTutorial } from '@/domain/product';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';

export const getStaticProps: GetStaticProps<ProductTutorial> = () => ({
  props: ioSignTutorial,
});


const Tutorial = (props: ProductTutorial) => {
  return (
    <Box>
      <Stack>
        <Header />
        <Box bgcolor='background.paper'>
          <Container maxWidth='xl' sx={{py: 6}}>
            <Breadcrumbs
              items={makeBreadcrumbs(staticNav, useRouter().pathname)}
            />
          </Container>
        </Box>
        <Container maxWidth='xl'>
          <Stack spacing={3} sx={{ py: 20 }}>
            <MuiMarkdown body={props.body} />
          </Stack>
        </Container>
        <Footer />
      </Stack>
    </Box>
  );
};

export default Tutorial;
