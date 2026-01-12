'use client';
import { Button } from '@mui/material';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import PageBackgroundWrapper from '@/components/atoms/PageBackgroundWrapper/PageBackgroundWrapper';
import SingleCard from '@/components/atoms/SingleCard/SingleCard';
import { ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';

const ExpiredCode = () => {
  const t = useTranslations('auth');

  return (
    <PageBackgroundWrapper>
      <SingleCard
        icon={<ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main' }} />}
        title={t('expiredCode.expiredLink')}
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
    </PageBackgroundWrapper>
  );
};

export default ExpiredCode;
