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
import Typography from '@mui/material/Typography';
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
        <Box bgcolor='background.paper' sx={{ p: 5 }}>
          <Container maxWidth='xl'>
            <Breadcrumbs
              items={makeBreadcrumbs(staticNav, useRouter().pathname)}
            />
            <Container maxWidth='md'>
              <Stack
                spacing={3}
                sx={{ pt: 10, pb: 5 }}
                justifyContent='center'
                textAlign='center'
              >
                <Typography variant='h4' color='text.primary'>
                  {props.title}
                </Typography>
                <Typography variant='body1' color='text.primary'>
                  {props.description}
                </Typography>
              </Stack>
            </Container>
          </Container>
        </Box>
        <Container maxWidth='lg'>
          <Stack spacing={3} sx={{ pt: 10, pb: 20 }}>
            <MuiMarkdown body={props.body} />
          </Stack>
        </Container>
        <Footer />
      </Stack>
    </Box>
  );
};

export default Tutorial;
