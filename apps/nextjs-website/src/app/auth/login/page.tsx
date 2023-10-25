import LoginForm from '@/components/organisms/Auth/LoginForm';
import { Box, Grid } from '@mui/material';
import { environment } from '@/config';
import PageNotFound from '@/app/not-found';

const Login = () => {
  return environment === 'prod' ? (
    <PageNotFound />
  ) : (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        backgroundImage: 'url(/images/hero.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom right',
      }}
    >
      <Grid container justifyContent='center' my={16} spacing={6}>
        <LoginForm />
      </Grid>
    </Box>
  );
};

export default Login;
