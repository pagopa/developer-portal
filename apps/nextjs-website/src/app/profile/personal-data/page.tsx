'use client';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { Auth } from 'aws-amplify';
import { useTranslations } from 'next-intl';
import { useUser } from '@/helpers/user.helper';
import {
  InfoCardItem,
  InfoCardItemProps,
} from '@/components/atoms/InfoCardItem/InfoCardItem';
import { InfoCard } from '@/components/molecules/InfoCard/InfoCard';
import DeleteSection from '@/components/molecules/DeleteSection/DeleteSection';
import { companyRoles } from '@/config';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PasswordFormWrapper from '@/components/organisms/Auth/PasswordFormWrapper';
import ConfirmationModal from '@/components/atoms/ConfirmationModal/ConfirmationModal';
import { ProfileInfoCard } from '@/components/organisms/Auth/ProfileInfoCard';

const PersonalData = () => {
  const companyRolesTranslations = useTranslations('auth.companyRoles');
  const t = useTranslations('profile');
  const router = useRouter();
  const { user } = useUser();
  const role = companyRoles.find(
    (role) => role === user?.attributes['custom:company_type']
  );
  const [editItem, setEditItem] = useState<InfoCardItemProps | null>(null);
  const [showModal, setShowModal] = useState(false);

  async function handleChangePassword(
    oldPassword: string,
    newPassword: string
  ) {
    await Auth.changePassword(user, oldPassword, newPassword);
    setShowModal(true);
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
      value: role ? companyRolesTranslations(`companyRoles.${role}`) : '',
    },
  ];

  const accountSectionItems: InfoCardItemProps[] = [
    {
      name: 'email',
      title: t('personalData.fields.email'),
      value: user?.attributes.email,
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
          <InfoCardItem {...item} onEdit={() => setEditItem(item)} />
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
