import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import Breadcrumbs from './Breadcrumbs';

const Hero = () => (
  <Box
    bgcolor='#FFFFFF'
    sx={{
      backgroundImage: `url(https://github.com/pagopa/mui-italia/blob/main/src/components/Hero/assets/hero_background.png?raw=true)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
    }}
  >
    <Container maxWidth='xl'>
      <Breadcrumbs />
      <Grid container spacing={0} sx={{ py: 10 }}>
        <Grid item xs={5}>
          <Stack spacing={2}>
            <Typography variant='h1' color='text.primary'>
              Fai firmare documenti e contratti ai cittadini
            </Typography>
            <Typography variant='body1' color='text.primary'>
              Quis aute iure reprehenderit in voluptate velit esse cillum dolore
              eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non
              proident, sunt in culpa qui officia deserunt mollit anim id est
              laborum.
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default Hero;
