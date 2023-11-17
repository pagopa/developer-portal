import LoginForm from '@/components/organisms/Auth/LoginForm';
import { Box, Grid } from '@mui/material';
import { isProduction } from '@/config';
import PageNotFound from '@/app/not-found';

const Login = () => {
  // TODO: remove this when resgistration flow is ready
  if (isProduction) {
    return <PageNotFound />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        backgroundImage: 'url(/images/hero.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom right',
      }}
    >
      <Grid
        container
        justifyContent='center'
        sx={{ mx: 'auto' }}
        my={6}
        spacing={6}
      >
        <LoginForm />
      </Grid>
    </Box>
  );
};

export default Login;
