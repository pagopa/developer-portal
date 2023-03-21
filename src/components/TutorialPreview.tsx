import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ButtonNaked } from '@pagopa/mui-italia';
import { ProductTutorialPreview } from '@/domain/product';

const TutorialPreview = (props: ProductTutorialPreview) => (
  <Container
    maxWidth='xl'
    sx={{
      py: {
        xs: 4,
        sm: 4,
        md: 8,
      },
    }}
  >
    <Stack spacing={{ xs: 4, md: 4 }}>
      <Typography variant='h4'>{props.title}</Typography>

      <Card sx={{ display: 'flex' }}>
        <CardMedia
          component='img'
          sx={{ width: 350 }}
          image={`${props.tutorial.image.src}`}
          alt={`${props.tutorial.image.alt}`}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography variant='subtitle1' component='div'>
              {props.tutorial.date}
            </Typography>
            <Typography variant='h5' component='div'>
              {props.tutorial.title}
            </Typography>
            <Typography variant='body1' color='text.secondary' component='div'>
              {props.tutorial.description}
            </Typography>
            <ButtonNaked
              size='medium'
              color='primary'
              href={props.tutorial.link}
              // eslint-disable-next-line react/jsx-no-undef
              endIcon={<ArrowForwardIcon />}
            >
              {`Leggi`}
            </ButtonNaked>
          </CardContent>
        </Box>
      </Card>
    </Stack>
  </Container>
);

export default TutorialPreview;
