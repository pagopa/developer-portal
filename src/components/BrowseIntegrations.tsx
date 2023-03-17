import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export type BrowseIntegrationsProps = {
  title: string;
  subtitle: string;
  description: string;
  findMore: {
    text: string;
    href: string;
  };
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
          {props.title}
        </Typography>
        <Stack spacing={2}>
          <Typography variant='h6'>{props.subtitle}</Typography>
          <Typography variant='body2'>{props.description}</Typography>
        </Stack>
        <ButtonNaked
          size='small'
          color='primary'
          sx={{
            pt: 3,
          }}
          endIcon={<ArrowForwardIcon color='primary' />}
          href={props.findMore.href}
        >
          {props.findMore.text}
        </ButtonNaked>
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
