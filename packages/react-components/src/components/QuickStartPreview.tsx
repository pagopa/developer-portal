import { QuickStartPreviewBlock } from 'core/domain/pageBlock';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { pipe } from 'fp-ts/lib/function';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import Link from 'next/link';

const QuickStartPreview = (props: QuickStartPreviewBlock) => (
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
    <Stack alignContent='center' spacing={{ xs: 4, md: 8 }}>
      <Typography variant='h4' textAlign='center'>
        {props.title}
      </Typography>
      <Typography variant='body2' textAlign='center'>
        {props.description}
      </Typography>
      <Box
        sx={{
          gap: 3,
          gridTemplateColumns: {
            xs: 'repeat(6, minmax(0, 1fr))',
            md: 'repeat(12, minmax(0, 1fr))',
          },
        }}
      >
        <Box
          gridColumn={{
            xs: 'span 6',
            md: '2 / span 10',
          }}
        >
          <Stack
            direction='row'
            alignItems='flex-start'
            justifyContent={{ xs: 'flex-start', md: 'center' }}
            spacing={{ xs: 4, lg: 8 }}
            sx={{
              overflowX: { xs: 'scroll', md: 'hidden' },
              overflowY: 'hidden',
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              '&::after': {
                content: '""',
              },
            }}
          >
            {pipe(
              props.steps,
              RA.mapWithIndex((index, { title: itemTitle, description }) => (
                <Stack
                  key={index}
                  alignContent='center'
                  justifyContent='flex-start'
                  spacing={1}
                  sx={{
                    minWidth: { xs: '80%', sm: '40%', md: 'auto' },
                    flex: 1,
                    scrollSnapAlign: 'start',
                  }}
                >
                  <Typography
                    variant='h6'
                    color='primary.dark'
                    alignSelf='flex-start'
                  >
                    {(index + 1).toString().padStart(2, '0')}{' '}
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant='h5'>{itemTitle}</Typography>
                    <>
                      {description && (
                        <Typography variant='body2'>{description}</Typography>
                      )}
                    </>
                  </Stack>
                </Stack>
              ))
            )}
          </Stack>
        </Box>
      </Box>
      <Box display='flex' justifyContent='center' alignItems='center'>
        <Button
          size='medium'
          variant='contained'
          color='primary'
          href={props.link}
          component={Link}
        >
          Inizia
        </Button>
      </Box>
    </Stack>
  </Container>
);

export default QuickStartPreview;
