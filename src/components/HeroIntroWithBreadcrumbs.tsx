import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import Breadcrumbs from '@/components/Breadcrumbs';

export type HeroIntroProps = {
  title: string;
  description: string;
};

const HeroIntroWithBreadcrumbs = (props: HeroIntroProps) => (
  <Box bgcolor='#FFFFFF'>
    <Container maxWidth='xl'>
      <Breadcrumbs />
      <Grid container spacing={0} sx={{ pt: 10, pb: 5 }}>
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

export default HeroIntroWithBreadcrumbs;
