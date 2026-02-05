'use client';
import IconFireworks from '@/components/atoms/IconFireworks/IconFireworks';
import { Button, Typography } from '@mui/material';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import SingleCard from '@/components/atoms/SingleCard/SingleCard';
import { useParams } from 'next/navigation';

const AccountActivatedCard = () => {
  const { locale } = useParams<{ locale: string }>();
  const t = useTranslations('auth');

  return (
    <SingleCard
      icon={<IconFireworks />}
      title={t('accountActivated.yourAccountIsActive')}
      cta={
        <Button
          variant='contained'
          component={Link}
          href={`/${locale}/auth/login`}
        >
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
