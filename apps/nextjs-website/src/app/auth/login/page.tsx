import LoginForm from '@/components/organisms/Auth/LoginForm';
import { Box } from '@mui/material';

const Login = () => {
  return (
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
