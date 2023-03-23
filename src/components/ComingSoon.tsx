import { Showcase } from '@/domain/homepage';
import { Box, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/ReadonlyArray';

const ComingSoon = ({ title, items }: Showcase) => (
  <Box sx={{ backgroundColor: 'primary.main' }}>
    <Container maxWidth='xl'>
      <Stack spacing={4} py={10}>
        <Typography variant='overline' color={'primary.contrastText'}>
          {title}
        </Typography>
        <Box>
          <Grid container spacing={7} alignItems='stretch'>
            {pipe(
              items,
              RA.mapWithIndex((i, card) => (
                <Grid item xs={6} md={4} key={i}>
                  <Paper
                    elevation={0}
                    sx={{
                      backgroundColor: 'primary.dark',
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
