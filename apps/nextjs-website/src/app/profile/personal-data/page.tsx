'use client';

import { Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useUser } from '@/helpers/user.helper';
import { InfoCardItemProps } from '@/components/atoms/InfoCardItem/InfoCardItem';
import { InfoCard } from '@/components/molecules/InfoCard/InfoCard';

const TermsOfService = () => {
  const t = useTranslations('profile');
  const user = useUser();

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
      title: t('personalData.fields.company'),
      // TODO: add company when available
    },
    {
      title: t('personalData.fields.sector'),
      value: user?.attributes['custom:company_type'],
    },
    {
      title: t('personalData.fields.products'),
      // TODO: add products when available
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

  return (
    <Stack gap={5} sx={{ padding: 5, width: '100%' }}>
      <Typography variant='h3'>{t('personalData.title')}</Typography>
      <InfoCard
        cardTitle={t('personalData.dataSection')}
        items={dataSectionItems}
      />

      <InfoCard
        cardTitle={t('personalData.accountSection')}
        items={accountSectionItems}
      />
    </Stack>
  );
};

export default TermsOfService;
