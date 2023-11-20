'use client';

import { Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useUser } from '@/helpers/user.helper';
import { InfoCardItemProps } from '@/components/atoms/InfoCardItem/InfoCardItem';
import { InfoCard } from '@/components/molecules/InfoCard/InfoCard';
import PageNotFound from '@/app/not-found';
import DeleteSection from '@/components/molecules/DeleteSection/DeleteSection';

const PersonalData = () => {
  const t = useTranslations('profile');
  const { user, loading } = useUser();

  const dataSectionItems: InfoCardItemProps[] = [
    {
      title: t('personalData.fields.name'),
      value: user?.attributes.given_name,
    },
    {
      title: t('personalData.fields.surname'),
      value: user?.attributes.family_name,
    },
    {
      title: t('personalData.fields.role'),
      value: user?.attributes['custom:job_role'],
    },
    {
      title: t('personalData.fields.sector'),
      value: user?.attributes['custom:company_type'],
    },
  ];

  const accountSectionItems: InfoCardItemProps[] = [
    {
      title: t('personalData.fields.email'),
      value: user?.attributes.email,
    },
    {
      title: t('personalData.fields.password'),
      value: '••••••••••••',
    },
  ];

  // TODO: add dedicated loading and unauthorized pages
  if (!loading && !user) {
    return <PageNotFound />;
  }

  return (
    <Stack gap={5} sx={{ padding: 5, width: '100%' }}>
      <Typography variant='h4'>{t('personalData.title')}</Typography>
      <InfoCard
        cardTitle={t('personalData.dataSection')}
        items={dataSectionItems}
      />
      <InfoCard
        cardTitle={t('personalData.accountSection')}
        items={accountSectionItems}
      />
      <DeleteSection user={user} />
    </Stack>
  );
};

export default PersonalData;
