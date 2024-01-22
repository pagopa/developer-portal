import { Box, Button } from '@mui/material';
import ExpiredCodeCard from '@/components/organisms/Auth/ExpiredCodeCard';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const ExpiredCode = () => {
  const t = useTranslations('auth');

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
      <ExpiredCodeCard
        cta={
          <Button
            variant='contained'
            component={Link}
            href='/profile/personal-data'
          >
            {t('expiredCode.goToProfile')}
          </Button>
        }
      />
    </Box>
  );
};

export default ExpiredCode;
