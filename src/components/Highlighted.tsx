import * as RA from 'fp-ts/ReadonlyArray';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { pipe } from 'fp-ts/lib/function';

const elements = [
  {
    icon: <FlagIcon color='primary' />,
    preTitle: 'QUICK START',
    title: 'Prepara i documenti per la firma',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
    href: '#',
  },
  {
    icon: <VideoLibraryIcon color='primary' />,
    preTitle: 'TUTORIAL',
    title: 'Firma con IO in 3 minuti',
    description: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
    href: '#',
  },
];

const Highlighted = () => (
    <Container maxWidth='xl'>
    <Stack spacing={2} py={6}>
      <Typography variant='h4' textAlign='center'>
        In evidenza
      </Typography>

        <Box>
          <Grid container spacing={7} alignItems='stretch'>
        {pipe(
          elements,
          RA.mapWithIndex((i, element) => (
            <Grid item xs={6} md={6} key={i}>
            <Card
              raised
              sx={{
                textAlign: 'center',
              }}
              key={i}
            >
              <CardContent>
                <Box>{element.icon}</Box>
                <Typography component='label' color='text.secondary'>
                  {element.preTitle}
                </Typography>
                <Typography gutterBottom variant='h6' color='text.primary'>
                  {element.title}
                </Typography>
                <Typography variant='body2' color='text.primary'>
                  {element.description}
                </Typography>
                <Button size='small'>
                  Scopri di più
                  <ArrowForwardIcon color='primary' />
                </Button>
              </CardContent>
            </Card>
              </Grid>
          ))
        )}
      </Grid>
    </Box>
    </Stack>
    </Container>
);

export default Highlighted;
