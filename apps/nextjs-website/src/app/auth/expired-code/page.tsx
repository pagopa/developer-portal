import { Button } from '@mui/material';
import ExpiredCodeCard from '@/components/organisms/Auth/ExpiredCodeCard';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import PageBackgroundWrapper from '@/components/atoms/PageBackgroundWrapper/PageBackgroundWrapper';

const ExpiredCode = () => {
  const t = useTranslations('auth');

  return (
    <PageBackgroundWrapper>
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
    </PageBackgroundWrapper>
  );
};

export default ExpiredCode;
