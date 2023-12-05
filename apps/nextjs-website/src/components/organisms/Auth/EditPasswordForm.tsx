import { ButtonNaked } from '@pagopa/mui-italia';
import { Stack, Typography } from '@mui/material';
import { useCallback, useState } from 'react';

import { translations } from '@/_contents/translations';
import { PasswordTextField } from './PasswordTextField';
import { useTranslations } from 'next-intl';
import { passwordMatcher } from '@/helpers/auth.helpers';

type EditPasswordFormProps = {
  onSave: (oldPassword: string, newPassword: string) => Promise<void>;
  // eslint-disable-next-line functional/no-return-void
  onCancel: () => void;
};

type Passwords = {
  current_password: string;
  new_password: string;
  password_confirm: string;
};

export const EditPasswordForm = ({
  onSave,
  onCancel,
}: EditPasswordFormProps) => {
  const { auth } = translations;
  const t = useTranslations('profile');
  const [errors, setErrors] = useState<Partial<Passwords>>({});
  const [passwords, setPasswords] = useState<Passwords>({
    current_password: '',
    new_password: '',
    password_confirm: '',
  });

  const validateForm = useCallback(() => {
    const { current_password, new_password, password_confirm } = passwords;
    // eslint-disable-next-line functional/no-let
    let err = {};

    if (!current_password) {
      err = { current_password: t('changePassword.requiredCurrentPassword') };
    }

    if (!passwordMatcher.test(new_password)) {
      err = { ...err, new_password: auth.signUp.passwordPolicy };
    } else if (new_password !== password_confirm) {
      err = { ...err, new_password: t('changePassword.passwordsNotMatch') };
    }

    setErrors(err);
    const hasErrors = Object.keys(err).length > 0;
    return !hasErrors;
  }, [passwords, auth.signUp.passwordPolicy, t]);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value, name },
    } = event;

    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onSave(passwords.current_password, passwords.new_password).catch(
      (error) => {
        if (error.code === 'NotAuthorizedException') {
          setErrors({ current_password: t('changePassword.wrongPassword') });
        } else {
          console.error(error);
        }
      }
    );
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
    <Stack>
      <Stack
        alignItems={{ xs: 'flex-start', md: 'center' }}
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={2}
        my={3}
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
        id='current_password'
        label={t('changePassword.currentPassword')}
        hasError={Reflect.has(errors, 'current_password')}
        helperText={errors.current_password}
        value={passwords.current_password}
        onChange={handlePasswordChange}
      />
      <PasswordTextField
        id='new_password'
        label={t('changePassword.newPassword')}
        value={passwords.new_password}
        hasError={Reflect.has(errors, 'new_password')}
        helperText={errors.new_password}
        onChange={handlePasswordChange}
      />
      <PasswordTextField
        id='password_confirm'
        label={t('changePassword.confirmPassword')}
        value={passwords.password_confirm}
        onChange={handlePasswordChange}
      />
      <Stack flexDirection='row' gap={4} display={{ xs: 'flex', md: 'none' }}>
        {actions}
      </Stack>
    </Stack>
  );
};
