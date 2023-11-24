'use client';
import { LoaderPhase } from '@/lib/types/loader';
import { Done, ErrorOutline } from '@mui/icons-material';
import {
  Box,
  Grid,
  Card,
  Snackbar,
  Alert,
  Link,
  Stack,
  Typography,
  TextField,
  Divider,
  Button,
  CircularProgress,
} from '@mui/material';
import { IllusEmailValidation } from '@pagopa/mui-italia';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';

interface confirmLoginProps {
  invalidCode: boolean;
  resendLoader?: LoaderPhase;
  onBackStep: () => null;
  onResendCode: () => Promise<void>;
  onConfirmLogin: (code: string) => Promise<void>;
}

const ConfirmLogin = ({
  invalidCode,
  resendLoader,
  onBackStep,
  onResendCode,
  onConfirmLogin,
}: confirmLoginProps) => {
  const t = useTranslations();

  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const onconfirmLoginHandler = useCallback(() => {
    setSubmitting(true);

    onConfirmLogin(code)
      .catch((e) => setError(e.message))
      .finally(() => setSubmitting(false));
  }, [onConfirmLogin, code]);

  const buildLoder = () => {
    switch (resendLoader) {
      case LoaderPhase.LOADING:
        return (
          <CircularProgress size={14} sx={{ ml: 0.5, fontSize: 'inherit' }} />
        );
      case LoaderPhase.SUCCESS:
        return <Done sx={{ ml: 0.5, fontSize: 'small' }} />;
      case LoaderPhase.ERROR:
        return <ErrorOutline sx={{ ml: 0.5, fontSize: 'small' }} />;
      default:
        return null;
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
      <Card variant='elevation' elevation={8} sx={{ borderRadius: '16px' }}>
        <Grid container justifyContent='center'>
          <Grid item xs={10}>
            <Stack pt={4} display='flex' alignItems='center'>
              <IllusEmailValidation />
            </Stack>
            <Typography variant='h4' pt={8} mb={4} textAlign='center'>
              {t('auth.confirmLogin.title')}
            </Typography>
            <Typography variant='body2' mb={2}>
              {t('auth.confirmLogin.body')}
            </Typography>
            <Stack spacing={2} mb={4}>
              <TextField
                label={t('auth.confirmLogin.code')}
                variant='outlined'
                size='small'
                onChange={(e) => setCode(e.target.value)}
                sx={{
                  backgroundColor: 'white',
                }}
              />
            </Stack>
            <Stack spacing={2} mb={4}>
              <Typography component='p' variant='caption' mb={4}>
                {t('auth.confirmLogin.didntReceiveEmail')}{' '}
                <Link
                  onClick={onResendCode}
                  underline='none'
                  variant='caption-semibold'
                  sx={{ cursor: 'pointer' }}
                >
                  {t('auth.confirmLogin.resendEmail')}
                  {buildLoder()}
                </Link>
              </Typography>
            </Stack>
            <Stack spacing={4} pt={4} pb={2}>
              <Stack direction='row' justifyContent='center'>
                <Button
                  variant='contained'
                  disabled={submitting || invalidCode}
                  onClick={onconfirmLoginHandler}
                >
                  {t('auth.confirmLogin.send')}
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
              <Typography variant='caption-semibold' mr={1}>
                {t('auth.confirmLogin.wrongAccount')}
              </Typography>
              <Link
                variant='body2'
                onClick={onBackStep}
                sx={{ fontWeight: 600, cursor: 'pointer' }}
              >
                {t('shared.goBack')}
              </Link>
            </Stack>
          </Grid>
        </Grid>
      </Card>
      <Snackbar
        open={!!error}
        autoHideDuration={2000}
        onClose={() => setError(null)}
      >
        <Alert severity='error'>{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ConfirmLogin;
