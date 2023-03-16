import { Box, Button, Container, Stack, Typography } from '@mui/material';

const items = [
  {
    title: 'Prepara i documenti',
    description:
      "Prepara i documenti da inviare in firma all'utente nei formati previsti.",
  },
  {
    title: 'Crea una richiesta di firma',
    description: 'Crea un dossier contenente uno o più documenti.',
  },
  {
    title: 'Recupera il Codice Fiscale dell’utente',
    description:
      "Recupera l'ID del Cittadino effettuando una chiamata all'endpoint.",
  },
  {
    title: 'Invia la richiesta di firma',
    description:
      "Recupera l'ID del Cittadino effettuando una chiamata all'endpoint.",
  },
];

const QuickStartPreview = () => (
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
        Scopri quanto è semplice integrarsi
      </Typography>
      <Typography variant='body2' textAlign='center'>
        Firma con IO è una funzionalità che consente agli enti di richiedere la
        firma di documenti e di gestire i processi relativi in un unico posto.
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
            {items.map(({ title: itemTitle, description }, index) => (
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
                  variant='caption'
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
            ))}
          </Stack>
        </Box>
      </Box>
      <Box display='flex' justifyContent='center' alignItems='center'>
        <Button size='medium' variant='contained' color='primary'>
          Inizia
        </Button>
      </Box>
    </Stack>
  </Container>
);

export default QuickStartPreview;
