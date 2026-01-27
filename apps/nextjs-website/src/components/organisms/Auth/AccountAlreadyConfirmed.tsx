import PageBackgroundWrapper from '@/components/atoms/PageBackgroundWrapper/PageBackgroundWrapper';
import SingleCard from '@/components/atoms/SingleCard/SingleCard';
import { Button } from '@mui/material';
import { ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const AccountAlreadyConfirmed = () => {
  const accountAlreadyConfirmed = useTranslations(
    'auth.login.accountAlreadyConfirmed'
  );
  return (
    <PageBackgroundWrapper>
      <SingleCard
        icon={<ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main' }} />}
        title={accountAlreadyConfirmed('yourAccountIsAlreadyConfirmed')}
        cta={
          <Button
            component={Link}
            disabled={false}
            variant='contained'
            href='auth/login'
          >
            {accountAlreadyConfirmed('goToLogin')}
          </Button>
        }
      />
    </PageBackgroundWrapper>
  );
};
export default AccountAlreadyConfirmed;
