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
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FlagIcon from '@mui/icons-material/Flag';
import { pipe } from 'fp-ts/lib/function';
import { ProductPageReferences } from '@/domain/product';

const Highlighted = ({ title, references }: ProductPageReferences) => (
  <Container maxWidth='xl'>
    <Stack spacing={2} py={6}>
      <Typography variant='h4' textAlign='center'>
        {title}
      </Typography>

      <Box>
        <Grid container spacing={7} alignItems='stretch'>
          {pipe(
            references,
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
                    <Box>
                      {element.type === 'quickstart' && (
                        <FlagIcon color='primary' />
                      )}
                      {element.type === 'tutorial' && (
                        <VideoLibraryIcon color='primary' />
                      )}
                    </Box>
                    <Typography component='label' color='text.secondary'>
                      {element.type}
                    </Typography>
                    <Typography gutterBottom variant='h6' color='text.primary'>
                      {element.title}
                    </Typography>
                    <Typography variant='body2' color='text.primary'>
                      {element.description}
                    </Typography>
                    <Button
                      size='small'
                      href={element.link}
                      endIcon={<ArrowForwardIcon />}
                    >
                      {`Scopri di più`}
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
