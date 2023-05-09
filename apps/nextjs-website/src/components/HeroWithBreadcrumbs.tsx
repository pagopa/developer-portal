import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import Breadcrumbs, { BreadcrumbsProps } from './Breadcrumbs';
import { HeroBlock } from '@/domain/pageBlock';

export type HeroWithBreadcrumbsProps = HeroBlock & {
  breadcrumbs: BreadcrumbsProps;
};

const HeroWithBreadcrumbs = ({
  title,
  description,
  cover,
  breadcrumbs,
}: HeroWithBreadcrumbsProps) => (
  <Box
    bgcolor='background.paper'
    sx={{
      backgroundImage: `url(${cover})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
    }}
  >
    <Container maxWidth='xl'>
      <Breadcrumbs {...breadcrumbs} />
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
