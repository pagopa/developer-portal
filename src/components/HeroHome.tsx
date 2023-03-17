import { Box, Container, Stack, Typography } from '@mui/material';

export type HeroHomeProps = {
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
