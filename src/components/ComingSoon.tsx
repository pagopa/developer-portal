import { Box, Card, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/ReadonlyArray';

const cardsContent = [
  {
    title: 'IO, l’app dei servizi pubblici',
    description: 'L’app per interagire in modo semplice e sicuro con i servizi pubblici locali e nazionali.',
  },
  {
    title: 'pagoPA, il nodo dei pagamenti',
    description: 'La piattaforma per effettuare pagamenti verso la Pubblica Amministrazione e non solo.',
  },
  {
    title: 'Piattaforma notifiche digitali',
    description: 'La piattaforma che consente di inviare, ricevere e gestire le comunicazioni a valore legale.',
  }
];

const ComingSoon = () => (
  <Box sx={{ backgroundColor: '#0073E6'}}>
    <Container maxWidth="xl">
        <Stack spacing={4} p={10}>
            <Typography variant="overline" color={'primary.contrastText'}>in arrivo su pagopa docs</Typography>
            <Box>
            <Grid container spacing={7} alignItems="stretch">
                {
                  pipe(
                    cardsContent,
                    RA.mapWithIndex((i, card) => (
                      <Grid item xs={6} md={4} key={i}>
                        <Paper elevation={0} sx={{ backgroundColor: 'rgba(27, 50, 77, 0.3)', padding: 6, borderRadius: '16px', minHeight: 170 }} >
                            <Stack spacing={4}>
                                <Typography variant="h6" color={'primary.contrastText'}>{card.title}</Typography>
                                <Typography variant="body2" color={'primary.contrastText'}>{card.description}</Typography>
                            </Stack>
                        </Paper>
                      </Grid>
                    ))
                  )
                }
            </Grid>
            </Box>
        </Stack>
    </Container>
  </Box>
);

export default ComingSoon;
