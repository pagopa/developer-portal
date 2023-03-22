import { ProductOverview } from '@/domain/product';
import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import Breadcrumbs from './Breadcrumbs';

const HeroWithBreadcrumbs = ({
  title,
  description,
  cover,
}: ProductOverview['hero']) => (
  <Box
    bgcolor='#FFFFFF'
    sx={{
      backgroundImage: `url(${cover})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
    }}
  >
    <Container maxWidth='xl'>
      <Breadcrumbs />
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

export default HeroWithBreadcrumbs;
