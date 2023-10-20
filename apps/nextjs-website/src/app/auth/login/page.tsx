import LoginForm from '@/components/organisms/Auth/LoginForm';
import { Box } from '@mui/material';
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
      }}
    >
      <LoginForm />
    </Box>
  );
};

export default Login;
