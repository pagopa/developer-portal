import { Box } from '@mui/material';
import AccountActivatedCard from '@/components/organisms/Auth/AccountActivatedCard';

const AccountActivated = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        minHeight: '616px',
        backgroundImage: 'url(/images/hero.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom right',
      }}
    >
      <AccountActivatedCard />
    </Box>
  );
};

export default AccountActivated;
