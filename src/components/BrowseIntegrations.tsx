import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Integration } from '@/domain/homepage';

const BrowseIntegrations = (props: Integration) => (
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
          href={props.link}
        >
          {`Scopri di più`}
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
