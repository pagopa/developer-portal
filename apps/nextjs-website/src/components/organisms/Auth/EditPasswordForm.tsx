import { Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { PasswordTextField } from './PasswordTextField';
import { useTranslations } from 'next-intl';
import { passwordMatcher } from '@/helpers/auth.helpers';

type EditPasswordFormProps = {
  // eslint-disable-next-line functional/no-return-void
  onCancel: () => void;
  onSave: (oldPassword: string, newPassword: string) => Promise<void>;
};

type Passwords = {
  currentPassword: string;
  newPassword: string;
  passwordConfirm: string;
};

export const EditPasswordForm = ({
  onSave,
  onCancel,
}: EditPasswordFormProps) => {
  const t = useTranslations('profile');
  const [errors, setErrors] = useState<Partial<Passwords>>({});
  const [passwords, setPasswords] = useState<Passwords>({
    currentPassword: '',
    newPassword: '',
    passwordConfirm: '',
  });

  const validateForm = () => {
    const { currentPassword, newPassword, passwordConfirm } = passwords;
    // eslint-disable-next-line functional/no-let
    let err = {};

    if (!currentPassword) {
      err = { currentPassword: t('changePassword.requiredCurrentPassword') };
    }

    if (!passwordMatcher.test(newPassword)) {
      err = { ...err, newPassword: t('changePassword.passwordPolicy') };
    } else if (newPassword !== passwordConfirm) {
      err = { ...err, newPassword: t('changePassword.passwordsNotMatch') };
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setErrors({});
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(passwords.currentPassword, passwords.newPassword).catch(
        (error) => {
          if (error.code === 'NotAuthorizedException') {
            setErrors({ currentPassword: t('changePassword.wrongPassword') });
          }
        }
      );
    }
  };

  const actions = (
    <>
      <>
        <Button
          color='primary'
          sx={{ paddingLeft: 0, paddingRight: 0 }}
          onClick={onCancel}
        >
          {t('changePassword.cancel')}
        </Button>
        <Button variant='contained' color='primary' onClick={handleSave}>
          {t('changePassword.save')}
        </Button>
      </>
    </>
  );

  return (
    <Stack gap={3}>
      <Stack
        alignItems={{ xs: 'flex-start', md: 'center' }}
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={2}
        mt={{ xs: 1, md: 3 }}
      >
        <Typography
          variant='body2'
          flexGrow={1}
          fontSize={16}
          minWidth={{ xs: 'auto', md: '170px' }}
        >
          {t('changePassword.title')}
        </Typography>
        <Stack flexDirection='row' gap={4} display={{ xs: 'none', md: 'flex' }}>
          {actions}
        </Stack>
      </Stack>
      <PasswordTextField
        id='currentPassword'
        label={t('changePassword.currentPassword')}
        hasError={Reflect.has(errors, 'currentPassword')}
        helperText={errors.currentPassword}
        value={passwords.currentPassword}
        onChange={handlePasswordChange}
      />
      <PasswordTextField
        id='newPassword'
        label={t('changePassword.newPassword')}
        value={passwords.newPassword}
        hasError={Reflect.has(errors, 'newPassword')}
        helperText={errors.newPassword}
        onChange={handlePasswordChange}
      />
      <PasswordTextField
        id='passwordConfirm'
        label={t('changePassword.confirmPassword')}
        value={passwords.passwordConfirm}
        onChange={handlePasswordChange}
      />
      <Stack flexDirection='row' gap={4} display={{ xs: 'flex', md: 'none' }}>
        {actions}
      </Stack>
    </Stack>
  );
};
