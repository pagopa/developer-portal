import { ButtonNaked } from '@pagopa/mui-italia';
import { Stack, Typography } from '@mui/material';
import { useCallback, useState } from 'react';

import { PasswordTextField } from './PasswordTextField';
import { useTranslations } from 'next-intl';
import { passwordMatcher } from '@/helpers/auth.helpers';

type EditPasswordFormProps = {
  onSave: (oldPassword: string, newPassword: string) => Promise<void>;
  // eslint-disable-next-line functional/no-return-void
  onCancel: () => void;
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

  const validateForm = useCallback(() => {
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
    const hasErrors = Object.keys(err).length > 0;
    return !hasErrors;
  }, [passwords, t]);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value, name },
    } = event;

    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onSave(passwords.currentPassword, passwords.newPassword).catch((error) => {
      if (error.code === 'NotAuthorizedException') {
        setErrors({ currentPassword: t('changePassword.wrongPassword') });
      } else {
        console.error(error);
      }
    });
  };

  const actions = (
    <>
      <ButtonNaked
        color='primary'
        sx={{ paddingLeft: 0, paddingRight: 0 }}
        onClick={onCancel}
      >
        {t('changePassword.cancel')}
      </ButtonNaked>
      <ButtonNaked variant='contained' color='primary' onClick={handleSave}>
        {t('changePassword.save')}
      </ButtonNaked>
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
