'use client';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { Auth } from 'aws-amplify';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { translations } from '@/_contents/translations';
import {
  InfoCardItem,
  InfoCardItemProps,
} from '@/components/atoms/InfoCardItem/InfoCardItem';
import DeleteSection from '@/components/molecules/DeleteSection/DeleteSection';
import { InfoCard } from '@/components/molecules/InfoCard/InfoCard';
import { EditPasswordForm } from '@/components/organisms/Auth/EditPasswordForm';
import { ProfileInfoCard } from '@/components/organisms/Auth/ProfileInfoCard';
import { useUser } from '@/helpers/user.helper';
import { useRouter } from 'next/navigation';
import ConfirmationModal from '@/components/atoms/ConfirmationModal/ConfirmationModal';

const PersonalData = () => {
  const {
    auth: {
      signUp: { companyRoles },
    },
  } = translations;
  const t = useTranslations('profile');
  const router = useRouter();
  const { user } = useUser();
  const [editItem, setEditItem] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  function handleSave(oldPassword: string, newPassword: string) {
    return Auth.changePassword(user, oldPassword, newPassword)
      .then(() => {
        setShowModal(true);
      })
      .catch((err: Error) => console.log(err));
  }

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
      value: companyRoles.find(
        (role) => role.value === user?.attributes['custom:company_type']
      )?.title,
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
      editable: true,
    },
  ];

  const renderItem = (
    item: InfoCardItemProps,
    index: number,
    items: InfoCardItemProps[]
  ) => {
    const isEditing = editItem === index;
    const showDivider = index !== items.length - 1;
    return (
      <Box key={index}>
        {isEditing ? (
          <EditPasswordForm
            onCancel={() => setEditItem(null)}
            onSave={handleSave}
          />
        ) : (
          <InfoCardItem {...item} onEdit={() => setEditItem(index)} />
        )}
        {showDivider && <Divider />}
      </Box>
    );
  };

  return (
    <>
      <ConfirmationModal
        setOpen={() => null}
        open={showModal}
        title='La password è stata modificata correttamente'
        text='Effettua l’accesso utilizzando la nuova password. Se sono presenti altre finestre del browser con accesso al tuo account tramite la vecchia password, assicurati di chiuderle.'
        confirmCta={{
          label: 'Vai a login',
          onClick: () => {
            Auth.signOut().then(() => {
              router.replace('/auth/login');
            });
            return null;
          },
        }}
      />
      <Stack
        gap={5}
        sx={{ padding: { xs: '40px 24px', md: '80px 40px' }, width: '100%' }}
      >
        <Typography variant='h4'>{t('personalData.title')}</Typography>
        <InfoCard
          cardTitle={t('personalData.dataSection')}
          items={dataSectionItems}
        />
        <ProfileInfoCard
          cardTitle={t('personalData.accountSection')}
          items={accountSectionItems}
          renderItem={renderItem}
        />
        <DeleteSection user={user} />
      </Stack>
    </>
  );
};

export default PersonalData;
