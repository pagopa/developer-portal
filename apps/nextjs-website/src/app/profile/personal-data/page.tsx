'use client';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { Auth } from 'aws-amplify';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { translations } from '@/_contents/translations';
import { InfoCardItemProps } from '@/components/atoms/InfoCardItem/InfoCardItem';
import DeleteSection from '@/components/molecules/DeleteSection/DeleteSection';
import { InfoCard } from '@/components/molecules/InfoCard/InfoCard';
import { ProfileInfoCard } from '@/components/organisms/Auth/ProfileInfoCard';
import { useUser } from '@/helpers/user.helper';
import { useRouter } from 'next/navigation';
import ConfirmationModal from '@/components/atoms/ConfirmationModal/ConfirmationModal';
import PasswordFormWrapper from '@/components/organisms/Auth/PasswordFormWrapper';
import EmailFormWrapper from '@/components/organisms/Auth/EmailFormWrapper';
import React, { useState } from 'react';

const PersonalData = () => {
  const {
    auth: {
      signUp: { companyRoles },
    },
  } = translations;
  const t = useTranslations('profile');
  const router = useRouter();
  const { user } = useUser();
  const [editItem, setEditItem] = useState<InfoCardItemProps | null>(null);
  const [showModal, setShowModal] = useState<'password' | 'email' | null>(null);

  async function handleChangePassword(
    oldPassword: string,
    newPassword: string
  ) {
    await Auth.changePassword(user, oldPassword, newPassword);
    setShowModal('password');
  }

  async function handleChangeEmail(newEmail: string) {
    await Auth.updateUserAttributes(user, { email: newEmail });
    setShowModal('email');
  }

  const dataSectionItems: InfoCardItemProps[] = [
    {
      name: 'name',
      title: t('personalData.fields.name'),
      value: user?.attributes.given_name,
    },
    {
      name: 'surname',
      title: t('personalData.fields.surname'),
      value: user?.attributes.family_name,
    },
    {
      name: 'role',
      title: t('personalData.fields.role'),
      value: user?.attributes['custom:job_role'],
    },
    {
      name: 'sector',
      title: t('personalData.fields.sector'),
      value: companyRoles.find(
        (role) => role.value === user?.attributes['custom:company_type']
      )?.title,
    },
  ];

  const accountSectionItems: InfoCardItemProps[] = [
    {
      name: 'email',
      title: t('personalData.fields.email'),
      value: user?.attributes.email,
      editable: true,
    },
    {
      name: 'password',
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
    const isPasswordItem: boolean = item.name === 'password';
    const isEmailItem: boolean = item.name === 'email';
    const showDivider = index !== items.length - 1;

    const isEditing = editItem?.name === item.name;

    return (
      <Box key={index}>
        {isPasswordItem && (
          <PasswordFormWrapper
            item={item}
            isEditing={isEditing}
            onCancel={() => setEditItem(null)}
            onSave={handleChangePassword}
            onEdit={() => setEditItem(item)}
          />
        )}
        {isEmailItem && (
          <EmailFormWrapper
            item={item}
            isEditing={isEditing}
            onCancel={() => setEditItem(null)}
            onSave={handleChangeEmail}
            onEdit={() => setEditItem(item)}
          />
        )}
        {showDivider && <Divider />}
      </Box>
    );
  };

  return (
    <>
      {showModal === 'password' && (
        <ConfirmationModal
          setOpen={() => null}
          open={true}
          title={t('changePassword.dialog.title')}
          text={t('changePassword.dialog.text')}
          confirmCta={{
            label: t('changePassword.dialog.confirmLabel'),
            onClick: () => {
              Auth.signOut().then(() => {
                router.replace('/auth/login');
              });
              return null;
            },
          }}
        />
      )}
      {showModal === 'email' && (
        <ConfirmationModal
          setOpen={() => null}
          open={true}
          title={t('changeEmail.dialog.title')}
          text={t('changeEmail.dialog.text')}
          confirmCta={{
            label: t('changeEmail.dialog.confirmLabel'),
            onClick: () => {
              // TODO: Uncomment this if necessary or remove it once defined the flow
              // Auth.signOut().then(() => {
              //   router.replace('/auth/login');
              // });
              typeof window !== 'undefined' && window.location.reload();
              return null;
            },
          }}
        />
      )}
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
