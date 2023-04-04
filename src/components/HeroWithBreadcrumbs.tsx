import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import Breadcrumbs from './Breadcrumbs';
import { makeBreadcrumbs } from '@/domain/navigator';
import { staticNav } from '@/adapters/static/staticNav';
import { useRouter } from 'next/router';
import { HeroBlock } from '@/domain/pageBlock';

const HeroWithBreadcrumbs = ({ title, description, cover }: HeroBlock) => {
  console.log(JSON.stringify(useRouter()));
  const breadcrumbs = makeBreadcrumbs(staticNav, useRouter().asPath);
  return (
    <Box
      bgcolor='background.paper'
      sx={{
        backgroundImage: `url(${cover})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
      }}
    >
      <Container maxWidth='xl'>
        <Breadcrumbs items={breadcrumbs} />
        <Grid container spacing={0} sx={{ py: 10 }}>
          <Grid item xs={5}>
            <Stack spacing={2}>
              <Typography variant='h1' color='text.primary'>
                {title}
              </Typography>
              <Typography variant='body1' color='text.primary'>
                {description}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroWithBreadcrumbs;
