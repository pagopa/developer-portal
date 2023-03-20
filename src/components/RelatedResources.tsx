import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { RelatedResoucesBlock } from '@/domain/productQuickStartPage';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FlagIcon from '@mui/icons-material/Flag';

const RelatedResources = (props: RelatedResoucesBlock) => (
  <Box sx={{ backgroundColor: '#0073E6' }}>
    <Container maxWidth='xl'>
      <Stack spacing={4} py={10}>
        <Typography variant='overline' color={'primary.contrastText'}>
          {props.title}
        </Typography>
      </Stack>
      {pipe(
        props.previews,
        RA.mapWithIndex((i, element) => (
          <Card
            raised
            sx={{
              textAlign: 'center',
            }}
            key={i}
          >
            <CardContent>
              <Box>
                {element.type === 'quickstart' && <FlagIcon color='primary' />}
                {element.type === 'tutorial' && (
                  <VideoLibraryIcon color='primary' />
                )}
              </Box>
              <Typography component='label' color='text.secondary'>
                {element.preTitle}
              </Typography>
              <Typography gutterBottom variant='h6' color='text.primary'>
                {element.title}
              </Typography>
              <Typography variant='body2' color='text.primary'>
                {element.description}
              </Typography>
              <Button
                size='small'
                href={element.findMore.href}
                endIcon={<ArrowForwardIcon />}
              >
                {element.findMore.text}
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  </Box>
);

export default RelatedResources;
