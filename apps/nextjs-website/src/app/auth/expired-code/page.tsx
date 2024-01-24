import { Button } from '@mui/material';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import PageBackgroundWrapper from '@/components/atoms/PageBackgroundWrapper/PageBackgroundWrapper';
import SingleCard from '@/components/atoms/SingleCard/SingleCard';
import { IllusError } from '@pagopa/mui-italia';

const ExpiredCode = () => {
  const t = useTranslations('auth');

  return (
    <PageBackgroundWrapper>
      <SingleCard
        icon={<IllusError />}
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
