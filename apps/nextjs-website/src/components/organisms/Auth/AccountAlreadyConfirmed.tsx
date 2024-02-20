import PageBackgroundWrapper from '@/components/atoms/PageBackgroundWrapper/PageBackgroundWrapper';
import SingleCard from '@/components/atoms/SingleCard/SingleCard';
import { Button } from '@mui/material';
import { IllusError } from '@pagopa/mui-italia';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const AccountAlreadyConfirmed = () => {
  const accountAlreadyConfirmed = useTranslations(
    'auth.login.accountAlreadyConfirmed'
  );
  return (
    <PageBackgroundWrapper>
      <SingleCard
        icon={<IllusError />}
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
