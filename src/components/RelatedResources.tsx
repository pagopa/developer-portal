import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/ReadonlyArray';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeIcon from '@mui/icons-material/Code';
import FlagIcon from '@mui/icons-material/Flag';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { ProductPageReferences } from '@/domain/product';

const RelatedResources = (props: ProductPageReferences) => (
  <Box sx={{ backgroundColor: '#0073E6' }}>
    <Container maxWidth='xl'>
      <Stack spacing={2} py={6}>
        <Typography
          variant='h4'
          textAlign='center'
          color={'primary.contrastText'}
        >
          {props.title}
        </Typography>
        <Box>
          <Container maxWidth='md'>
            <Stack
              direction='row'
              spacing={3}
              justifyContent='center'
              alignItems='stretch'
            >
              {pipe(
                props.references,
                RA.mapWithIndex((i, element) => (
                  <Card
                    raised
                    sx={{
                      textAlign: 'center',
                      py: 6,
                    }}
                    key={i}
                  >
                    <CardContent>
                      <Box>
                        {element.type === 'api' && (
                          <CodeIcon color='primary' sx={{ fontSize: 60 }} />
                        )}
                        {element.type === 'guide' && (
                          <MenuBookIcon color='primary' sx={{ fontSize: 60 }} />
                        )}
                        {element.type === 'quickstart' && (
                          <FlagIcon color='primary' sx={{ fontSize: 60 }} />
                        )}
                        {element.type === 'tutorial' && (
                          <VideoLibraryIcon
                            color='primary'
                            sx={{ fontSize: 60 }}
                          />
                        )}
                      </Box>
                      <Typography
                        gutterBottom
                        variant='h6'
                        color='text.primary'
                      >
                        {element.type}
                      </Typography>
                      <Typography variant='body2' color='text.primary'>
                        {element.description}
                      </Typography>
                      <Button
                        size='small'
                        href={element.link}
                        endIcon={<ArrowForwardIcon />}
                      >
                        {'Scopri di più'}
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </Stack>
          </Container>
        </Box>
      </Stack>
    </Container>
  </Box>
);

export default RelatedResources;
