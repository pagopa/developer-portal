import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import Breadcrumbs from '@/components/Breadcrumbs';
import { IntroBlock } from '@/domain/productQuickStartPage';

const Intro = (props: IntroBlock) => (
  <Box bgcolor='#FFFFFF'>
    <Container maxWidth='xl'>
      <Breadcrumbs />
      <Grid container spacing={0} sx={{ py: 10 }}>
        <Grid item xs={7}>
          <Stack spacing={3}>
            <Typography variant='h4' color='text.primary'>
              {props.title}
            </Typography>
            <Typography variant='body1' color='text.primary'>
              {props.description}
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  </Box>
);

export default Intro;
