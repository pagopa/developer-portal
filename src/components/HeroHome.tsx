import { Hero } from '@/domain/homepage';
import { Box, Container, Stack, Typography } from '@mui/material';

const HeroHome = ({ title, cover }: Hero) => (
  <Box
    sx={{
      backgroundImage: `url(${cover})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(0,98,195,0.65);',
      },
    }}
  >
    <Container maxWidth='md' sx={{ p: 32, position: 'relative' }}>
      <Stack spacing={5}>
        <Typography
          variant='body1'
          component='div'
          color='primary.contrastText'
          align='center'
        >
          {'PagoPA'}{' '}
          <Box fontWeight='fontWeightMedium' display='inline'>
            {'DevPortal'}
          </Box>
        </Typography>
        <Typography variant='h1' color='primary.contrastText' align='center'>
          {title}
        </Typography>
      </Stack>
    </Container>
  </Box>
);

export default HeroHome;
