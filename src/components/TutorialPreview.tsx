import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Link,
  Typography,
} from '@mui/material';

const TutorialPreview = () => (
  <Container maxWidth='xl'>
    <Card sx={{ display: 'flex' }}>
      <CardMedia
        component='img'
        sx={{ width: 350 }}
        image='https://images.unsplash.com/photo-1677324661707-3afad71c0307?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80'
        alt='Live from space album cover'
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography variant='subtitle1' component='div'>
            13 luglio 2022
          </Typography>
          <Typography variant='h5' component='div'>
            Scopri Firma con IO in 3 minuti
          </Typography>
          <Typography variant='body1' color='text.secondary' component='div'>
            Con Piattaforma Notifiche, ricevi e gestisci nello stesso spazio
            tutti gli atti di notifica che ti inviano Enti e Pubbliche
            Amministrazioni.
          </Typography>
          <Link variant='body1' href='#' underline='none'>
            {'Leggi'}
          </Link>
        </CardContent>
      </Box>
    </Card>
  </Container>
);

export default TutorialPreview;
