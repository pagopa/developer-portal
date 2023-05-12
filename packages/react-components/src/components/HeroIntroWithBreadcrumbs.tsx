import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import Breadcrumbs, { BreadcrumbsProps } from './Breadcrumbs';

export type HeroIntroProps = {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbsProps;
};

const HeroIntroWithBreadcrumbs = (props: HeroIntroProps) => (
  <Box bgcolor='background.paper'>
    <Container maxWidth='xl'>
      <Breadcrumbs {...props.breadcrumbs} />
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
