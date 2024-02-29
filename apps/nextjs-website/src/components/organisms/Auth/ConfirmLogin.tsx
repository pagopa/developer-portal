'use client';
import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { IllusEmailValidation } from '@pagopa/mui-italia';
import { ChangeEvent, useCallback, useState } from 'react';
import ResendEmail from '@/components/molecules/ResendEmail/ResendEmail';
import { useTranslations } from 'next-intl';
import { useTheme } from '@mui/material';

interface confirmLoginProps {
  email: string | null;
  onConfirmLogin: (code: string) => Promise<void>;
  resendCode: () => Promise<boolean>;
}

const ConfirmLogin = ({
  email,
  onConfirmLogin,
  resendCode,
}: confirmLoginProps) => {
  const confirmLogin = useTranslations('auth.confirmLogin');

  const { palette } = useTheme();
  const [code, setCode] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, boolean>>({
    codeError: false,
    emptyCode: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChangeCode = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (errors) {
        setErrors({ codeError: false, emptyCode: false });
      }
      setCode(e.target.value);
    },
    [errors]
  );

  const onConfirmLoginHandler = useCallback(() => {
    setSubmitting(true);

    onConfirmLogin(code).catch((e) => {
      if (e.name === 'AuthError') {
        setErrors((prev) => ({ ...prev, emptyCode: true }));
      } else if (e.name === 'NotAuthorizedException') {
        setErrors((prev) => ({ ...prev, codeError: true }));
      }
      setSubmitting(false);
    });
  }, [onConfirmLogin, code]);

  const hasErrors = Object.values(errors).some((error) => error);
  const helperText = errors.codeError
    ? confirmLogin('invalidCode')
    : errors.emptyCode
    ? confirmLogin('emptyCode')
    : '';

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
      <Card variant='elevation' elevation={8} sx={{ borderRadius: '16px' }}>
        <Grid container justifyContent='center'>
          <Grid item xs={10}>
            <Stack pt={4} display='flex' alignItems='center'>
              <IllusEmailValidation />
            </Stack>
            <Typography variant='h4' pt={8} mb={5} textAlign='center'>
              {confirmLogin('title')}
            </Typography>
            {email && (
              <Typography variant='body2' mb={6}>
                {confirmLogin('confirmationCodeSent')}
                <Box component='span' fontWeight='fontWeightMedium'>
                  {email}
                </Box>
                <br />
                {confirmLogin('confirmationCodeExpires')}
              </Typography>
            )}
            <Typography
              variant='body1'
              sx={{ marginBottom: 1.5, fontWeight: 600 }}
            >
              {confirmLogin('code')}
            </Typography>
            <Stack spacing={2} mb={4}>
              <TextField
                error={hasErrors}
                helperText={helperText}
                size='small'
                sx={{
                  backgroundColor: palette.background.paper,
                }}
                variant='outlined'
                onChange={handleChangeCode}
              />
            </Stack>
            <Stack spacing={4} pt={4} pb={4}>
              <Stack direction='row' justifyContent='center'>
                <Button
                  variant='contained'
                  disabled={submitting}
                  onClick={onConfirmLoginHandler}
                >
                  {confirmLogin('continue')}
                </Button>
              </Stack>
            </Stack>
            {email && (
              <ResendEmail
                email={email}
                isLoginCTA={true}
                resendCode={resendCode}
                setSubmitting={setSubmitting}
                text={confirmLogin('checkJunkMail')}
              />
            )}
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default ConfirmLogin;
