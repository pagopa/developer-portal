'use client';
import { useTranslations } from 'next-intl';
import SingleCard from '@/components/atoms/SingleCard/SingleCard';
import { IllusError } from '@pagopa/mui-italia';

type ExpiredCodeCardProps = {
  cta?: React.ReactNode;
};

const ExpiredCodeCard = ({ cta }: ExpiredCodeCardProps) => {
  const t = useTranslations('auth');

  return (
    <SingleCard
      icon={<IllusError />}
      title={t('expiredCode.expiredLink')}
      cta={cta}
    />
  );
};

export default ExpiredCodeCard;
