import { Box, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/ReadonlyArray';

export type CardContent = {
  title: string;
  description: string;
};

type ComingSoonProps = {
  title: string;
  cards: ReadonlyArray<CardContent>;
};

const ComingSoon = ({ title, cards }: ComingSoonProps) => (
  <Box sx={{ backgroundColor: '#0073E6' }}>
    <Container maxWidth='xl'>
      <Stack spacing={4} py={10}>
        <Typography variant='overline' color={'primary.contrastText'}>
          {title}
        </Typography>
        <Box>
          <Grid container spacing={7} alignItems='stretch'>
            {pipe(
              cards,
              RA.mapWithIndex((i, card) => (
                <Grid item xs={6} md={4} key={i}>
                  <Paper
                    elevation={0}
                    sx={{
                      backgroundColor: 'rgba(27, 50, 77, 0.3)',
                      padding: 6,
                      borderRadius: '16px',
                      minHeight: 170,
                    }}
                  >
                    <Stack spacing={4}>
                      <Typography variant='h6' color={'primary.contrastText'}>
                        {card.title}
                      </Typography>
                      <Typography
                        variant='body2'
                        color={'primary.contrastText'}
                      >
                        {card.description}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Stack>
    </Container>
  </Box>
);

export default ComingSoon;
