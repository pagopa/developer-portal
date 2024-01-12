'use client';
import {
  Typography,
  Stack,
  Button,
  Divider,
  Link,
  Card,
  Grid,
  Box,
  TextField,
  useTheme,
} from '@mui/material';
import { validateEmail } from '@/helpers/auth.helpers';
import { IllusDataSecurity } from '@pagopa/mui-italia';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';

interface ResetPasswordFormProps {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  handleResetPassword: () => Promise<void>;
}

const ResetPasswordForm = ({
  email,
  setEmail,
  handleResetPassword,
}: ResetPasswordFormProps) => {
  const resetPassword = useTranslations('auth.resetPassword');
  const shared = useTranslations('shared');

  const [emailError, setEmailError] = useState<string | null>(null);

  const validateForm = useCallback(() => {
    const emailError = validateEmail(email);
    setEmailError(shared(emailError));

    return !emailError;
  }, [email, shared]);

  const onResetPassword = useCallback(() => {
    const valid = validateForm();
    if (!valid) {
      return;
    }

    handleResetPassword();
  }, [handleResetPassword, validateForm]);

  const { palette } = useTheme();

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
              <IllusDataSecurity />
            </Stack>
            <Typography variant='h4' pt={5} mb={4} textAlign='center'>
              {resetPassword('title')}
            </Typography>
            <Typography variant='body2' mb={4}>
              {resetPassword('body')}
            </Typography>
            <TextField
              label={shared('emailAddress')}
              value={email}
              onChange={({ target: { value } }) => setEmail(value)}
              helperText={emailError}
              error={!!emailError}
              size='small'
              sx={{
                backgroundColor: palette.background.paper,
                width: '100%',
              }}
            />
            <Stack spacing={4} pt={4} pb={2}>
              <Stack direction='row' justifyContent='center'>
                <Button variant='contained' onClick={onResetPassword}>
                  {resetPassword('send')}
                </Button>
              </Stack>
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
              <Link
                variant='body2'
                href='/auth/login'
                sx={{ fontWeight: 600, cursor: 'pointer' }}
              >
                {resetPassword('goBackToLogin')}
              </Link>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default ResetPasswordForm;
