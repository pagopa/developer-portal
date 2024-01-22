'use client';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { Auth } from 'aws-amplify';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

import { translations } from '@/_contents/translations';
import { InfoCardItemProfileProps } from '@/components/atoms/InfoCardItem/InfoCardItemProfile';
import { InfoCardItemProps } from '@/components/atoms/InfoCardItem/InfoCardItem';
import DeleteSection from '@/components/molecules/DeleteSection/DeleteSection';
import { ProfileInfoCard } from '@/components/organisms/Auth/ProfileInfoCard';
import { useUser } from '@/helpers/user.helper';
import { useRouter } from 'next/navigation';
import ConfirmationModal from '@/components/atoms/ConfirmationModal/ConfirmationModal';
import PasswordFormWrapper from '@/components/organisms/Auth/PasswordFormWrapper';
import { InfoCardProfile } from '@/components/molecules/InfoCard/InfoCardProfile';
import EmailFormWrapper from '@/components/organisms/Auth/EmailFormWrapper';

const PersonalData = () => {
  const {
    auth: {
      signUp: { companyRoles },
    },
  } = translations;
  const t = useTranslations('profile');
  const router = useRouter();
  const { user, setUserAttributes } = useUser();

  const [profileDataSectionItems, setProfileDataSectionItems] = useState<
    InfoCardItemProfileProps[]
  >([]);

  useEffect(() => {
    setProfileDataSectionItems([
      {
        title: t('personalData.fields.name'),
        value: user?.attributes.given_name,
        editable: true,
        type: 'text',
        required: true,
      },
      {
        title: t('personalData.fields.surname'),
        value: user?.attributes.family_name,
        editable: true,
        type: 'text',
        required: true,
      },
      {
        title: t('personalData.fields.role'),
        value: user?.attributes['custom:job_role'],
        editable: true,
        type: 'text',
        required: false,
      },
      {
        title: t('personalData.fields.sector'),
        value: user?.attributes['custom:company_type'],
        editable: true,
        type: 'select',
        values: companyRoles,
        required: false,
      },
    ]);
  }, [user?.attributes]);

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
              setEditItem(null);
              setShowModal(null);
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
        <InfoCardProfile
          cardTitle={t('personalData.dataSection')}
          items={profileDataSectionItems}
          onValue={(items: InfoCardItemProfileProps[]) => {
            const oldItems = [...profileDataSectionItems];

            if (!user) return null;

            setUserAttributes(
              {
                ...user.attributes,
                ...{
                  given_name: items[0].value || user.attributes.given_name,
                  family_name: items[1].value || user.attributes.family_name,
                  'custom:job_role': items[2].value || '',
                  'custom:company_type':
                    items[3].value || user.attributes['custom:company_type'],
                },
              },
              () => {
                setProfileDataSectionItems(items);
                return null;
              },
              () => {
                setProfileDataSectionItems(oldItems);
                return null;
              }
            );
            return null;
          }}
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
