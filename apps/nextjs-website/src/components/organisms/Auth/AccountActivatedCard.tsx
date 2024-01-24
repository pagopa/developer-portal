'use client';
import IconFireworks from '@/components/atoms/IconFireworks/IconFireworks';
import { Typography, Button } from '@mui/material';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import SingleCard from '@/components/atoms/SingleCard/SingleCard';

const AccountActivatedCard = () => {
  const t = useTranslations('auth');

  return (
    <SingleCard
      icon={<IconFireworks />}
      title={t('accountActivated.yourAccountIsActive')}
      cta={
        <Button variant='contained' component={Link} href='/auth/login'>
          {t('accountActivated.goToLogin')}
        </Button>
      }
    >
      <Typography variant='body2' mb={2} textAlign='center'>
        {t('accountActivated.welcomeMessage')}
      </Typography>
    </SingleCard>
  );
};

export default AccountActivatedCard;
