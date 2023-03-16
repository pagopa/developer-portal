import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

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
  <>
    <Stack
      spacing={2}
      sx={{
        p: 6,
      }}
    >
      <Typography variant='h4' textAlign='center'>
        In evidenza
      </Typography>
      <Grid container spacing={4}>
        {elements.map((element) => (
          <Grid item xs={6} alignItems='center'>
            <Card
              raised
              sx={{
                textAlign: 'center',
              }}
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
        ))}
      </Grid>
    </Stack>
  </>
);

export default Highlighted;
