import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ButtonNaked } from '@pagopa/mui-italia';

const BrowseIntegrations = () => (
  <Container maxWidth='xl'>
    <Grid container spacing={2} p={6}>
      <Grid item xs={6}>
        <Typography variant='h4' pt={6} pb={6}>
          Esplora le risorse per l’integrazione
        </Typography>
        <Stack spacing={2}>
          <Typography variant='h6'>Firma con IO</Typography>
          <Typography variant='body2'>
            Grazie a Firma con IO, i cittadini possono firmare documenti e
            contratti in maniera semplice, veloce e sicura direttamente tramite
            l’app IO. Integrandosi unicamente con questa funzionalità, gli Enti
            possono gestire tutti i processi di firma in un unico posto.
          </Typography>
        </Stack>
        <ButtonNaked
          size='small'
          color='primary'
          sx={{
            pt: 3,
          }}
          endIcon={<ArrowForwardIcon color='primary' />}
        >
          Scopri di più
        </ButtonNaked>
      </Grid>
      <Grid item xs={6}>
        <Box
          sx={{
            width: '100%',
            height: '100%',
          }}
          component='img'
          alt='Immagine di firma con IO'
          src='https://images.unsplash.com/photo-1677324661707-3afad71c0307?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80'
        />
      </Grid>
    </Grid>
  </Container>
);

export default BrowseIntegrations;
