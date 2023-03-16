import { Box, Container, Stack, Typography } from '@mui/material';
import Breadcrumbs from './Breadcrumbs';

const Hero = () => (
  <>
    <Box
      bgcolor='#FFFFFF'
      sx={{
        backgroundImage: `url(https://github.com/pagopa/mui-italia/blob/main/src/components/Hero/assets/hero_background.png?raw=true)`,
        backgroundSize: 'cover',
      }}
    >
      <Container maxWidth='xl'>
        <Box
          sx={{
            // maxWidth: '40rem',
            margin: '0 auto',
            py: { xs: 4, sm: 4, md: 8 },
          }}
        >
          <Breadcrumbs />
          <Stack spacing={4}>
            <Stack spacing={2}>
              <Typography variant='h1' color='text.primary'>
                Fai firmare documenti e contratti ai cittadini
              </Typography>
              <>
                <Typography variant='body1' color='text.primary'>
                  Quis aute iure reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint obcaecat
                  cupiditat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </Typography>
              </>
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  </>
);

export default Hero;
