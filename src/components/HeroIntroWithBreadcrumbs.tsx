import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import Breadcrumbs from '@/components/Breadcrumbs';
import { makeBreadcrumbs } from '@/domain/navigator';
import { staticNav } from '@/adapters/static/staticNav';
import { useRouter } from 'next/router';

export type HeroIntroProps = {
  title: string;
  description: string;
};

const HeroIntroWithBreadcrumbs = (props: HeroIntroProps) => {
  const breadcrumbs = makeBreadcrumbs(staticNav, useRouter().asPath);
  return (
    <Box bgcolor='background.paper'>
      <Container maxWidth='xl'>
        <Breadcrumbs items={breadcrumbs} />
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
};

export default HeroIntroWithBreadcrumbs;
