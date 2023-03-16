import {
  Box,
  Button,
  Card,
  CardContent,
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
  <Box>
    <Stack spacing={2} p={6}>
      <Typography variant='h4' textAlign='center'>
        In evidenza
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent='center'
        alignItems='center'
        spacing={3}
      >
        {elements.map((element) => (
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
        ))}
      </Stack>
    </Stack>
  </Box>
);

export default Highlighted;
