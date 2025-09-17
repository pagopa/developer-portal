import IconFireworks from '@/components/atoms/IconFireworks/IconFireworks';
import { Button } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import SingleCard from '@/components/atoms/SingleCard/SingleCard';

const PasswordChangedCard = () => {
  const resetPassword = useTranslations('auth.resetPassword');

  return (
    <SingleCard
      icon={<IconFireworks />}
      title={resetPassword('passwordSet')}
      cta={
        <Button variant='contained' component={Link} href='/auth/login'>
          {resetPassword('goToLogin')}
        </Button>
      }
    />
  );
};

export default PasswordChangedCard;
