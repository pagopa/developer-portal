import AccountActivated from '@/components/organisms/Auth/AccountActivated';
import { Box } from '@mui/material';

const Login = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '70vh',
        width: '100vw',
        backgroundImage: 'url(/images/hero.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom right',
      }}
    >
      <AccountActivated />
    </Box>
  );
};

export default Login;
