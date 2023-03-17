import { Box, Container, Stack, Typography } from '@mui/material';

type HeroHomeProps = {
  title: {
    plainWord: string;
    boldWord: string;
  };
  subtitle: string;
  image: string; // URL or path to a local image?
};

const HeroHome = ({ title, subtitle, image }: HeroHomeProps) => (
  <Box
    sx={{
      backgroundImage: `url(${image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundColor: '#0062C3',
      opacity: 65,
    }}
  >
    <Container maxWidth='md' sx={{ p: 32 }}>
      <Stack spacing={5}>
        <Typography
          variant='body1'
          component='div'
          color='primary.contrastText'
          align='center'
        >
          {title.plainWord}{' '}
          <Box fontWeight='fontWeightMedium' display='inline'>
            {title.boldWord}
          </Box>
        </Typography>
        <Typography variant='h1' color='primary.contrastText' align='center'>
          {subtitle}
        </Typography>
      </Stack>
    </Container>
  </Box>
);

export default HeroHome;
