'use client';
import { Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { useUser } from '@/helpers/user.helper';
import { InfoCardItemProps } from '@/components/atoms/InfoCardItem/InfoCardItem';
import { InfoCard } from '@/components/molecules/InfoCard/InfoCard';
import DeleteSection from '@/components/molecules/DeleteSection/DeleteSection';
import { translations } from '@/_contents/translations';
import { useEffect, useState } from 'react';

const PersonalData = () => {
  const {
    auth: {
      signUp: { companyRoles },
    },
  } = translations;
  const t = useTranslations('profile');
  const { user, setUserAttributes } = useUser();

  const [dataSectionItems, setDataSectionItems] = useState<InfoCardItemProps[]>(
    []
  );

  useEffect(() => {
    setDataSectionItems([
      {
        title: t('personalData.fields.name'),
        value: user?.attributes.given_name,
        editable: true,
        type: 'text',
      },
      {
        title: t('personalData.fields.surname'),
        value: user?.attributes.family_name,
        editable: true,
        type: 'text',
      },
      {
        title: t('personalData.fields.role'),
        value: user?.attributes['custom:job_role'],
        editable: true,
        type: 'text',
      },
      {
        title: t('personalData.fields.sector'),
        value: user?.attributes['custom:company_type'],
        editable: true,
        type: 'select',
        values: companyRoles,
      },
    ]);
  }, [user?.attributes]);

  const accountSectionItems: InfoCardItemProps[] = [
    {
      title: t('personalData.fields.email'),
      value: user?.attributes.email,
      editable: false,
      type: 'text',
    },
    {
      title: t('personalData.fields.password'),
      value: '••••••••••••',
      editable: false,
      type: 'text',
    },
  ];

  return (
    <Stack
      gap={5}
      sx={{ padding: { xs: '40px 24px', md: '80px 40px' }, width: '100%' }}
    >
      <Typography variant='h4'>{t('personalData.title')}</Typography>
      <InfoCard
        cardTitle={t('personalData.dataSection')}
        items={dataSectionItems}
        onValue={(items: InfoCardItemProps[]) => {
          const oldItems = [...dataSectionItems];

          if (!user) return;

          setUserAttributes(
            {
              ...user.attributes,
              given_name: items[0].value || '',
              family_name: items[1].value || '',
              'custom:job_role': items[2].value || '',
              'custom:company_type': items[3].value || '',
            },
            () => {
              setDataSectionItems(items);
              return null;
            },
            () => {
              setDataSectionItems(oldItems);
              return null;
            }
          );
        }}
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
