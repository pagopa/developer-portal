'use client';
import { Security as SecurityIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { ChangeEvent, useCallback, useState } from 'react';
import { validatePassword } from '@/helpers/auth.helpers';
import { useTranslations } from 'next-intl';
import { PasswordTextField } from './PasswordTextField';

interface ChangePasswordFormProps {
  submitting?: boolean;
  // eslint-disable-next-line functional/no-return-void
  onSubmit: (password: string) => void;
}

interface ChangePasswordFieldsError {
  passwordError: boolean;
  confirmPasswordError: boolean;
}

const ChangePasswordForm = ({
  submitting = false,
  onSubmit,
}: ChangePasswordFormProps) => {
  const login = useTranslations('auth.login');
  const resetPassword = useTranslations('auth.resetPassword');
  const signUp = useTranslations('auth.signUp');
  const shared = useTranslations('shared');
  const { palette } = useTheme();

  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<ChangePasswordFieldsError>({
    passwordError: false,
    confirmPasswordError: false,
  });

  const handlePasswordChanged = (ev: ChangeEvent<HTMLInputElement>) => {
    setFieldErrors({
      passwordError: false,
      confirmPasswordError: false,
    });
    const { value, name } = ev.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = useCallback(() => {
    const { password, confirmPassword } = passwords;
    const passwordError = validatePassword(password);
    const confirmPasswordHasErrors = password !== confirmPassword;

    setFieldErrors({
      passwordError: passwordError !== null,
      confirmPasswordError: confirmPasswordHasErrors,
    });

    return !passwordError && !confirmPasswordHasErrors;
  }, [passwords]);

  const onChangePasswordClick = () => {
    if (validateForm()) {
      onSubmit(passwords.password);
    }
  };

  return (
    <Box
      component='section'
      sx={{
        width: '90vw',
        '@media (min-width: 1200px)': {
          width: '35vw',
        },
      }}
    >
      <Card variant='elevation' elevation={8}>
        <Grid container justifyContent='center'>
          <Grid item xs={10}>
            <Stack pt={4} display='flex' alignItems='center'>
              <SecurityIcon sx={{ fontSize: 80, color: 'primary.main' }} />
            </Stack>
            <Typography variant='h4' pt={8} mb={4} textAlign='center'>
              {resetPassword('newPassword')}
            </Typography>
            <Stack spacing={2} mb={2}>
              <PasswordTextField
                id='password'
                hasError={fieldErrors.passwordError}
                helperText={
                  fieldErrors.passwordError ? signUp('passwordPolicy') : ''
                }
                label={shared('password')}
                value={passwords.password}
                onChange={handlePasswordChanged}
              />
              <PasswordTextField
                id='confirmPassword'
                hasError={fieldErrors.confirmPasswordError}
                helperText={
                  fieldErrors.confirmPasswordError
                    ? signUp('passwordMismatchError')
                    : ''
                }
                label={shared('confirmPassword')}
                value={passwords.confirmPassword}
                onChange={handlePasswordChanged}
              />
            </Stack>
            <Stack
              direction='row'
              justifyContent='center'
              spacing={4}
              pt={4}
              pb={2}
            >
              <Button
                variant='contained'
                onClick={onChangePasswordClick}
                disabled={submitting}
              >
                {resetPassword('send')}
              </Button>
            </Stack>
            <Divider />
            <Stack
              pt={4}
              pb={8}
              display='flex'
              alignItems='center'
              justifyContent='center'
              flexDirection='row'
            >
              <Typography variant='caption-semibold' mr={1}>
                {resetPassword('rememberPassword')}
              </Typography>
              <Typography
                component={Link}
                fontSize={16}
                href='/auth/login'
                variant='caption-semibold'
                color={palette.primary.main}
              >
                {login('action')}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default ChangePasswordForm;
