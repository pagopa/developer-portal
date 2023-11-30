'use client';
import {
  Box,
  Grid,
  Card,
  Snackbar,
  Alert,
  Stack,
  Typography,
  TextField,
  Button,
  Link,
} from '@mui/material';
import { IllusEmailValidation } from '@pagopa/mui-italia';
import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { LoaderPhase } from '@/lib/types/loader';
import ResendEmail from '@/components/molecules/ResendEmail/ResendEmail';
import { snackbarAutoHideDurationMs } from '@/config';

interface confirmLoginProps {
  email: string | null;
  onConfirmLogin: (code: string) => Promise<void>;

  invalidCode: boolean;
  resendLoader?: LoaderPhase;
  onResendCode: () => Promise<boolean>;
}

const ConfirmLogin = ({
  email,
  onConfirmLogin,
  invalidCode,
  onResendCode,
}: confirmLoginProps) => {
  const confirmLogin = useTranslations('auth.confirmLogin');

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [code, setCode] = useState<string>('');

  const onConfirmLoginHandler = useCallback(() => {
    setSubmitting(true);
    onConfirmLogin(code).catch((e) => {
      setError(e.message);
      setSubmitting(false);
    });
  }, [onConfirmLogin, code]);

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
              <Typography
                variant='body2'
                mb={6}
                dangerouslySetInnerHTML={{
                  __html: confirmLogin.raw('body').replace('{email}', email),
                }}
              />
            )}
            <Typography
              variant='body1'
              sx={{ marginBottom: 1.5, fontWeight: 600 }}
            >
              {confirmLogin('code')}
            </Typography>
            <Stack spacing={2} mb={4}>
              <TextField
                variant='outlined'
                size='small'
                onChange={(e) => setCode(e.target.value)}
                sx={{
                  backgroundColor: 'white',
                }}
                error={invalidCode}
              />
            </Stack>
            {invalidCode && (
              <Stack spacing={2} mb={2} mt={2}>
                <Stack direction='row' justifyContent='center'>
                  <Link
                    onClick={onResendCode}
                    underline='none'
                    variant='caption-semibold'
                    sx={{ cursor: 'pointer' }}
                  >
                    {confirmLogin('sendNewCode')}
                  </Link>
                </Stack>
              </Stack>
            )}
            <Stack spacing={4} pt={4} pb={4}>
              <Stack direction='row' justifyContent='center'>
                <Button
                  variant='contained'
                  disabled={submitting || invalidCode}
                  onClick={onConfirmLoginHandler}
                >
                  {confirmLogin('continue')}
                </Button>
              </Stack>
            </Stack>
            <Stack spacing={2} mt={2} mb={4}>
              <ResendEmail
                text={confirmLogin('checkHunkMail')}
                onResendEmail={onResendCode}
              />
            </Stack>
          </Grid>
        </Grid>
      </Card>
      <Snackbar
        open={!!error}
        autoHideDuration={snackbarAutoHideDurationMs}
        onClose={() => setError(null)}
      >
        <Alert severity='error'>{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ConfirmLogin;
