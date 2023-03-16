import { Box, Container, Stack, Typography } from '@mui/material';

const HeroHome = () => (
  <Box
    sx={{
      backgroundImage: `url(https://github.com/pagopa/mui-italia/blob/main/src/components/Hero/assets/hero_background.png?raw=true)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundColor: '#0062C3',
      opacity: 65,
    }}
  >
    <Container maxWidth='md' sx={{ p: 32 }}>
      <Stack spacing={5}>
        <Typography
          variant='body1'
          component='div'
          color='primary.contrastText'
          align='center'
        >
          PagoPA{' '}
          <Box fontWeight='fontWeightMedium' display='inline'>
            DevPortal
          </Box>
        </Typography>
        <Typography variant='h1' color='primary.contrastText' align='center'>
          Tutto ciò che serve per integrarsi con l’ecosistema di servizi PagoPA
        </Typography>
      </Stack>
    </Container>
  </Box>
);

export default HeroHome;
