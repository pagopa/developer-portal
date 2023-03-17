import { Box, Container, Grid, Stack, Typography } from '@mui/material';

type BrowseIntegrationsProps = {
  sectionTitle: string;
  integrationTitle: string;
  integrationDescription: string;
  findMore: JSX.Element;
  image: {
    src: string;
    alt: string;
  };
};

const BrowseIntegrations = (props: BrowseIntegrationsProps) => (
  <Container maxWidth='xl'>
    <Grid container spacing={2} py={6}>
      <Grid item xs={6}>
        <Typography variant='h4' py={6}>
          {props.sectionTitle}
        </Typography>
        <Stack spacing={2}>
          <Typography variant='h6'>{props.integrationTitle}</Typography>
          <Typography variant='body2'>
            {props.integrationDescription}
          </Typography>
        </Stack>
        {props.findMore}
      </Grid>
      <Grid item xs={6}>
        <Box
          sx={{
            width: '100%',
            height: '100%',
          }}
          component='img'
          alt={props.image.alt}
          src={props.image.src}
        />
      </Grid>
    </Grid>
  </Container>
);

export default BrowseIntegrations;
